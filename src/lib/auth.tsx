import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";

/* ─── Types ─── */

type AuthState =
  | { status: "loading" }
  | { status: "authenticated"; user: User; session: Session }
  | { status: "unauthenticated" };

type AuthContextValue = AuthState & {
  /** Sign in with an OAuth provider (Google, Facebook) */
  signInWithOAuth: (provider: "google" | "facebook") => Promise<void>;
  /** Sign in with email + password */
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  /** Sign up with email + password */
  signUpWithEmail: (
    email: string,
    password: string
  ) => Promise<string | null>;
  /** Sign out */
  signOut: () => Promise<void>;
};

/* ─── Context ─── */

const AuthContext = createContext<AuthContextValue | null>(null);

/* ─── Provider ─── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  /* ── Bootstrap: check existing session + listen for changes ── */
  useEffect(() => {
    // 1. Check if a session already exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setState({
          status: "authenticated",
          user: session.user,
          session,
        });
      } else {
        setState({ status: "unauthenticated" });
      }
    });

    // 2. Listen for auth state changes (sign-in, sign-out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setState({ status: "authenticated", user: session.user, session });
      } else {
        setState({ status: "unauthenticated" });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── Auth actions ── */

  const signInWithOAuth = async (provider: "google" | "facebook") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("OAuth sign-in error:", error.message);
  };

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return error?.message ?? null;
  };

  const signUpWithEmail = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return error?.message ?? null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ status: "unauthenticated" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInWithOAuth,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ─── Hook ─── */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}