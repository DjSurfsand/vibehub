-- VibeHub — Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor
-- Or apply via `supabase db push` if using the CLI

-- ── Profiles (extends auth.users) ──
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  website TEXT DEFAULT '',
  profile_html TEXT DEFAULT '',      -- MySpace custom HTML
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    LOWER(SPLIT_PART(NEW.email, '@', 1)),  -- default username from email
    SPLIT_PART(NEW.email, '@', 1),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Policies
CREATE POLICY "Profiles are public" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ── Projects ──
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  url TEXT,
  media_url TEXT,
  tech_tags TEXT[] DEFAULT '{}',
  score INTEGER DEFAULT 0,          -- denormalized upvotes - downvotes
  upvote_count INTEGER DEFAULT 0,
  downvote_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Index for feed queries
CREATE INDEX idx_projects_score ON public.projects(score DESC, created_at DESC);
CREATE INDEX idx_projects_user ON public.projects(user_id);
CREATE INDEX idx_projects_created ON public.projects(created_at DESC);

-- Policies
CREATE POLICY "Projects are public" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- ── Votes (one vote per user per project) ──
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  value INTEGER NOT NULL CHECK (value IN (1, -1)),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, project_id)
);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_votes_project ON public.votes(project_id);

CREATE POLICY "Votes are public" ON public.votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON public.votes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update own vote" ON public.votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vote" ON public.votes
  FOR DELETE USING (auth.uid() = user_id);

-- Function: recalculate project score on vote change
CREATE OR REPLACE FUNCTION public.recalculate_project_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.projects
  SET
    score = (SELECT COALESCE(SUM(value), 0) FROM public.votes WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)),
    upvote_count = (SELECT COUNT(*) FROM public.votes WHERE project_id = COALESCE(NEW.project_id, OLD.project_id) AND value = 1),
    downvote_count = (SELECT COUNT(*) FROM public.votes WHERE project_id = COALESCE(NEW.project_id, OLD.project_id) AND value = -1)
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_vote_change ON public.votes;
CREATE TRIGGER on_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.recalculate_project_score();

-- ── Comments ──
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  depth INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_comments_project ON public.comments(project_id, created_at);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);

CREATE POLICY "Comments are public" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment" ON public.comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Update comment count on projects
CREATE OR REPLACE FUNCTION public.update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.projects SET comment_count = comment_count + 1 WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.projects SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_change ON public.comments;
CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_comment_count();

-- ── User Posts (timeline posts, separate from projects) ──
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_posts_user ON public.posts(user_id, created_at DESC);

CREATE POLICY "Posts are public" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post" ON public.posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- ── News Articles (populated by aggregator cron) ──
CREATE TABLE public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('hermes-ai', 'openclaw', 'ai-general')),
  summary TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'ai-general',
  featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (url)
);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_news_published ON public.news_articles(published_at DESC);
CREATE INDEX idx_news_source ON public.news_articles(source);

CREATE POLICY "News articles are public" ON public.news_articles
  FOR SELECT USING (true);

-- Allow aggregator (service role) to insert
CREATE POLICY "Service role can manage news" ON public.news_articles
  FOR ALL USING (auth.role() = 'service_role');