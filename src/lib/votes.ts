import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

export type VoteValue = 1 | -1 | null;

/**
 * Hook: get current user's vote on a project and toggle up/down.
 */
export function useVote(projectId: string, user: User | null) {
  const [userVote, setUserVote] = useState<VoteValue>(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing vote on mount
  useEffect(() => {
    if (!user || !projectId) return;

    supabase
      .from("votes")
      .select("value")
      .eq("user_id", user.id)
      .eq("project_id", projectId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setUserVote(data.value as VoteValue);
      });
  }, [projectId, user]);

  const vote = useCallback(
    async (newValue: 1 | -1) => {
      if (!user) return;

      setLoading(true);

      try {
        if (userVote === newValue) {
          // Toggle off — delete vote
          await supabase
            .from("votes")
            .delete()
            .eq("user_id", user.id)
            .eq("project_id", projectId);
          setUserVote(null);
        } else {
          // Upsert vote
          await supabase.from("votes").upsert(
            {
              user_id: user.id,
              project_id: projectId,
              value: newValue,
            },
            { onConflict: "user_id, project_id" },
          );
          setUserVote(newValue);
        }
      } catch (err) {
        console.error("Vote failed:", err);
      } finally {
        setLoading(false);
      }
    },
    [projectId, user, userVote],
  );

  return { userVote, vote, loading };
}

/**
 * Fetch vote counts for a project (live).
 */
export function useVoteCount(projectId: string) {
  const [counts, setCounts] = useState({ up: 0, down: 0, score: 0 });

  useEffect(() => {
    if (!projectId) return;

    const fetchCounts = () => {
      supabase
        .from("projects")
        .select("score, upvote_count, downvote_count")
        .eq("id", projectId)
        .single()
        .then(({ data }) => {
          if (data) {
            setCounts({
              up: data.upvote_count ?? 0,
              down: data.downvote_count ?? 0,
              score: data.score ?? 0,
            });
          }
        });
    };

    fetchCounts();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`votes-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
          filter: `project_id=eq.${projectId}`,
        },
        fetchCounts,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return counts;
}