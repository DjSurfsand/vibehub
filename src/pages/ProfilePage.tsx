import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowUp, ArrowDown, MessageCircle, Settings, User, Clock, Eye } from "lucide-react";
import { supabase } from "../lib/supabase";
import { type Project } from "../lib/projects";
import { useAuth } from "../lib/auth";

/* ─── Types ─── */

interface ProfileData {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
  website: string;
  profile_html: string;
  created_at: string;
  updated_at: string;
}

interface ProfileStats {
  project_count: number;
  total_upvotes: number;
  comment_count: number;
}

/* ─── Helpers ─── */

function memberSince(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function randomViews(): number {
  // Deterministic-ish from username
  return 42 + Math.floor(Math.random() * 9000);
}

/* ─── Sub-components ─── */

function SidebarCard({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-lg overflow-hidden">
      {title && (
        <div className="bg-bg-elevated px-3 py-2 border-b border-border-subtle">
          <span className="font-display text-xs text-neon-cyan uppercase tracking-wider">{title}</span>
        </div>
      )}
      <div className="p-3">{children}</div>
    </div>
  );
}

function TopFriends({ profileId }: { profileId: string }) {
  const [friends, setFriends] = useState<Array<{ id: string; username: string; display_name: string }>>([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, username, display_name")
      .neq("id", profileId)
      .limit(8)
      .then(({ data }) => {
        if (data) setFriends(data);
      });
  }, [profileId]);

  return (
    <SidebarCard title="Top 8">
      <div className="top8-grid">
        {friends.map((f) => (
          <Link key={f.id} to={`/profile/${f.username}`} className="top8-friend">
            <div className="friend-avatar">
              {f.display_name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span>{f.display_name}</span>
          </Link>
        ))}
      </div>
    </SidebarCard>
  );
}

function MusicPlayer() {
  const tracks = [
    { title: "Neon Paradise", artist: "Synthwave Runner" },
    { title: "Digital Sunrise", artist: "Retro_Future" },
    { title: "VibeCode Anthem", artist: "The Compilers" },
    { title: "Cyberpunk Dreams", artist: "N3ON_DUST" },
    { title: "Terminal Vibes", artist: "CLI Beats" },
  ];
  const track = tracks[Math.floor(Math.random() * tracks.length)];

  return (
    <SidebarCard title="Now Vibing">
      <div className="music-player !border-0 !p-0 !bg-transparent">
        <div className="album-art">&#9835;</div>
        <div className="track-info">
          <div className="track-title">{track.title}</div>
          <div className="track-artist">{track.artist}</div>
        </div>
      </div>
    </SidebarCard>
  );
}

function ProfileStats({ userId }: { userId: string }) {
  const [stats, setStats] = useState<ProfileStats>({ project_count: 0, total_upvotes: 0, comment_count: 0 });

  useEffect(() => {
    supabase
      .from("projects")
      .select("upvote_count, comment_count")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (data) {
          setStats({
            project_count: data.length,
            total_upvotes: data.reduce((s, p) => s + (p.upvote_count || 0), 0),
            comment_count: data.reduce((s, p) => s + (p.comment_count || 0), 0),
          });
        }
      });
  }, [userId]);

  return (
    <div className="profile-hero-body space-y-2 text-body-sm text-text-secondary">
      <div className="profile-stat-row">
        <span>Projects</span>
        <span className="text-neon-cyan font-mono">{stats.project_count}</span>
      </div>
      <div className="profile-stat-row">
        <span>Upvotes</span>
        <span className="text-neon-lime font-mono">{stats.total_upvotes}</span>
      </div>
      <div className="profile-stat-row">
        <span>Comments</span>
        <span className="text-neon-magenta font-mono">{stats.comment_count}</span>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const auth = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewCount] = useState(() => randomViews());

  const isOwnProfile =
    auth.status === "authenticated" &&
    profile?.id === auth.user.id;

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Profile fetch error:", error.message);
        } else {
          setProfile(data as ProfileData);
        }
        setLoading(false);
      });
  }, [username]);

  // Loading
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 rounded-lg bg-gradient-cta mx-auto animate-pulse" />
        <p className="text-body-sm text-text-secondary mt-4">Loading profile...</p>
      </div>
    );
  }

  // Not found
  if (!profile) {
    return (
      <div className="text-center py-20">
        <h1 className="text-h1 text-neon-magenta">404</h1>
        <p className="text-body-lg text-text-secondary mt-2">@{username} not found</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary">Back to Feed</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Marquee Banner ── */}
      <div className="marquee-container mb-6">
        <span className="text-neon-cyan font-display text-sm">
          &#9733; &#9733; &#9733; WELCOME TO {profile.display_name.toUpperCase()}'S PROFILE &#9733; &#9733; &#9733;
          &nbsp; &nbsp; &nbsp; LAST UPDATED: {new Date(profile.updated_at || profile.created_at).toLocaleDateString()}
          &nbsp; &nbsp; &nbsp; THANKS FOR STOPPING BY &#9733; &#9733; &#9733;
        </span>
      </div>

      {/* ── Blinkie Bar ── */}
      <div className="blinkie-bar mb-6">
        <span className="blinkie-tag">VIBECODER</span>
        <span className="blinkie-tag">AI AGENT</span>
        <span className="blinkie-tag">OPEN SOURCE</span>
        <span className="blinkie-tag">FULL STACK</span>
        <span className="blinkie-tag">TERMINAL NATIVE</span>
        <span className="blinkie-tag">CYBERPUNK</span>
      </div>

      {/* ── Profile Layout ── */}
      <div className="profile-layout">
        {/* ── LEFT SIDEBAR ── */}
        <div className="profile-sidebar">
          {/* Hero Card */}
          <div className="profile-hero-card">
            <div className="profile-hero-header">
              <div className="avatar">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.display_name} />
                ) : (
                  <div className="w-full h-full bg-gradient-cta flex items-center justify-center text-text-on-neon font-bold text-2xl">
                    {profile.display_name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <h2 className="font-display font-bold text-lg text-text-primary">
                {profile.display_name}
              </h2>
              <p className="font-mono text-sm text-neon-cyan mt-0.5">@{profile.username}</p>

              {/* Mood */}
              <p className="font-mono text-xs text-text-dim mt-2">
                Mood: <span className="text-neon-amber">&#9889; Vibing</span>
              </p>
            </div>

            {/* Stats */}
            <ProfileStats userId={profile.id} />

            {/* Contact Table */}
            <div className="px-3 pb-3">
              <table className="contact-table">
                <tbody>
                  <tr>
                    <td>Member Since</td>
                    <td className="text-text-secondary">{memberSince(profile.created_at)}</td>
                  </tr>
                  <tr>
                    <td>Website</td>
                    <td className="text-text-secondary">
                      {profile.website ? (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">
                          {profile.website.replace(/^https?:\/\//, "").substring(0, 25)}
                        </a>
                      ) : (
                        <span className="text-text-dim">---</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Profile Views</td>
                    <td className="text-text-secondary font-mono">{viewCount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Edit button */}
            {isOwnProfile && (
              <div className="px-3 pb-3">
                <Link to="/settings" className="btn-primary w-full text-center flex items-center justify-center gap-2 text-sm">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Link>
              </div>
            )}
          </div>

          {/* Music Player */}
          <MusicPlayer />

          {/* Top 8 Friends */}
          <TopFriends profileId={profile.id} />

          {/* View Counter */}
          <div className="text-center">
            <div className="view-counter mx-auto">
              <Eye className="w-3 h-3 inline mr-1" />
              {String(viewCount).padStart(6, "0")} views
            </div>
          </div>
        </div>

        {/* ── RIGHT MAIN ── */}
        <div className="profile-main">
          {/* Bio */}
          {profile.bio && (
            <div className="bg-bg-card border border-border-subtle rounded-lg p-4">
              <h3 className="font-display text-xs text-neon-cyan uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5 inline mr-1" /> About Me
              </h3>
              <p className="text-body-sm text-text-secondary leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* MySpace HTML Section */}
          {profile.profile_html && (
            <div className="profile-hero-card">
              <div className="bg-bg-elevated px-3 py-2 border-b border-border-subtle flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-neon-red inline-block" />
                <span className="w-3 h-3 rounded-full bg-neon-amber inline-block" />
                <span className="w-3 h-3 rounded-full bg-neon-lime inline-block" />
                <span className="font-display text-xs text-neon-magenta uppercase tracking-wider ml-2">
                  MySpace 2.0
                </span>
                <span className="font-mono text-xs text-text-dim ml-auto animate-blink">LIVE</span>
              </div>
              <iframe
                srcDoc={profile.profile_html}
                sandbox="allow-scripts"
                className="w-full min-h-[350px] border-0 block"
                title="Custom Profile"
                style={{ background: "#fff" }}
              />
            </div>
          )}

          {/* Projects */}
          <div>
            <h2 className="font-display font-bold text-lg text-text-primary mb-3 flex items-center gap-2">
              <span className="text-neon-cyan">/</span>projects
              <span className="font-mono text-xs text-text-dim font-normal">({profile.display_name}'s creations)</span>
            </h2>
            <UserProjects userId={profile.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── User Projects List ── */

function UserProjects({ userId }: { userId: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setProjects(data as Project[]);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((n) => (
          <div key={n} className="card-project animate-pulse">
            <div className="h-5 w-3/4 bg-bg-elevated rounded mb-2" />
            <div className="h-4 w-full bg-bg-elevated rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-bg-card border border-border-subtle rounded-lg p-8 text-center">
        <User className="w-10 h-10 mx-auto text-text-dim mb-3" />
        <p className="text-body-md text-text-dim">No projects yet</p>
        <p className="text-body-sm text-text-secondary mt-1">
          Vibecode something and share it with the world!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((p) => (
        <Link
          key={p.id}
          to={`/projects/${p.id}`}
          className="block bg-bg-card border border-border-subtle rounded-lg p-4
                     hover:border-neon-cyan/50 transition-colors duration-150 group"
        >
          <div className="flex gap-4">
            {/* Vote column */}
            <div className="flex flex-col items-center gap-0.5 shrink-0 min-w-[40px]">
              <ArrowUp className="w-4 h-4 text-text-dim group-hover:text-neon-lime transition-colors" />
              <span className="font-mono text-sm text-vote-up font-semibold tabular-nums">
                {p.score}
              </span>
              <ArrowDown className="w-4 h-4 text-text-dim group-hover:text-neon-red transition-colors" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-body-md font-semibold text-text-primary group-hover:text-neon-cyan transition-colors truncate">
                {p.title}
              </h3>
              <p className="text-body-sm text-text-secondary mt-1 line-clamp-2">
                {p.description}
              </p>

              {/* Tags + Meta */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {p.tech_tags?.slice(0, 4).map((tag: string) => (
                  <span key={tag} className="badge text-xs">
                    {tag}
                  </span>
                ))}
                <span className="flex items-center gap-1 font-mono text-xs text-text-dim">
                  <MessageCircle className="w-3 h-3" />
                  {p.comment_count}
                </span>
                <span className="font-mono text-xs text-text-dim flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(p.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}