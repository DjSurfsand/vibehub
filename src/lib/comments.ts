import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

/* ─── Types ─── */

export interface Comment {
  id: string;
  user_id: string;
  project_id: string;
  parent_id: string | null;
  body: string;
  depth: number;
  created_at: string;
  updated_at: string;
  // Joined from profiles
  username?: string;
  avatar_url?: string;
  // Nested replies (client-side)
  replies?: Comment[];
}

/* ─── Hooks ─── */

export function useComments(projectId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles!inner (
          username,
          avatar_url
        )
      `,
      )
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch comments:", error.message);
      setLoading(false);
      return;
    }

    // Flatten + build thread tree
    const all: Comment[] = (data ?? []).map((c: any) => ({
      id: c.id,
      user_id: c.user_id,
      project_id: c.project_id,
      parent_id: c.parent_id,
      body: c.body,
      depth: c.depth ?? 0,
      created_at: c.created_at,
      updated_at: c.updated_at,
      username: c.profiles?.username,
      avatar_url: c.profiles?.avatar_url,
      replies: [],
    }));

    // Build tree (top-level are root, nest under parent_id)
    const roots: Comment[] = [];
    const map = new Map<string, Comment>();
    all.forEach((c) => map.set(c.id, c));

    all.forEach((c) => {
      if (c.parent_id && map.has(c.parent_id)) {
        const parent = map.get(c.parent_id)!;
        parent.replies = parent.replies ?? [];
        parent.replies.push(c);
      } else {
        roots.push(c);
      }
    });

    setComments(roots);
    setLoading(false);
  };

  useEffect(() => {
    if (projectId) fetchComments();
  }, [projectId]);

  return { comments, loading, refetch: fetchComments };
}

/* ─── Actions ─── */

export async function addComment(
  input: {
    project_id: string;
    body: string;
    parent_id?: string | null;
  },
  user: User,
): Promise<boolean> {
  const { error } = await supabase.from("comments").insert({
    user_id: user.id,
    project_id: input.project_id,
    body: input.body,
    parent_id: input.parent_id ?? null,
    depth: input.parent_id ? 1 : 0,
  });
  return !error;
}