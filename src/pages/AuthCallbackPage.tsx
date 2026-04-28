import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

/**
 * Auth Callback — handles OAuth redirects from Google/Facebook.
 * Supabase stores the session after the OAuth flow completes.
 * We redirect to the feed on success.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing sign-in…");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setMessage("Signed in! Redirecting…");
        setTimeout(() => navigate("/", { replace: true }), 500);
      } else {
        setMessage("Sign-in failed. Please try again.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-cta flex items-center justify-center mx-auto shadow-glow-cyan animate-pulse-neon">
          <span className="text-text-on-neon font-bold text-2xl">↻</span>
        </div>
        <p className="text-body-md text-text-primary">{message}</p>
        <p className="text-body-sm text-text-dim">You'll be redirected shortly</p>
      </div>
    </div>
  );
}