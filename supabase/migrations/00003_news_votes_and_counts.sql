-- VibeHub — Migration 00003: News voting system
-- Run in Supabase Dashboard → SQL Editor
-- Combines migration 00002 (source CHECK constraint) + news voting tables

-- =====================================================
-- Part 1: Apply 00002 (add new news sources to CHECK)
-- =====================================================

ALTER TABLE public.news_articles
  DROP CONSTRAINT IF EXISTS news_articles_source_check;

ALTER TABLE public.news_articles
  ADD CONSTRAINT news_articles_source_check
  CHECK (source IN (
    'hermes-ai',
    'openclaw',
    'anthropic',
    'openai',
    'qwen',
    'deepseek',
    'gemini',
    'ai-general'
  ));

-- =====================================================
-- Part 2: Add upvotes/downvotes columns to news_articles
-- =====================================================

ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0;

ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- =====================================================
-- Part 3: Create news_votes table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.news_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  vote INTEGER NOT NULL CHECK (vote IN (1, -1)),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, article_id)
);

ALTER TABLE public.news_votes ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_news_votes_article ON public.news_votes(article_id);
CREATE INDEX IF NOT EXISTS idx_news_votes_user ON public.news_votes(user_id);

-- Policies
CREATE POLICY "News votes are public" ON public.news_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote on news" ON public.news_votes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update own news vote" ON public.news_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own news vote" ON public.news_votes
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- Part 4: Trigger to recalculate news article vote counts
-- =====================================================

CREATE OR REPLACE FUNCTION public.recalculate_news_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote = 1 THEN
      UPDATE public.news_articles SET upvotes = upvotes + 1 WHERE id = NEW.article_id;
    ELSIF NEW.vote = -1 THEN
      UPDATE public.news_articles SET downvotes = downvotes + 1 WHERE id = NEW.article_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Revert old vote
    IF OLD.vote = 1 THEN
      UPDATE public.news_articles SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.article_id;
    ELSIF OLD.vote = -1 THEN
      UPDATE public.news_articles SET downvotes = GREATEST(downvotes - 1, 0) WHERE id = OLD.article_id;
    END IF;
    -- Apply new vote
    IF NEW.vote = 1 THEN
      UPDATE public.news_articles SET upvotes = upvotes + 1 WHERE id = NEW.article_id;
    ELSIF NEW.vote = -1 THEN
      UPDATE public.news_articles SET downvotes = downvotes + 1 WHERE id = NEW.article_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote = 1 THEN
      UPDATE public.news_articles SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.article_id;
    ELSIF OLD.vote = -1 THEN
      UPDATE public.news_articles SET downvotes = GREATEST(downvotes - 1, 0) WHERE id = OLD.article_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_news_vote_change ON public.news_votes;
CREATE TRIGGER on_news_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON public.news_votes
  FOR EACH ROW EXECUTE FUNCTION public.recalculate_news_votes();
