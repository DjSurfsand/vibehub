import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

/**
 * Navigation bar — fixed top, glass-blur, retro cyberpunk.
 * Shows different actions depending on auth state.
 */
export default function Navbar() {
  const auth = useAuth();
  const isAuth = auth.status === "authenticated";
  const [username, setUsername] = useState<string | null>(null);

  // Fetch the user's username for the profile link
  useEffect(() => {
    if (!isAuth) return;
    supabase
      .from("profiles")
      .select("username")
      .eq("id", auth.user.id)
      .single()
      .then(({ data }) => {
        if (data) setUsername(data.username);
      });
  }, [isAuth, auth.status === "authenticated" ? auth.user.id : null]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 h-16
                    bg-bg-deep/85 backdrop-blur-[12px]
                    border-b border-border-subtle">
      <div className="max-w-content mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-md bg-gradient-cta flex items-center justify-center
                          group-hover:shadow-glow-cyan transition-shadow duration-200">
            <span className="text-text-on-neon font-bold text-sm">V</span>
          </div>
          <span className="font-display text-h2 text-text-primary hidden sm:inline
                           group-hover:text-glow-cyan transition-all duration-200">
            VibeHub
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/">Feed</NavLink>
          <NavLink to="/news">News</NavLink>
          {isAuth && <NavLink to="/create">Create</NavLink>}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {isAuth ? (
            <>
              {/* Profile button */}
              {username && (
                <Link
                  to={`/profile/${username}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md
                             text-body-sm font-medium transition-all duration-150
                             border border-neon-cyan/30 text-neon-cyan
                             hover:bg-neon-cyan/10 hover:border-neon-cyan
                             hover:shadow-glow-cyan"
                  title="Your Profile"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              )}
              <button
                onClick={auth.signOut}
                className="btn-ghost text-body-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm !px-4 !py-2">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ── Nav link sub-component ── */
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-4 py-2 rounded-md text-body-sm font-medium transition-all duration-150
                 text-text-secondary hover:text-text-primary hover:bg-white/5"
    >
      {children}
    </Link>
  );
}