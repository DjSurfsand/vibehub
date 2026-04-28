import { cn } from "./lib/utils";

/**
 * Icon placeholder — using emoji for demo. In production, install lucide-react.
 * npm i lucide-react
 */
const Icon = ({ name, className }: { name: string; className?: string }) => (
  <span className={cn("text-lg leading-none", className)}>{name}</span>
);

export default function DesignShowcase() {
  return (
    <div className="min-h-screen bg-bg-deep pt-16">
      <div className="page-container py-section space-y-16">

        {/* ─── Hero ─── */}
        <section className="text-center space-y-4">
          <h1 className="text-h1 text-text-primary">
            <span className="text-neon-cyan">Vibe</span>
            <span className="text-neon-magenta">Hub</span>
          </h1>
          <p className="text-body-lg text-text-secondary max-w-readable mx-auto">
            A retro-cyberpunk social platform for sharing vibecoded creations.
            Late-90s GeoCities energy meets modern dark-mode neon aesthetics.
          </p>
          <div className="divider-neon max-w-sm mx-auto mt-6" />
        </section>

        {/* ─── Colors ─── */}
        <section className="space-y-4">
          <h2 className="text-h2">
            <span className="text-neon-cyan">01.</span> Colors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "bg-deep", hex: "#0A0A0F", class: "bg-bg-deep border border-border-subtle" },
              { name: "bg-surface", hex: "#12122A", class: "bg-bg-surface border border-border-subtle" },
              { name: "bg-card", hex: "#1A1A2E", class: "bg-bg-card border border-border-subtle" },
              { name: "bg-elevated", hex: "#16213E", class: "bg-bg-elevated border border-border-subtle" },
            ].map(c => (
              <div key={c.name} className={`${c.class} rounded-md p-4 space-y-1`}>
                <p className="text-mono-sm text-text-primary">{c.name}</p>
                <p className="text-mono-sm text-text-dim">{c.hex}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[
              { name: "neon-cyan", hex: "#00F0FF", class: "bg-neon-cyan" },
              { name: "neon-magenta", hex: "#FF2D95", class: "bg-neon-magenta" },
              { name: "neon-lime", hex: "#39FF14", class: "bg-neon-lime" },
              { name: "neon-amber", hex: "#FFB347", class: "bg-neon-amber" },
            ].map(c => (
              <div key={c.name} className="space-y-1">
                <div className={`${c.class} h-20 rounded-md border border-border-subtle flex items-end p-2`}>
                  <span className="text-mono-sm text-text-on-neon font-bold">{c.name}</span>
                </div>
                <p className="text-mono-sm text-text-dim">{c.hex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Typography ─── */}
        <section className="space-y-6">
          <h2 className="text-h2">
            <span className="text-neon-cyan">02.</span> Typography
          </h2>
          <div className="card-project space-y-6">
            <div>
              <p className="text-label-caps text-text-dim mb-2">H1 · Orbitron 2.5rem Bold</p>
              <h1 className="text-h1">VibeHub Social Platform</h1>
            </div>
            <div>
              <p className="text-label-caps text-text-dim mb-2">H2 · Orbitron 1.75rem Semibold</p>
              <h2 className="text-h2">Trending Creations</h2>
            </div>
            <div>
              <p className="text-label-caps text-text-dim mb-2">H3 · Inter 1.25rem Semibold</p>
              <h3 className="text-h3">This is a card title or subsection header</h3>
            </div>
            <div>
              <p className="text-label-caps text-text-dim mb-2">Body MD · Inter 0.9375rem (Default)</p>
              <p className="text-body-md text-text-primary">
                This is the default body text. Clean, highly readable at any size on dark backgrounds.
                Developers share their latest vibecoded creations here — apps, sites, tools, art.
              </p>
            </div>
            <div>
              <p className="text-label-caps text-text-dim mb-2">Body SM · Inter 0.8125rem</p>
              <p className="text-body-sm text-text-secondary">
                Secondary text for comments, metadata, and less prominent information.
              </p>
            </div>
            <div>
              <p className="text-label-caps text-text-dim mb-2">Mono · JetBrains Mono 0.875rem</p>
              <p className="text-mono text-neon-cyan">@username · react python ai</p>
            </div>
            <div>
              <p className="text-label-caps text-text-dim mb-2">Pixel · Press Start 2P 0.625rem</p>
              <p className="text-pixel text-neon-magenta uppercase tracking-wider">NEW · HOT · BETA</p>
            </div>
            <div>
              <p className="text-label-caps text-text-dim mb-2">Label Caps · Inter 0.6875rem Uppercase</p>
              <p className="text-label-caps text-text-dim">TRENDING TAGS · SORT BY HOT · VIEW ALL</p>
            </div>
          </div>
        </section>

        {/* ─── Buttons ─── */}
        <section className="space-y-6">
          <h2 className="text-h2">
            <span className="text-neon-cyan">03.</span> Buttons
          </h2>
          <div className="card-project">
            <p className="text-label-caps text-text-dim mb-4">BUTTON VARIANTS</p>
            <div className="flex flex-wrap gap-4 items-center">
              <button className="btn-primary">Primary CTA</button>
              <button className="btn-secondary">Secondary</button>
              <button className="btn-ghost">Ghost</button>
              <button className="btn-primary" disabled>Disabled</button>
            </div>

            <p className="text-label-caps text-text-dim mt-8 mb-4">VOTE BUTTONS</p>
            <div className="flex items-center gap-6">
              {/* Upvoted state */}
              <div className="flex items-center gap-1">
                <button className="btn-vote-up-active">
                  <Icon name="▲" />
                </button>
                <span className="text-mono-sm text-vote-up tabular-nums">42</span>
                <button className="btn-vote-down">
                  <Icon name="▼" />
                </button>
              </div>

              {/* Neutral state */}
              <div className="flex items-center gap-1">
                <button className="btn-vote-up">
                  <Icon name="▲" />
                </button>
                <span className="text-mono-sm text-text-dim tabular-nums">0</span>
                <button className="btn-vote-down">
                  <Icon name="▼" />
                </button>
              </div>

              {/* Downvoted state */}
              <div className="flex items-center gap-1">
                <button className="btn-vote-up">
                  <Icon name="▲" />
                </button>
                <span className="text-mono-sm text-vote-down tabular-nums">-3</span>
                <button className="btn-vote-down-active">
                  <Icon name="▼" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Badges ─── */}
        <section className="space-y-6">
          <h2 className="text-h2">
            <span className="text-neon-cyan">04.</span> Badges & Tags
          </h2>
          <div className="flex flex-wrap gap-3">
            <span className="badge badge-cyan">react</span>
            <span className="badge badge-magenta">beta</span>
            <span className="badge badge-lime">trending</span>
            <span className="badge badge-amber">featured</span>
            <span className="badge badge-red">breaking</span>
            <span className="badge badge-cyan">#python</span>
            <span className="badge badge-cyan">tailwind</span>
            <span className="badge badge-magenta">vibe</span>
          </div>
        </section>

        {/* ─── Project Card ─── */}
        <section className="space-y-6">
          <h2 className="text-h2">
            <span className="text-neon-cyan">05.</span> Project Card (Core Component)
          </h2>
          <div className="card-project group">
            {/* Screenshot area */}
            <div className="relative aspect-video rounded-md overflow-hidden mb-4 bg-bg-deep
                            flex items-center justify-center
                            group-hover:scale-[1.02] transition-transform duration-300">
              <div className="text-center">
                <span className="text-5xl">🎨</span>
                <p className="text-mono-sm text-text-dim mt-2">
                  screenshot placeholder
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              {/* Vote column */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <button className="btn-vote-up-active">
                  <Icon name="▲" />
                </button>
                <span className="text-mono-sm text-vote-up tabular-nums">128</span>
                <button className="btn-vote-down">
                  <Icon name="▼" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-body-md font-semibold text-text-primary truncate">
                  Neural Canvas — AI-Powered SVG Generator
                </h3>
                <div className="flex items-center gap-2 mt-1 text-mono-sm text-text-dim">
                  <span className="text-neon-cyan">@vibemaster</span>
                  <span>·</span>
                  <time>3h ago</time>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="badge badge-cyan">react</span>
                  <span className="badge badge-cyan">ai</span>
                  <span className="badge badge-cyan">svg</span>
                  <span className="badge badge-amber">hot</span>
                </div>

                {/* Description */}
                <p className="text-body-sm text-text-secondary mt-3 line-clamp-2">
                  A vibecoded tool that generates production-ready SVGs from natural language
                  descriptions. Uses local LLM inference with react flow visualization.
                  Built in a weekend. Open source.
                </p>

                {/* Footer */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border-subtle">
                  <button className="flex items-center gap-1.5 text-text-dim
                                     hover:text-neon-magenta transition-colors duration-150">
                    <Icon name="♥" />
                    <span className="text-mono-sm">12</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-text-dim
                                     hover:text-text-primary transition-colors duration-150">
                    <Icon name="💬" />
                    <span className="text-mono-sm">8</span>
                  </button>
                  <a href="#"
                     className="ml-auto text-mono-sm text-neon-cyan hover:text-glow transition-colors">
                    View Project ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── News Card Variants ─── */}
        <section className="space-y-6">
          <h2 className="text-h2">
            <span className="text-neon-cyan">06.</span> News Cards
          </h2>
          <div className="space-y-4">
            {[
              { source: "HERMES AI", border: "card-news-hermes", title: "Hermes Agent v3.0 — Autonomous coding with MCP support" },
              { source: "OPENCLAW", border: "card-news-openclaw", title: "OpenClaw 2.0 Release: Multi-agent orchestration toolkit" },
              { source: "AI GENERAL", border: "card-news-ai", title: "Gemma 4 8B now available via Ollama — CPU inference tested" },
            ].map(n => (
              <div key={n.title} className={`card-news ${n.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-cyan text-pixel uppercase tracking-wider">{n.source}</span>
                  <time className="text-mono-sm text-text-dim">12h ago</time>
                  <span className="badge badge-lime text-pixel">NEW</span>
                </div>
                <a href="#" className="text-body-md text-text-primary font-semibold
                                       hover:text-neon-cyan transition-colors duration-150
                                       line-clamp-2 block">
                  {n.title}
                </a>
                <p className="text-body-sm text-text-secondary mt-2 line-clamp-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Inputs ─── */}
        <section className="space-y-6">
          <h2 className="text-h2">
            <span className="text-neon-cyan">07.</span> Inputs & Forms
          </h2>
          <div className="card-project space-y-6">
            <div>
              <label className="text-label-caps text-text-dim block mb-2">PROJECT TITLE</label>
              <input className="input-neon" placeholder="What did you build?" />
            </div>
            <div>
              <label className="text-label-caps text-text-dim block mb-2">DESCRIPTION</label>
              <textarea className="textarea-neon" rows={3} placeholder="Tell us about your vibecoded creation..." />
            </div>
            <div>
              <label className="text-label-caps text-text-dim block mb-2">TAGS</label>
              <input className="input-neon" placeholder="react, python, ai, ..." />
              <p className="text-mono-sm text-text-dim mt-2">Press Enter after each tag</p>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary">Submit Creation</button>
              <button className="btn-secondary">Preview</button>
            </div>
          </div>
        </section>

        {/* ─── Profile Section ─── */}
        <section className="space-y-6">
          <h2 className="text-h2">
            <span className="text-neon-cyan">08.</span> Profile / MySpace HTML
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Standard profile section */}
            <div className="card-profile space-y-6">
              <div className="flex items-center gap-4">
                <div className="avatar avatar-xl">
                  <div className="w-full h-full rounded-full bg-gradient-cta flex items-center justify-center text-text-on-neon font-bold text-xl">
                    V
                  </div>
                </div>
                <div>
                  <h3 className="text-h3 text-text-primary">VibeMaster</h3>
                  <p className="text-mono-sm text-neon-cyan">@vibemaster</p>
                  <p className="text-body-sm text-text-secondary mt-1">Building weird cool shit.</p>
                </div>
              </div>
              <div className="flex gap-6 text-center">
                {[
                  { label: "PROJECTS", value: "12" },
                  { label: "UPVOTES", value: "342" },
                  { label: "REP", value: "890" },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-h2 text-neon-cyan">{s.value}</p>
                    <p className="text-label-caps text-text-dim">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MySpace HTML demo */}
            <div className="profile-html-frame">
              <div className="px-3 py-1.5 bg-bg-elevated border-b border-border-subtle
                              flex items-center gap-2 text-mono-sm text-text-dim">
                <span className="w-3 h-3 rounded-full bg-neon-red inline-block" />
                <span className="w-3 h-3 rounded-full bg-neon-amber inline-block" />
                <span className="w-3 h-3 rounded-full bg-neon-lime inline-block" />
                <span className="ml-2">MySpace Mode — Custom HTML Profile</span>
              </div>
              <div className="p-8 text-center" style={{ background: '#0a0a0f' }}>
                <div className="inline-block p-4 rounded-lg" style={{
                  background: 'linear-gradient(135deg, #12122a, #1a1a2e)',
                  border: '2px solid #FF2D95',
                }}>
                  <p className="text-pixel text-neon-magenta mb-2">★ MY SPACE ★</p>
                  <p className="text-body-sm text-text-secondary">
                    ✦ Users can write custom HTML here ✦
                  </p>
                  <p className="text-mono-sm text-text-dim mt-3">
                    &lt;marquee&gt;full MySpace chaos&lt;/marquee&gt;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Comment Thread ─── */}
        <section className="space-y-6">
          <h2 className="text-h2">
            <span className="text-neon-cyan">09.</span> Comments
          </h2>
          <div className="card-project space-y-6">
            {/* Composer */}
            <div className="flex gap-3">
              <div className="avatar avatar-sm shrink-0">
                <div className="w-full h-full rounded-full bg-neon-cyan/30" />
              </div>
              <div className="flex-1 space-y-2">
                <textarea className="textarea-neon" rows={2} placeholder="Share your thoughts..." />
                <button className="btn-primary text-body-sm">Post Comment</button>
              </div>
            </div>

            <div className="divider-subtle" />

            {/* Thread */}
            <div className="space-y-4">
              {[0, 1].map(depth => (
                <div key={depth} className={depth > 0 ? "border-l-2 border-border-subtle pl-4 ml-6" : ""}>
                  <div className="flex gap-3 py-3">
                    <div className="avatar avatar-sm shrink-0">
                      <div className={`w-full h-full rounded-full ${depth === 0 ? 'bg-neon-magenta/30' : 'bg-neon-cyan/20'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-mono-sm text-neon-cyan font-medium">
                          {depth === 0 ? '@vibemaster' : '@code_wizard'}
                        </span>
                        <span className="text-mono-sm text-text-dim">2h ago</span>
                      </div>
                      <p className="text-body-sm text-text-primary mt-1">
                        {depth === 0
                          ? "This is sick! The SVG generation looks clean. How's the local LLM performance?"
                          : "Thanks! Running Gemma 4 via Ollama — ~1.4 tok/s on CPU but usable for this use case."}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button className="text-mono-sm text-text-dim hover:text-vote-up transition-colors">▲ 3</button>
                        <button className="text-mono-sm text-text-dim hover:text-vote-down transition-colors">▼</button>
                        <button className="text-mono-sm text-text-dim hover:text-neon-cyan transition-colors">Reply</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Navbar Preview ─── */}
        <section className="space-y-6">
          <h2 className="text-h2">
            <span className="text-neon-cyan">10.</span> Navigation Bar (fixed top)
          </h2>
          <div className="border border-border-subtle rounded-lg overflow-hidden">
            {/* Fake navbar */}
            <div className="h-16 bg-bg-deep/85 backdrop-blur-glass border-b border-border-subtle
                            flex items-center justify-between px-4">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-gradient-cta flex items-center justify-center">
                  <span className="text-text-on-neon font-bold text-sm">V</span>
                </div>
                <span className="font-display text-h2 text-text-primary hidden sm:inline">
                  VibeHub
                </span>
              </div>

              {/* Nav links */}
              <div className="flex items-center gap-1">
                {[
                  { label: "Feed", active: true },
                  { label: "News", active: false },
                  { label: "Create", active: false },
                ].map(n => (
                  <span key={n.label}
                        className={cn(
                          "px-4 py-2 rounded-md text-body-sm font-medium transition-all",
                          n.active
                            ? "text-neon-cyan bg-neon-cyan/5"
                            : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                        )}>
                    {n.label}
                  </span>
                ))}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3">
                <span className="text-text-dim text-lg">🔍</span>
                <span className="text-text-dim text-lg">🔔</span>
                <div className="avatar avatar-sm border-2 border-neon-cyan">
                  <div className="w-full h-full rounded-full bg-neon-magenta/30" />
                </div>
              </div>
            </div>

            {/* Content below nav to show scroll behavior */}
            <div className="p-6 bg-bg-surface text-center">
              <p className="text-mono-sm text-text-dim">
                Navbar is fixed top with backdrop-filter: blur(12px)
              </p>
              <p className="text-mono-sm text-text-dim mt-1">
                Active link: neon cyan with subtle glow
              </p>
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="text-center py-8 border-t border-border-subtle">
          <p className="font-display text-h2 text-text-primary">
            <span className="text-neon-cyan">Vibe</span><span className="text-neon-magenta">Hub</span>
          </p>
          <p className="text-mono-sm text-text-dim mt-2">
            built with vibe · open source · retro never dies
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-mono-sm text-text-dim">
            <span>✦</span>
            <span>vibecoded with ❤</span>
            <span>✦</span>
          </div>
        </footer>
      </div>
    </div>
  );
}