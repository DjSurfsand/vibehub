import { ArrowUp, ArrowDown, MessageCircle, ExternalLink, Clock, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjects, type Project } from "../lib/projects";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

/* ─── Time helper ─── */

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

/* ─── Sidebar News Ticker ─── */

function SidebarNews() {
  const [items, setItems] = useState<{ source: string; label: string; title: string }[]>([]);

  useEffect(() => {
    supabase
      .from("news_articles")
      .select("title, source")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) {
          setItems(data.map((a: any) => ({
            source: a.source,
            label: a.source.toUpperCase().replace("-", " "),
            title: a.title,
          })));
        }
      });
  }, []);

  if (items.length === 0) {
    return (
      <div className="sidebar-section">
        <p className="sidebar-section-title">LATEST NEWS</p>
        <p className="text-body-sm text-text-dim">No news yet</p>
      </div>
    );
  }

  return (
    <div className="sidebar-section">
      <p className="sidebar-section-title">LATEST NEWS</p>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="text-body-sm text-text-secondary hover:text-text-primary
                       transition-colors cursor-pointer"
          >
            <span className="text-mono-sm text-neon-cyan">{item.label}</span>
            <p className="line-clamp-2 mt-0.5">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Project Card ─── */

function ProjectCard({ project }: { project: Project }) {
  const auth = useAuth();
  const isAuth = auth.status === "authenticated";

  const handleVote = async (value: 1 | -1) => {
    if (!isAuth) return;
    await supabase.from("votes").upsert(
      { user_id: auth.user.id, project_id: project.id, value },
      { onConflict: "user_id, project_id" }
    );
  };

  return (
    <Link to={`/projects/${project.id}`} className="card-project group block">
      {/* Media */}
      {project.media_url ? (
        <div className="relative aspect-video rounded-md overflow-hidden mb-4 bg-bg-deep">
          <img
            src={project.media_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="relative aspect-video rounded-md overflow-hidden mb-4 bg-bg-deep
                        flex items-center justify-center text-5xl
                        group-hover:scale-[1.02] transition-transform duration-300">
          <Flame className="w-12 h-12 text-neon-cyan" />
        </div>
      )}

      <div className="flex gap-4">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <button
            onClick={(e) => { e.preventDefault(); handleVote(1); }}
            disabled={!isAuth}
            className="btn-vote disabled:opacity-40"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <span className={`text-mono-sm tabular-nums font-medium ${
            project.score > 0 ? "text-vote-up" : project.score < 0 ? "text-vote-down" : "text-text-dim"
          }`}>
            {project.score}
          </span>
          <button
            onClick={(e) => { e.preventDefault(); handleVote(-1); }}
            disabled={!isAuth}
            className="btn-vote hover:!text-vote-down disabled:opacity-40"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-body-md font-semibold text-text-primary truncate">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-mono-sm text-text-dim">
            <span className="text-neon-cyan">@{project.username || "anonymous"}</span>
            <span>·</span>
            <time>{timeAgo(project.created_at)}</time>
          </div>

          {/* Tags */}
          {project.tech_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {project.tech_tags.map((tag) => (
                <span key={tag} className="badge">{tag}</span>
              ))}
            </div>
          )}

          <p className="text-body-sm text-text-secondary mt-3 line-clamp-2">
            {project.description}
          </p>

          {/* Footer */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border-subtle">
            <div className="flex items-center gap-1.5 text-text-dim">
              <ArrowUp className="w-4 h-4" />
              <span className="text-mono-sm">{project.upvote_count}</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-dim">
              <MessageCircle className="w-4 h-4" />
              <span className="text-mono-sm">{project.comment_count}</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-dim ml-auto">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-mono-sm">{timeAgo(project.created_at)}</span>
            </div>
            <span className="text-mono-sm text-neon-cyan group-hover:text-glow-cyan transition-all flex items-center gap-1">
              View <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Sort tabs ─── */

type SortMode = "hot" | "new" | "top";

/* ─── Main Component ─── */

export default function FeedPage() {
  const [sort, setSort] = useState<SortMode>("hot");
  const { projects, loading, error } = useProjects({ sort, limit: 50 });

  return (
    <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
      {/* Main Feed */}
      <main className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-h1 text-text-primary">
            <span className="text-neon-cyan">~</span>/feed
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSort("hot")}
              className={`badge cursor-pointer transition-colors ${sort === "hot" ? "badge-lime text-pixel" : ""}`}
            >
              HOT
            </button>
            <button
              onClick={() => setSort("new")}
              className={`badge cursor-pointer transition-colors ${sort === "new" ? "badge-lime text-pixel" : ""}`}
            >
              NEW
            </button>
            <button
              onClick={() => setSort("top")}
              className={`badge cursor-pointer transition-colors ${sort === "top" ? "badge-magenta text-pixel" : ""}`}
            >
              TOP
            </button>
          </div>
        </div>

        <div className="divider-neon" />

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card-project animate-pulse">
                <div className="aspect-video rounded-md bg-bg-elevated mb-4" />
                <div className="h-5 w-3/4 bg-bg-elevated rounded mb-2" />
                <div className="h-4 w-1/2 bg-bg-elevated rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-body-lg text-neon-red">{error}</p>
            <p className="text-body-sm text-text-secondary mt-2">
              Check your Supabase connection and try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-16">
            <Flame className="w-12 h-12 mx-auto text-text-dim mb-4" />
            <p className="text-body-lg text-text-secondary">
              No projects yet. Be the first to share!
            </p>
            <Link to="/create" className="btn-primary inline-block mt-4">
              Create Project →
            </Link>
          </div>
        )}

        {/* Project Cards */}
        {!loading && !error && projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </main>

      {/* Sidebar */}
      <aside className="hidden lg:block space-y-6 mt-12 lg:mt-0">
        {/* Trending tags */}
        <div className="sidebar-section">
          <p className="sidebar-section-title">TRENDING TAGS</p>
          <div className="flex flex-wrap gap-2">
            {["react", "python", "ai", "css", "tools", "games", "music", "3d"].map(
              (tag) => (
                <span key={tag} className="badge cursor-pointer hover:bg-neon-cyan/25">
                  #{tag}
                </span>
              )
            )}
          </div>
        </div>

        <div className="divider-subtle" />

        {/* Real news ticker */}
        <SidebarNews />
      </aside>
    </div>
  );
}
