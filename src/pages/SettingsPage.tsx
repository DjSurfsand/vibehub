import { useState, useEffect } from "react";
import { Settings, Save, Eye, Code, User, Globe, Image, Link as LinkIcon } from "lucide-react";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

/* ─── Types ─── */

interface ProfileData {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
  website: string;
  profile_html: string;
}

/* ─── Component ─── */

export default function SettingsPage() {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : null;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "myspace" | "accounts">("profile");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [previewHtml, setPreviewHtml] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileHtml, setProfileHtml] = useState("");

  // Fetch profile
  useEffect(() => {
    if (!userId) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          const p = data as ProfileData;
          setProfile(p);
          setDisplayName(p.display_name || "");
          setBio(p.bio || "");
          setWebsite(p.website || "");
          setAvatarUrl(p.avatar_url || "");
          setProfileHtml(p.profile_html || "");
        }
        setLoading(false);
      });
  }, [userId]);

  const saveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    setMessage(null);

    const updates = {
      display_name: displayName.trim(),
      bio: bio.trim(),
      website: website.trim(),
      avatar_url: avatarUrl.trim() || null,
      profile_html: profileHtml,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile saved! Refresh your profile page to see changes." });
      setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-10 h-10 rounded-lg bg-gradient-cta mx-auto animate-pulse" />
        <p className="text-body-sm text-text-secondary mt-4">Loading settings...</p>
      </div>
    );
  }

  const tabClass = (tab: string) =>
    `px-4 py-2 text-body-sm rounded-t-md border border-b-0 transition-colors ${
      activeTab === tab
        ? "bg-bg-card border-neon-cyan text-neon-cyan"
        : "bg-bg-deep border-border-subtle text-text-secondary hover:text-text-primary"
    }`;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-neon-cyan" />
        <h1 className="text-h1 text-text-primary">
          <span className="text-neon-cyan">/</span>settings
        </h1>
      </div>

      <div className="divider-neon mb-6" />

      {/* Tabs */}
      <div className="flex gap-0 mb-0">
        <button onClick={() => setActiveTab("profile")} className={tabClass("profile")}>
          <User className="w-4 h-4 inline mr-1.5" />
          Profile
        </button>
        <button onClick={() => setActiveTab("myspace")} className={tabClass("myspace")}>
          <Code className="w-4 h-4 inline mr-1.5" />
          MySpace HTML
        </button>
        <button onClick={() => setActiveTab("accounts")} className={tabClass("accounts")}>
          <LinkIcon className="w-4 h-4 inline mr-1.5" />
          Accounts
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-md mb-4 text-body-sm ${
            message.type === "success"
              ? "bg-neon-lime/10 border border-neon-lime text-neon-lime"
              : "bg-neon-red/10 border border-neon-red text-neon-red"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ── Profile Tab ── */}
      {activeTab === "profile" && (
        <div className="bg-bg-card border border-border-subtle rounded-b-md rounded-tr-md p-6 space-y-5">
          {/* Avatar */}
          <div>
            <label className="flex items-center gap-2 text-body-sm text-text-secondary mb-1.5">
              <Image className="w-4 h-4" /> Avatar URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="input-neon"
            />
            {avatarUrl && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={avatarUrl}
                  alt="Preview"
                  className="w-12 h-12 rounded border border-border-subtle object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <span className="text-mono-sm text-text-dim">Preview</span>
              </div>
            )}
          </div>

          {/* Display Name */}
          <div>
            <label className="flex items-center gap-2 text-body-sm text-text-secondary mb-1.5">
              <User className="w-4 h-4" /> Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How you appear to others"
              className="input-neon"
              maxLength={50}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="flex items-center gap-2 text-body-sm text-text-secondary mb-1.5">
              <Globe className="w-4 h-4" /> Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the world about yourself..."
              rows={4}
              className="input-neon"
              maxLength={300}
            />
            <p className="text-mono-sm text-text-dim mt-1">{bio.length}/300</p>
          </div>

          {/* Website */}
          <div>
            <label className="flex items-center gap-2 text-body-sm text-text-secondary mb-1.5">
              <LinkIcon className="w-4 h-4" /> Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://your-site.com"
              className="input-neon"
            />
          </div>

          {/* Save */}
          <div className="pt-2 border-t border-border-subtle flex items-center gap-3">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {profile && (
              <a
                href={`/profile/${profile.username}`}
                className="btn-ghost flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Profile
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── MySpace HTML Tab ── */}
      {activeTab === "myspace" && (
        <div className="bg-bg-card border border-border-subtle rounded-b-md rounded-tr-md p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-body-sm text-text-secondary">
                <Code className="w-4 h-4" /> Custom Profile HTML
              </label>
              <button
                onClick={() => setPreviewHtml(!previewHtml)}
                className="btn-ghost text-body-sm flex items-center gap-1.5"
              >
                <Eye className="w-3 h-3" />
                {previewHtml ? "Edit" : "Preview"}
              </button>
            </div>
            <p className="text-mono-sm text-text-dim mb-3">
              Style your profile like it's 2005. HTML, inline CSS, even &lt;script&gt; tags will work
              (runs in a sandboxed iframe). Background images, animated GIFs, glitter text —
              go wild.
            </p>

            {!previewHtml ? (
              <div className="html-editor">
                <textarea
                  value={profileHtml}
                  onChange={(e) => setProfileHtml(e.target.value)}
                  placeholder="<style>body { background: black; color: lime; }</style><h1>Welcome to my profile!</h1>"
                  spellCheck={false}
                />
              </div>
            ) : (
              <div className="html-preview-frame">
                <iframe
                  srcDoc={profileHtml || "<p style='color:#888;text-align:center;padding:2rem;'>Nothing here yet. Write some HTML!</p>"}
                  sandbox="allow-scripts"
                  title="Preview"
                  className="w-full min-h-[300px] border-0"
                />
              </div>
            )}
          </div>

          {/* Quick templates */}
          <div>
            <p className="text-mono-sm text-text-dim mb-2">Quick templates:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setProfileHtml(TEMPLATE_RETRO)}
                className="badge badge-magenta cursor-pointer"
              >
                Retro Glitter
              </button>
              <button
                onClick={() => setProfileHtml(TEMPLATE_MATRIX)}
                className="badge badge-lime cursor-pointer"
              >
                Matrix
              </button>
              <button
                onClick={() => setProfileHtml(TEMPLATE_VAPOR)}
                className="badge badge-cyan cursor-pointer"
              >
                Vaporwave
              </button>
              <button
                onClick={() => setProfileHtml(TEMPLATE_DARK)}
                className="badge cursor-pointer"
              >
                Dark Mode
              </button>
            </div>
          </div>

          {/* Save */}
          <div className="pt-2 border-t border-border-subtle flex items-center gap-3">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>
      )}

      {/* ── Linked Accounts Tab ── */}
      {activeTab === "accounts" && (
        <div className="bg-bg-card border border-border-subtle rounded-b-md rounded-tr-md p-6 space-y-5">
          <h3 className="text-h3 text-text-primary flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-neon-cyan" />
            Linked Accounts
          </h3>
          <div className="divider-subtle" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div>
                  <p className="text-body-sm text-text-primary">Google</p>
                  <p className="text-mono-sm text-text-dim">{auth.status === "authenticated" ? auth.user.email : "Not connected"}</p>
                </div>
              </div>
              <span className="badge badge-lime text-pixel">CONNECTED</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <div>
                  <p className="text-body-sm text-text-primary">Facebook</p>
                  <p className="text-mono-sm text-text-dim">Not connected</p>
                </div>
              </div>
              <button className="btn-ghost text-body-sm">Connect</button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="mt-6 p-4 rounded-md border border-neon-red/30">
            <h3 className="text-h3 text-neon-red mb-1">Danger Zone</h3>
            <p className="text-body-sm text-text-secondary mb-3">
              This action is permanent and cannot be undone.
            </p>
            <button className="btn-secondary !border-neon-red !text-neon-red hover:!bg-neon-red/10">
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── HTML Templates ─── */

const TEMPLATE_RETRO = `<style>
  body { background: #000; color: #ff0; font-family: "Comic Sans MS", cursive; margin: 1rem; }
  h1 { text-align: center; font-size: 2rem; text-shadow: 0 0 10px #f0f; animation: sparkle 2s infinite; }
  @keyframes sparkle { 50% { text-shadow: 0 0 20px #0ff, 0 0 30px #f0f; } }
  .glitter { background: linear-gradient(90deg, #f0f, #0ff, #ff0, #f0f); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>
<h1 class="glitter">&#9733; Welcome 2 My Profile &#9733;</h1>
<marquee scrollamount="8"><font color="cyan">&#9835;&#9835; Vibing 2 the sounds of the future &#9835;&#9835;</font></marquee>
<hr>
<p><b>Name:</b> [your name here]</p>
<p><b>Mood:</b> &#128640; Hyperspeed</p>
<p><b>Listening 2:</b> Synthwave Mix Vol. 4</p>
<hr>
<p><i>Don't forget to leave a comment!</i></p>`;

const TEMPLATE_MATRIX = `<style>
  body { background: #000; color: #0f0; font-family: "Courier New", monospace; padding: 1rem; overflow: hidden; }
  h1 { color: #0f0; text-shadow: 0 0 10px #0f0; text-align: center; font-size: 1.5rem; }
  .scanline { border: 1px solid #0f0; padding: 0.5rem; }
  p { margin: 0.25rem 0; }
  blink { animation: none; } /* overrides */
</style>
<h1>SYSTEM://ONLINE</h1>
<div class="scanline">
  <p>> USER_ID: [redacted]</p>
  <p>> ACCESS_LEVEL: ROOT</p>
  <p>> LAST_LOGIN: NOW</p>
  <p>> STATUS: WATCHING_THE_MATRIX</p>
  <p>> MOOD: FOCUSED.exe</p>
</div>`;

const TEMPLATE_VAPOR = `<style>
  body { background: linear-gradient(180deg, #ff6ec7, #7873f5); color: #fff; font-family: "Helvetica", sans-serif; padding: 1rem; text-align: center; }
  h1 { font-size: 2.5rem; text-shadow: 3px 3px 0 #000; margin-bottom: 0; }
  .statue { font-size: 3rem; }
  p { text-shadow: 1px 1px 0 rgba(0,0,0,0.5); }
  marquee { background: rgba(0,0,0,0.3); padding: 0.3rem; }
</style>
<div class="statue">&#9756;&#9756;</div>
<h1>A E S T H E T I C</h1>
<marquee scrollamount="5">~*~*~ D R E A M I N G  I N  8 0 s  N E O N ~*~*~</marquee>
<p><b>Currently:</b> Nostalgic</p>
<p><b>Vibe Level:</b> 100%</p>`;

const TEMPLATE_DARK = `<style>
  body { background: #111; color: #ddd; font-family: "Inter", sans-serif; padding: 1.5rem; }
  h1 { font-size: 1.5rem; color: #fff; border-bottom: 2px solid #333; padding-bottom: 0.5rem; }
  .bio { color: #999; font-style: italic; margin: 1rem 0; line-height: 1.6; }
  .links { display: flex; gap: 1rem; margin: 1rem 0; }
  .links a { color: #6af; text-decoration: none; }
</style>
<h1>Hello, I'm [your name]</h1>
<p class="bio">Building cool stuff with AI. Minimalist profile because the code speaks for itself.</p>
<div class="links">
  <a href="#">github</a> <a href="#">twitter</a> <a href="#">website</a>
</div>
<hr>
<p><i>Profile powered by VibeHub</i></p>`;