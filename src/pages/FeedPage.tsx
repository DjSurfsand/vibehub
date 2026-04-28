import { ArrowUp, ArrowDown, MessageCircle, Heart, ExternalLink } from "lucide-react";

/**
 * Placeholder feed page — will be filled with real data in Phase 4.
 * Shows the ProjectCard component with sample data.
 */
const DEMO_PROJECTS = [
  {
    id: "1",
    title: "Neural Canvas — AI SVG Generator",
    username: "vibemaster",
    createdAt: "3h ago",
    tags: ["react", "ai", "svg", "hot"],
    description:
      "A vibecoded tool that generates production-ready SVGs from natural language descriptions. Uses local LLM inference with react flow visualization. Built in a weekend. Open source.",
    score: 128,
    likes: 12,
    comments: 8,
    media: "🎨",
  },
  {
    id: "2",
    title: "Retro Dashboard — TUI System Monitor",
    username: "terminal_jockey",
    createdAt: "7h ago",
    tags: ["python", "tui", "system"],
    description:
      "Full system monitor with a retro terminal aesthetic. CPU, RAM, network, and disk visualized in ASCII. Uses psutil + textual. Vibecoded during a coffee binge.",
    score: 89,
    likes: 5,
    comments: 3,
    media: "📟",
  },
  {
    id: "3",
    title: "PromptForge — LLM Prompt Optimizer",
    username: "ai_wrangler",
    createdAt: "1d ago",
    tags: ["typescript", "llm", "tools", "beta"],
    description:
      "Automatically optimizes prompts for different LLM providers. Detects model, suggests rewrites, and benchmarks output quality. Supports OpenAI, Anthropic, and local models.",
    score: 214,
    likes: 31,
    comments: 15,
    media: "⚡",
  },
];

export default function FeedPage() {
  return (
    <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
      {/* Main Feed */}
      <main className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-h1 text-text-primary">
            <span className="text-neon-cyan">~</span>/feed
          </h1>
          <div className="flex items-center gap-2">
            <span className="badge badge-lime text-pixel">HOT</span>
            <span className="badge">NEW</span>
            <span className="badge badge-magenta">TOP</span>
          </div>
        </div>

        <div className="divider-neon" />

        {/* Project Cards */}
        {DEMO_PROJECTS.map((project) => (
          <div key={project.id} className="card-project group">
            {/* Media */}
            <div className="relative aspect-video rounded-md overflow-hidden mb-4 bg-bg-deep
                            flex items-center justify-center text-5xl
                            group-hover:scale-[1.02] transition-transform duration-300">
              {project.media}
            </div>

            <div className="flex gap-4">
              {/* Vote column */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <button className="btn-vote">
                  <ArrowUp className="w-5 h-5" />
                </button>
                <span className="text-mono-sm text-vote-up tabular-nums font-medium">
                  {project.score}
                </span>
                <button className="btn-vote hover:!text-vote-down">
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-body-md font-semibold text-text-primary truncate">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-mono-sm text-text-dim">
                  <span className="text-neon-cyan">@{project.username}</span>
                  <span>·</span>
                  <time>{project.createdAt}</time>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tags.map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-body-sm text-text-secondary mt-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Footer */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border-subtle">
                  <button className="flex items-center gap-1.5 text-text-dim
                                     hover:text-neon-magenta transition-colors duration-150">
                    <Heart className="w-4 h-4" />
                    <span className="text-mono-sm">{project.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-text-dim
                                     hover:text-text-primary transition-colors duration-150">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-mono-sm">{project.comments}</span>
                  </button>
                  <span className="ml-auto text-mono-sm text-neon-cyan cursor-pointer
                                   hover:text-glow-cyan transition-all flex items-center gap-1">
                    View Project <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
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

        {/* Mini news ticker */}
        <div className="sidebar-section">
          <p className="sidebar-section-title">LATEST NEWS</p>
          <div className="space-y-3">
            {[
              { source: "HERMES", title: "Hermes Agent v3.0 with MCP support" },
              { source: "AI", title: "Gemma 4 8B now runs on CPU via Ollama" },
              { source: "OPENCLAW", title: "OpenClaw 2.0 release announced" },
            ].map((item) => (
              <div
                key={item.title}
                className="text-body-sm text-text-secondary hover:text-text-primary
                           transition-colors cursor-pointer"
              >
                <span className="text-mono-sm text-neon-cyan">{item.source}</span>
                <p className="line-clamp-2 mt-0.5">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}