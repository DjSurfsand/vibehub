import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";

/**
 * Wraps routes that require authentication.
 * - Loading → shows a spinner
 * - Unauthenticated → redirects to /login
 * - Authenticated → renders the child route
 */
export default function ProtectedRoute() {
  const auth = useAuth();

  /* ── Loading state ── */
  if (auth.status === "loading") {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-cta flex items-center justify-center mx-auto animate-pulse">
            <span className="text-text-on-neon font-bold">V</span>
          </div>
          <p className="text-body-sm text-text-secondary">Loading…</p>
        </div>
      </div>
    );
  }

  /* ── Unauthenticated → redirect ── */
  if (auth.status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  /* ── Authenticated → render children ── */
  return <Outlet />;
}