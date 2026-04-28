import { createClient } from "@supabase/supabase-js";

const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";

if (!SERVICE_KEY || !URL) {
  console.error("Set SUPABASE_SERVICE_KEY and SUPABASE_URL env vars");
  process.exit(1);
}

const supabase = createClient(URL, SERVICE_KEY);

async function main() {
  // 1. Check tables
  const tables = ["profiles", "projects", "votes", "comments", "posts", "news_articles"];
  for (const t of tables) {
    const { error } = await supabase.from(t).select("count", { count: "exact", head: true });
    console.log(`${t}:`, error ? `MISSING - ${error.message}` : "OK");
  }

  // 2. Check auth settings
  const { data: authSettings, error: authErr } = await supabase.auth.admin.listUsers();
  if (authErr) {
    console.log("\nAuth admin check:", authErr.message);
  } else {
    console.log(`\nUsers: ${authSettings.users.length} total`);
    authSettings.users.forEach(u => console.log(`  ${u.email} (${u.created_at})`));
  }

  // 3. Try creating a test user
  const testEmail = `test_${Date.now()}@vibehub.test`;
  const { data: newUser, error: signUpErr } = await supabase.auth.signUp({
    email: testEmail,
    password: "test123456",
  });
  if (signUpErr) {
    console.log(`\nSignup test failed: ${signUpErr.message}`);
  } else {
    console.log(`\nSignup test: OK - created ${newUser.user?.email}`);
  }

  // 4. Test the anon key
  if (ANON_KEY) {
    const anonClient = createClient(URL, ANON_KEY);
    const { error: anonErr } = await anonClient.from("projects").select("count", { count: "exact", head: true });
    console.log(`\nAnon key test:`, anonErr ? `FAILED - ${anonErr.message}` : "OK");
  }
}

main().catch(console.error);