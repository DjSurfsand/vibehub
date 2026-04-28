import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function RegisterPage() {
  const { signUpWithEmail, status } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    const err = await signUpWithEmail(email, password);
    setSubmitting(false);

    if (err) {
      setError(err);
    } else {
      setSuccess(true);
    }
  };

  /* ── Success state: check your email ── */
  if (success) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-lime flex items-center justify-center mx-auto shadow-glow-lime">
            <span className="text-text-on-neon font-bold text-2xl">✓</span>
          </div>
          <h2 className="text-h2 text-neon-lime">Check Your Email</h2>
          <p className="text-body-md text-text-secondary">
            We sent a confirmation link to{" "}
            <span className="text-text-primary font-medium">{email}</span>
          </p>
          <p className="text-body-sm text-text-dim">
            Click the link to activate your account, then sign in.
          </p>
          <Link to="/login" className="btn-secondary inline-block mt-4">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* ── Logo ── */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4 shadow-glow-magenta">
            <span className="text-text-on-neon font-bold text-2xl">+</span>
          </div>
          <h1 className="text-h1 text-text-primary">
            Join <span className="text-neon-cyan">Vibe</span>
            <span className="text-neon-magenta">Hub</span>
          </h1>
          <p className="text-body-sm text-text-secondary mt-2">
            Create an account to start sharing
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="text-label-caps text-text-dim block mb-1.5">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="input-neon"
            />
          </div>
          <div>
            <label className="text-label-caps text-text-dim block mb-1.5">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="input-neon"
            />
          </div>
          <div>
            <label className="text-label-caps text-text-dim block mb-1.5">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Type it again"
              required
              minLength={6}
              className="input-neon"
            />
          </div>

          {error && (
            <p className="text-body-sm text-neon-red bg-neon-red/10 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || status === "loading"}
            className="btn-primary w-full justify-center"
          >
            {submitting ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        {/* ── Footer ── */}
        <p className="text-center text-body-sm text-text-dim mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-neon-cyan hover:text-glow-cyan transition-all"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}