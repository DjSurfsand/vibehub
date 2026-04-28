-- VibeHub — Migration 00002: Add new news sources
-- Run in Supabase SQL Editor or apply via CLI

-- Drop the old CHECK constraint and add the new one
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