import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";

type VoteState = 1 | -1 | null;

/**
 * Hook for voting on news articles.
 * Returns [voteState, upvotes, downvotes, voteUp, voteDown].
 * Uses the Supabase news_votes table with a trigger to update counts.
 */
export function useNewsVote(articleId: string, initialUp: number = 0, initialDown: number = 0) {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : null;
  const [myVote, setMyVote] = useState<VoteState>(null);
  const [upvotes, setUpvotes] = useState(initialUp);
  const [downvotes, setDownvotes] = useState(initialDown);
  const [loading, setLoading] = useState(true);

  // Fetch current vote state on mount
  useEffect(() => {
    if (!userId) {
      setMyVote(null);
      setLoading(false);
      return;
    }

    const fetchVote = async () => {
      const { data } = await supabase
        .from("news_votes")
        .select("vote")
        .eq("user_id", userId)
        .eq("article_id", articleId)
        .maybeSingle();

      setMyVote((data?.vote as VoteState) ?? null);
      setLoading(false);
    };

    fetchVote();
  }, [userId, articleId]);

  // Subscribe to count changes (realtime)
  useEffect(() => {
    const channel = supabase
      .channel(`news_votes_${articleId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "news_articles",
          filter: `id=eq.${articleId}`,
        },
        (payload) => {
          const row = payload.new as { upvotes: number; downvotes: number } | null;
          if (row) {
            setUpvotes(row.upvotes);
            setDownvotes(row.downvotes);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId]);

  const upsertVote = useCallback(
    async (newVote: VoteState) => {
      if (!userId) return;
      setLoading(true);

      if (newVote === null) {
        // Remove vote
        await supabase
          .from("news_votes")
          .delete()
          .eq("user_id", userId)
          .eq("article_id", articleId);
        setMyVote(null);
      } else {
        // Upsert vote
        await supabase
          .from("news_votes")
          .upsert(
            {
              user_id: userId,
              article_id: articleId,
              vote: newVote,
            },
            { onConflict: "user_id, article_id" }
          );
        setMyVote(newVote);
      }

      setLoading(false);
    },
    [userId, articleId]
  );

  const voteUp = useCallback(() => {
    upsertVote(myVote === 1 ? null : 1);
  }, [upsertVote, myVote]);

  const voteDown = useCallback(() => {
    upsertVote(myVote === -1 ? null : -1);
  }, [upsertVote, myVote]);

  return { myVote, upvotes, downvotes, loading, voteUp, voteDown };
}