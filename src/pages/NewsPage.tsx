import { useEffect, useState } from "react";
import { Newspaper, ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNewsVote } from "../lib/newsVotes";

/* ─── Source config ─── */

type SourceId =
  | "hermes-ai"
  | "openclaw"
  | "anthropic"
  | "openai"
  | "qwen"
  | "deepseek"
  | "gemini"
  | "ai-general";

interface SourceConfig {
  id: SourceId;
  label: string;
  color: "cyan" | "magenta" | "lime" | "amber" | "red" | "violet" | "blue" | "green";
}

const SOURCES: SourceConfig[] = [
  { id: "hermes-ai",   label: "HERMES",    color: "cyan" },
  { id: "openclaw",    label: "OPENCLAW",  color: "magenta" },
  { id: "anthropic",   label: "ANTHROPIC", color: "lime" },
  { id: "openai",      label: "OPENAI",    color: "green" },
  { id: "qwen",        label: "QWEN",      color: "violet" },
  { id: "deepseek",    label: "DEEPSEEK",  color: "blue" },
  { id: "gemini",      label: "GEMINI",    color: "amber" },
  { id: "ai-general",  label: "AI",        color: "red" },
];

const colorMap = Object.fromEntries(SOURCES.map((s) => [s.id, s.color])) as Record<SourceId, string>;
const labelMap = Object.fromEntries(SOURCES.map((s) => [s.id, s.label])) as Record<SourceId, string>;

/* ─── Article type ─── */

interface Article {
  id: string;
  title: string;
  url: string;
  source: SourceId;
  summary: string;
  featured: boolean;
  upvotes: number;
  downvotes: number;
  published_at: string | null;
  created_at: string;
}

/* ─── Helpers ─── */

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function borderClass(color: string): string {
  return `border-l-neon-${color}`;
}

function badgeClass(color: string): string {
  return `bg-neon-${color}/15 text-neon-${color}`;
}

/* ─── Article Card Component (needs its own component for hook usage) ─── */

function NewsArticleCard({ article }: { article: Article }) {
  const { myVote, upvotes, downvotes, voteUp, voteDown } = useNewsVote(
    article.id,
    article.upvotes,
    article.downvotes
  );

  const color = colorMap[article.source] ?? "cyan";
  const net = upvotes - downvotes;

  return (
    <div className={`card-news ${borderClass(color)}`}>
      {/* Top bar: source badge, time, featured */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-mono-sm ${badgeClass(color)}`}>
          {labelMap[article.source] ?? article.source}
        </span>
        <time className="text-mono-sm text-text-dim">
          {article.created_at ? timeAgo(article.created_at) : ""}
        </time>
        {article.featured && (
          <span className="badge bg-neon-lime/15 text-neon-lime text-pixel">FEATURED</span>
        )}
      </div>

      {/* Title + summary */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-body-md text-text-primary font-semibold
                   hover:text-neon-cyan transition-colors duration-150
                   line-clamp-2 block"
      >
        {article.title}
      </a>
      {article.summary && (
        <p className="text-body-sm text-text-secondary mt-2 line-clamp-2">
          {article.summary}
        </p>
      )}

      {/* Vote row */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border-subtle">
        <button
          onClick={voteUp}
          className={`flex items-center gap-1.5 text-mono-sm transition-colors duration-150
            ${myVote === 1 ? "text-neon-lime" : "text-text-dim hover:text-neon-lime"}`}
          title="Thumbs up"
        >
          <ThumbsUp className={`w-4 h-4 ${myVote === 1 ? "fill-neon-lime" : ""}`} />
          <span>{upvotes}</span>
        </button>

        <button
          onClick={voteDown}
          className={`flex items-center gap-1.5 text-mono-sm transition-colors duration-150
            ${myVote === -1 ? "text-neon-red" : "text-text-dim hover:text-neon-red"}`}
          title="Thumbs down"
        >
          <ThumbsDown className={`w-4 h-4 ${myVote === -1 ? "fill-neon-red" : ""}`} />
          <span>{downvotes}</span>
        </button>

        {net !== 0 && (
          <span className={`text-mono-sm ml-auto ${net > 0 ? "text-neon-lime" : "text-neon-red"}`}>
            {net > 0 ? "+" : ""}{net}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SourceId | "all">("all");

  useEffect(() => {
    supabase
      .from("news_articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) console.error("News fetch error:", error);
        setArticles((data ?? []) as Article[]);
        setLoading(false);
      });
  }, []);

  const filtered = filter === "all"
    ? articles
    : articles.filter((a) => a.source === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-h1 text-text-primary">
          <Newspaper className="w-6 h-6 inline-block text-neon-cyan mr-2" />
          <span className="text-neon-cyan">/</span>news
        </h1>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`badge ${filter === "all" ? "badge-cyan text-pixel" : ""}`}
          >
            ALL
          </button>
          {SOURCES.map((src) => (
            <button
              key={src.id}
              onClick={() => setFilter(src.id)}
              className={`badge ${filter === src.id ? badgeClass(src.color) + " text-pixel" : ""}`}
            >
              {src.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divider-neon mb-6" />

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="card-news border-l-neon-cyan animate-pulse">
              <div className="h-5 w-24 bg-bg-elevated rounded mb-2" />
              <div className="h-5 w-3/4 bg-bg-elevated rounded mb-2" />
              <div className="h-4 w-full bg-bg-elevated rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <Newspaper className="w-12 h-12 mx-auto text-text-dim mb-4" />
          <p className="text-body-lg text-text-secondary">
            {filter === "all"
              ? "No news articles yet. The aggregator will populate this soon."
              : `No articles from ${labelMap[filter]}.`}
          </p>
        </div>
      )}

      {/* News Feed */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((article) => (
            <NewsArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}