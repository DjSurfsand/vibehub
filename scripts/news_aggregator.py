#!/usr/bin/env python3
"""
VibeHub News Aggregator
Fetches AI news from multiple sources and inserts into Supabase news_articles table.

Sources:
  hermes-ai  — Hermes Agent GitHub releases, Nous Research
  openclaw   — OpenClaw GitHub releases
  anthropic  — Anthropic newsroom
  openai     — OpenAI news page
  qwen       — QwenLM GitHub releases
  deepseek   — DeepSeek API changelog
  gemini     — Google AI blog
  ai-general — TechCrunch AI, Ars Technica, Hacker News (AI topics)

Requirements: pip install feedparser requests beautifulsoup4

Environment variables:
  SUPABASE_URL         — https://<project>.supabase.co
  SUPABASE_SERVICE_KEY — sb_secret_... (service role key for insert)
"""

import os
import sys
import json
import time
import hashlib
import logging
from datetime import datetime, timezone
from typing import Optional
from urllib.parse import urljoin, urlparse

import requests
import feedparser

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("vibe-news")

# ── Config ────────────────────────────────────────────────

SUPABASE_URL = os.environ.get(
    "SUPABASE_URL", "https://xfoclgvbifubczquxatc.supabase.co"
)
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
if not SUPABASE_SERVICE_KEY:
    log.error("SUPABASE_SERVICE_KEY environment variable not set")
    sys.exit(1)

HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

TABLE = "news_articles"
REQUEST_TIMEOUT = 15
USER_AGENT = "VibeHub-NewsAggregator/1.0 (ai news bot)"

# ── Helpers ───────────────────────────────────────────────

def http_get(url: str, **kwargs) -> requests.Response:
    """GET with default headers and timeout."""
    hdrs = {"User-Agent": USER_AGENT, **kwargs.pop("headers", {})}
    return requests.get(url, headers=hdrs, timeout=REQUEST_TIMEOUT, **kwargs)


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def url_hash(url: str) -> str:
    return hashlib.sha256(url.encode()).hexdigest()[:12]


def insert_article(
    title: str,
    url: str,
    source: str,
    summary: str = "",
    published_at: Optional[str] = None,
) -> bool:
    """Insert a single article into Supabase. Returns True if inserted."""
    payload = {
        "title": title.strip(),
        "url": url.strip(),
        "source": source,
        "summary": summary.strip()[:500],
        "published_at": published_at,
    }
    try:
        r = requests.post(
            f"{SUPABASE_URL}/rest/v1/{TABLE}",
            headers={**HEADERS, "Prefer": "return=minimal"},
            json=payload,
            timeout=REQUEST_TIMEOUT,
        )
        if r.status_code in (201, 200):
            return True
        elif r.status_code == 409:
            # Duplicate URL — skip quietly
            return False
        else:
            log.warning(f"[{source}] Insert failed ({r.status_code}): {r.text[:200]}")
            return False
    except Exception as exc:
        log.warning(f"[{source}] Insert exception: {exc}")
        return False


def fetch_rss(url: str, source: str) -> int:
    """Fetch an RSS feed and insert articles. Returns count inserted."""
    log.info(f"[{source}] Fetching RSS: {url}")
    try:
        feed = feedparser.parse(url)
    except Exception as exc:
        log.warning(f"[{source}] RSS parse error: {exc}")
        return 0

    count = 0
    entries = feed.entries[:15]  # Limit per run
    for entry in entries:
        link = entry.get("link", "")
        if not link:
            continue
        title = entry.get("title", "Untitled")
        summary = entry.get("summary", "") or entry.get("description", "")
        # Strip HTML from summary
        from html import unescape
        import re
        summary = re.sub(r"<[^>]+>", "", unescape(summary)).strip()
        published = None
        if hasattr(entry, "published_parsed") and entry.published_parsed:
            try:
                published = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc).isoformat()
            except Exception:
                pass
        if insert_article(title, link, source, summary, published):
            count += 1
    log.info(f"[{source}] RSS inserted {count} articles")
    return count


def fetch_page_links(
    page_url: str,
    source: str,
    link_selector: str = "article a",
    title_selector: str = "h1, h2, h3",
    base_url: Optional[str] = None,
    max_articles: int = 10,
) -> int:
    """
    Scrape a news listing page for article links.
    Uses BeautifulSoup — must be installed.
    """
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        log.warning(f"[{source}] BeautifulSoup not installed, skipping scrape of {page_url}")
        return 0

    log.info(f"[{source}] Scraping: {page_url}")
    try:
        r = http_get(page_url)
        r.raise_for_status()
    except Exception as exc:
        log.warning(f"[{source}] Page fetch error: {exc}")
        return 0

    soup = BeautifulSoup(r.text, "html.parser")
    base = base_url or f"{urlparse(page_url).scheme}://{urlparse(page_url).netloc}"

    count = 0
    # Find article-like elements
    candidates = soup.select("article, .post, .news-item, .article-item, .entry")
    if not candidates:
        # Fallback: grab all links that look like article links
        candidates = soup.select(link_selector)

    seen_urls = set()
    for el in candidates[:max_articles * 3]:
        links = el.find_all("a") if el.name != "a" else [el]
        for a in links:
            href = a.get("href", "")
            if not href or href.startswith("#") or href.startswith("javascript:"):
                continue
            full_url = urljoin(base, href)
            if full_url in seen_urls:
                continue
            seen_urls.add(full_url)

            # Get title
            title_el = a.select_one(title_selector) if el.name != "a" else a
            title = (title_el or a).get_text(strip=True)
            if not title or len(title) < 10:
                continue

            # Try to get summary
            summary = ""
            p = el.find("p")
            if p:
                summary = p.get_text(strip=True)

            if insert_article(title, full_url, source, summary):
                count += 1
                if count >= max_articles:
                    log.info(f"[{source}] Scraped {count} articles")
                    return count

    log.info(f"[{source}] Scraped {count} articles")
    return count


# ── Source-specific fetchers ──────────────────────────────

def fetch_hermes_ai() -> int:
    """Hermes Agent — GitHub releases + Nous Research blog."""
    count = 0
    # Hermes Agent GitHub releases
    try:
        r = http_get(
            "https://api.github.com/repos/NousResearch/hermes-agent/releases?per_page=5"
        )
        if r.status_code == 200:
            for rel in r.json():
                tag = rel.get("tag_name", "")
                url = rel.get("html_url", "")
                title = f"Hermes Agent {tag}" if tag else rel.get("name", "")
                if not title or not url:
                    continue
                body = (rel.get("body") or "")[:500]
                published = rel.get("published_at")
                if insert_article(title, url, "hermes-ai", body, published):
                    count += 1
    except Exception as exc:
        log.warning(f"[hermes-ai] GitHub API error: {exc}")

    # Try Nous Research blog RSS
    try:
        count += fetch_rss("https://nousresearch.com/feed/", "hermes-ai")
    except Exception:
        pass
    return count


def fetch_openclaw() -> int:
    """OpenClaw GitHub releases."""
    count = 0
    try:
        r = http_get(
            "https://api.github.com/repos/openclaw/openclaw/releases?per_page=5"
        )
        if r.status_code == 200:
            for rel in r.json():
                tag = rel.get("tag_name", "")
                url = rel.get("html_url", "")
                title = f"OpenClaw {tag}" if tag else rel.get("name", "")
                if not title or not url:
                    continue
                body = (rel.get("body") or "")[:500]
                published = rel.get("published_at")
                if insert_article(title, url, "openclaw", body, published):
                    count += 1
    except Exception as exc:
        log.warning(f"[openclaw] GitHub API error: {exc}")
    return count


def fetch_anthropic() -> int:
    """Anthropic newsroom — scrape."""
    return fetch_page_links(
        "https://www.anthropic.com/news",
        "anthropic",
        max_articles=10,
    )


def fetch_openai() -> int:
    """OpenAI news — scrape."""
    count = fetch_page_links(
        "https://openai.com/news/",
        "openai",
        max_articles=10,
    )
    # Also try RSS
    try:
        count += fetch_rss("https://openai.com/news/rss.xml", "openai")
    except Exception:
        pass
    return count


def fetch_qwen() -> int:
    """Qwen — GitHub releases, qwen.ai blog, Carnice models."""
    count = 0

    # 1. QwenLM/qwen-code GitHub releases (most active repo)
    try:
        r = http_get(
            "https://api.github.com/repos/QwenLM/qwen-code/releases?per_page=5"
        )
        if r.status_code == 200:
            for rel in r.json():
                tag = rel.get("tag_name", "")
                url = rel.get("html_url", "")
                title = f"Qwen Code {tag}" if tag else rel.get("name", "")
                if not title or not url:
                    continue
                body = (rel.get("body") or "")[:500]
                published = rel.get("published_at")
                if insert_article(title, url, "qwen", body, published):
                    count += 1
    except Exception as exc:
        log.warning(f"[qwen] qwen-code GitHub error: {exc}")

    # 2. QwenLM/Qwen GitHub releases
    try:
        r = http_get(
            "https://api.github.com/repos/QwenLM/Qwen/releases?per_page=5"
        )
        if r.status_code == 200:
            for rel in r.json():
                tag = rel.get("tag_name", "")
                url = rel.get("html_url", "")
                title = f"Qwen {tag}" if tag else rel.get("name", "")
                if not title or not url:
                    continue
                body = (rel.get("body") or "")[:500]
                published = rel.get("published_at")
                if insert_article(title, url, "qwen", body, published):
                    count += 1
    except Exception as exc:
        log.warning(f"[qwen] Qwen repo GitHub error: {exc}")

    # 3. Qwen.ai research page — scrape recent releases
    try:
        count += fetch_page_links(
            "https://qwen.ai/research",
            "qwen",
            max_articles=10,
        )
    except Exception as exc:
        log.warning(f"[qwen] research page error: {exc}")

    # 4. Qwen.ai blog articles (individual known URLs for recent posts)
    blog_posts = [
        "https://qwen.ai/blog?id=qwen3.6-27b",
        "https://qwen.ai/blog?id=qwen3.5",
        "https://qwen.ai/blog?id=qwen3.6-35b-a3b",
        "https://qwen.ai/blog?id=qwen3.6-max-preview",
        "https://qwen.ai/blog?id=qwen3.5-omni",
    ]
    for post_url in blog_posts:
        try:
            r = http_get(post_url, headers={"Accept": "text/html"})
            if r.status_code != 200:
                continue
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(r.text, "html.parser")
            # Try to extract title from h1
            h1 = soup.find("h1")
            title = h1.get_text(strip=True) if h1 else ""
            if not title or len(title) < 5:
                # Try meta title
                meta = soup.find("meta", property="og:title")
                title = meta["content"] if meta else ""
            if not title:
                continue
            # Get first meaningful paragraph as summary
            summary = ""
            for p in soup.find_all("p"):
                txt = p.get_text(strip=True)
                if len(txt) > 40:
                    summary = txt[:500]
                    break
            if insert_article(title, post_url, "qwen", summary):
                count += 1
        except Exception as exc:
            log.warning(f"[qwen] blog post {post_url}: {exc}")

    # 5. Carnice models on HuggingFace (kai-os)
    try:
        r = http_get(
            "https://huggingface.co/api/models?author=kai-os&sort=lastModified&direction=-1&limit=5"
        )
        if r.status_code == 200:
            for model in r.json():
                model_id = model.get("modelId", "")
                if not model_id or "carnice" not in model_id.lower():
                    continue
                url = f"https://huggingface.co/{model_id}"
                title = f"Carnice: {model_id}"
                # Try to get a summary from the model card
                summary = ""
                try:
                    card_r = http_get(f"https://huggingface.co/api/models/{model_id}?blobs=true")
                    if card_r.status_code == 200:
                        card = card_r.json()
                        # Use pipeline_tag + tags as summary
                        tags = card.get("tags", [])[:5]
                        pipe = card.get("pipeline_tag", "")
                        summary = f"Model type: {pipe}. Tags: {', '.join(tags)}" if tags else ""
                except Exception:
                    pass
                if insert_article(title, url, "qwen", summary):
                    count += 1
    except Exception as exc:
        log.warning(f"[qwen] HuggingFace Carnice error: {exc}")

    # 6. Additional Carnice models from samuelcardillo
    try:
        r = http_get(
            "https://huggingface.co/api/models?author=samuelcardillo&search=carnice&limit=5"
        )
        if r.status_code == 200:
            for model in r.json():
                model_id = model.get("modelId", "")
                if not model_id:
                    continue
                url = f"https://huggingface.co/{model_id}"
                title = f"Carnice MoE: {model_id}"
                if insert_article(title, url, "qwen"):
                    count += 1
    except Exception as exc:
        log.warning(f"[qwen] samuelcardillo error: {exc}")

    return count


def fetch_deepseek() -> int:
    """DeepSeek — API changelog + blog."""
    count = 0
    # DeepSeek API docs changelog page
    count += fetch_page_links(
        "https://api-docs.deepseek.com/updates",
        "deepseek",
        max_articles=10,
    )
    # DeepSeek news page
    try:
        count += fetch_page_links(
            "https://api-docs.deepseek.com/news",
            "deepseek",
            max_articles=10,
        )
    except Exception:
        pass
    return count


def fetch_gemini() -> int:
    """Gemini / Google AI blog."""
    return fetch_page_links(
        "https://blog.google/technology/ai/",
        "gemini",
        max_articles=10,
    )


def fetch_ai_general() -> int:
    """General AI news from major tech outlets."""
    count = 0
    # TechCrunch AI
    count += fetch_rss("https://techcrunch.com/category/artificial-intelligence/feed/", "ai-general")
    # Ars Technica AI
    try:
        count += fetch_page_links("https://arstechnica.com/ai/", "ai-general", max_articles=5)
    except Exception:
        pass
    # Hacker News — AI-related (hnrss)
    count += fetch_rss("https://hnrss.org/frontpage?q=AI+OR+LLM+OR+GPT+OR+Claude+OR+Gemini", "ai-general")
    return count


# ── Main ──────────────────────────────────────────────────

FETCHERS = {
    "hermes-ai": fetch_hermes_ai,
    "openclaw": fetch_openclaw,
    "anthropic": fetch_anthropic,
    "openai": fetch_openai,
    "qwen": fetch_qwen,
    "deepseek": fetch_deepseek,
    "gemini": fetch_gemini,
    "ai-general": fetch_ai_general,
}


def main():
    log.info("=" * 50)
    log.info("VibeHub News Aggregator — starting run")
    log.info(f"Target: {SUPABASE_URL}")

    total = 0
    results = {}

    for source_id, fetcher in FETCHERS.items():
        try:
            count = fetcher()
            results[source_id] = count
            total += count
        except Exception as exc:
            log.error(f"[{source_id}] Unhandled exception: {exc}")
            results[source_id] = 0

        # Be polite to APIs
        time.sleep(1)

    log.info("─" * 40)
    for src, cnt in results.items():
        log.info(f"  {src:15s} → {cnt} articles")
    log.info(f"  {'TOTAL':15s} → {total} articles")
    log.info("=" * 50)

    return total


if __name__ == "__main__":
    main()