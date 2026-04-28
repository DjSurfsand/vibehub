import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

/* ─── Types ─── */

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  url: string | null;
  media_url: string | null;
  tech_tags: string[];
  score: number;
  upvote_count: number;
  downvote_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  // Joined from profiles
  username?: string;
  display_name?: string;
  avatar_url?: string;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  url?: string;
  media_url?: string;
  tech_tags?: string[];
}

/* ─── Create Project ─── */

export async function createProject(
  input: CreateProjectInput,
  user: User,
): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description,
      url: input.url || null,
      media_url: input.media_url || null,
      tech_tags: input.tech_tags || [],
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create project:", error.message);
    return null;
  }
  return data;
}

/* ─── Fetch Projects Feed ─── */

interface UseProjectsOptions {
  sort?: "hot" | "new" | "top";
  tag?: string | null;
  limit?: number;
}

export function useProjects({ sort = "hot", tag = null, limit = 20 }: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("projects")
        .select(`
          *,
          profiles!inner (
            username,
            display_name,
            avatar_url
          )
        `);

      // Filter by tag
      if (tag) {
        query = query.contains("tech_tags", [tag]);
      }

      // Sort order
      if (sort === "new") {
        query = query.order("created_at", { ascending: false });
      } else if (sort === "top") {
        query = query.order("score", { ascending: false });
      } else {
        // "hot" — score weighted by recency
        query = query.order("score", { ascending: false });
      }

      query = query.limit(limit);

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Flatten profile join
      const mapped: Project[] = (data ?? []).map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        description: item.description,
        url: item.url,
        media_url: item.media_url,
        tech_tags: item.tech_tags ?? [],
        score: item.score ?? 0,
        upvote_count: item.upvote_count ?? 0,
        downvote_count: item.downvote_count ?? 0,
        comment_count: item.comment_count ?? 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
        username: item.profiles?.username,
        display_name: item.profiles?.display_name,
        avatar_url: item.profiles?.avatar_url,
      }));

      setProjects(mapped);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sort, tag, limit]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}

/* ─── Fetch Single Project ─── */

export async function fetchProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      profiles!inner (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const item = data as any;
  return {
    id: item.id,
    user_id: item.user_id,
    title: item.title,
    description: item.description,
    url: item.url,
    media_url: item.media_url,
    tech_tags: item.tech_tags ?? [],
    score: item.score ?? 0,
    upvote_count: item.upvote_count ?? 0,
    downvote_count: item.downvote_count ?? 0,
    comment_count: item.comment_count ?? 0,
    created_at: item.created_at,
    updated_at: item.updated_at,
    username: item.profiles?.username,
    display_name: item.profiles?.display_name,
    avatar_url: item.profiles?.avatar_url,
  };
}

/* ─── Delete Project ─── */

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  return !error;
}