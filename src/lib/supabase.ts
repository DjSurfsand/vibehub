import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client singleton.
 *
 * To configure:
 * 1. Go to https://supabase.com → New project
 * 2. Copy your Project URL and anon key from Settings → API
 * 3. Create a .env file in the project root:
 *      VITE_SUPABASE_URL=https://your-project.supabase.co
 *      VITE_SUPABASE_ANON_KEY=your-anon-key
 * 4. Restart the dev server
 *
 * Auth providers (Google, Facebook) must be enabled in
 * Supabase Dashboard → Authentication → Providers
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY not set. " +
    "Create a .env file with your Supabase project credentials."
  );
}

export const supabase = createClient(
  supabaseUrl || "http://localhost:54321",
  supabaseAnonKey || "placeholder-key"
);

/**
 * Auth provider config — maps Supabase provider names to display info.
 */
export const AUTH_PROVIDERS = {
  google: {
    label: "Google",
    icon: "🔵",
    description: "Link your Gmail account",
  },
  facebook: {
    label: "Facebook",
    icon: "🔷",
    description: "Link your Facebook account",
  },
  email: {
    label: "Email",
    icon: "✉️",
    description: "Sign in with email and password",
  },
} as const;

export type AuthProvider = keyof typeof AUTH_PROVIDERS;