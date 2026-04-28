-- VibeHub — Migration 00002: Expand news sources + add voting
-- Copy-paste this entire script into Supabase Dashboard → SQL Editor

-- ── 1. Expand source check constraint ──
ALTER TABLE public.news_articles 
  DROP CONSTRAINT IF EXISTS news_articles_source_check;

ALTER TABLE public.news_articles 
  ADD CONSTRAINT news_articles_source_check 
  CHECK (source IN (
    'hermes-ai', 'openclaw', 'anthropic', 'openai', 
    'qwen', 'deepseek', 'gemini', 'ai-general'
  ));

-- ── 2. Add vote count columns ──
ALTER TABLE public.news_articles 
  ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0;

ALTER TABLE public.news_articles 
  ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- ── 3. News votes tracking table (prevents double voting) ──
CREATE TABLE IF NOT EXISTS public.news_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.news_articles(id) ON DELETE CASCADE,
  vote INTEGER NOT NULL CHECK (vote IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, article_id)
);

ALTER TABLE public.news_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News votes are viewable by everyone" ON public.news_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote on news" ON public.news_votes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can change their news vote" ON public.news_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their news vote" ON public.news_votes
  FOR DELETE USING (auth.uid() = user_id);

-- ── 4. Trigger to sync vote counts to news_articles ──
CREATE OR REPLACE FUNCTION public.update_news_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote = 1 THEN
      UPDATE public.news_articles SET upvotes = upvotes + 1 WHERE id = NEW.article_id;
    ELSE
      UPDATE public.news_articles SET downvotes = downvotes + 1 WHERE id = NEW.article_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote = 1 AND NEW.vote = -1 THEN
      UPDATE public.news_articles SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.article_id;
    ELSIF OLD.vote = -1 AND NEW.vote = 1 THEN
      UPDATE public.news_articles SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.article_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote = 1 THEN
      UPDATE public.news_articles SET upvotes = upvotes - 1 WHERE id = OLD.article_id;
    ELSE
      UPDATE public.news_articles SET downvotes = downvotes - 1 WHERE id = OLD.article_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_news_vote_counts ON public.news_votes;
CREATE TRIGGER trg_update_news_vote_counts
  AFTER INSERT OR UPDATE OR DELETE ON public.news_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_news_vote_counts();