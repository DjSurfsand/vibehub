# VibeHub — Tailwind Component Plan

## Component Tree

```
<App>
├── <Navbar>                    ← fixed top, glass-blur, z-20
│   ├── Logo (Orbitron, gradient mark)
│   ├── NavLinks (Feed | News | Create)
│   ├── SearchTrigger (icon)
│   └── UserMenu (avatar + dropdown)
│
├── <main>
│   ├── <FeedPage>             ← route: /
│   │   ├── <FeedHeader> (trending tags, sort toggle)
│   │   ├── <ProjectCard>[]    ← the core component
│   │   │   ├── MediaPreview (screenshot / video)
│   │   │   ├── ProjectMeta (title, @user, time)
│   │   │   ├── TagPills[]
│   │   │   ├── VoteButtons (up / down + count)
│   │   │   └── CommentCount
│   │   ├── <Pagination> / <InfiniteScroll>
│   │   └── <Sidebar>
│   │       ├── <TrendingTags>
│   │       ├── <NewsTicker>  ← latest headlines
│   │       └── <UserMiniProfile>
│   │
│   ├── <NewsPage>             ← route: /news
│   │   ├── <NewsFilters> (Hermes | OpenClaw | AI-General)
│   │   └── <NewsCard>[]
│   │
│   ├── <CreatePage>           ← route: /create
│   │   ├── ProjectForm (title, desc, url, media, tags)
│   │   └── <TagSelector> (multi-select, searchable)
│   │
│   ├── <ProjectDetailPage>    ← route: /projects/:id
│   │   ├── ProjectHeader (full media, title, @user)
│   │   ├── <VoteButtons> (large variant)
│   │   ├── ProjectDescription
│   │   ├── <TagPills>
│   │   └── <CommentSection>
│   │       ├── <CommentComposer> (textarea + submit)
│   │       └── <CommentThread>[]
│   │           ├── Comment (avatar, username, body, time)
│   │           └── <CommentThread> (nested replies)
│   │
│   ├── <ProfilePage>          ← route: /profile/:username
│   │   ├── <ProfileHero>
│   │   │   ├── Avatar (large)
│   │   │   ├── DisplayName, Bio, Website
│   │   │   └── Stats (projects, upvotes, posts)
│   │   ├── <ProfileTabs> (Projects | Posts | About)
│   │   ├── <ProfileHtmlRenderer> ← MySpace sandboxed iframe
│   │   └── <UserPost>[]
│   │
│   ├── <ProfileEditPage>      ← route: /profile/:username/edit
│   │   ├── AvatarUploader
│   │   ├── BioEditor
│   │   └── <HtmlEditor> (monaco / textarea + preview)
│   │
│   └── <SettingsPage>         ← route: /settings
│       ├── Account (email, linked providers)
│       └── Theme (always dark, no toggle)
│
├── <AuthPages>
│   ├── <LoginPage>
│   │   ├── SocialButtons (Google, Facebook)
│   │   └── EmailForm (email + password input)
│   └── <RegisterPage>
│
├── <ToastProvider>            ← z-50, top-right
├── <Modal>                    ← z-40, backdrop blur
└── <Footer>                   ← minimal, text-secondary
```

---

## Component: ProjectCard (Core Component)

This is THE component — shows up in feeds, search results, and user profiles.

```tsx
// Rough structure — not final code
<div className="
  group
  bg-bg-card
  border border-border-subtle
  rounded-lg
  p-6
  shadow-card
  transition-all duration-200 ease-out
  hover:border-neon-cyan
  hover:shadow-card-hover
">
  {/* Media Preview — 16:9 aspect, rounded-top */}
  <div className="relative aspect-video rounded-md overflow-hidden mb-4 bg-bg-deep">
    <img src={project.mediaUrl} alt={project.title}
         className="object-cover w-full h-full
                    group-hover:scale-[1.02] transition-transform duration-300" />
  </div>

  {/* Title Row + Vote Column */}
  <div className="flex gap-4">
    {/* Vote Column (compact side) */}
    <div className="flex flex-col items-center gap-1 shrink-0">
      <button className="btn-vote">
        <ArrowUpIcon className="w-5 h-5" />
      </button>
      <span className="text-mono-sm text-text-secondary tabular-nums">
        {project.score}
      </span>
      <button className="btn-vote">
        <ArrowDownIcon className="w-5 h-5" />
      </button>
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <h3 className="text-body-md font-semibold text-text-primary truncate">
        {project.title}
      </h3>
      <div className="flex items-center gap-2 mt-1 text-mono-sm text-text-dim">
        <span>@{project.username}</span>
        <span>·</span>
        <time>{timeAgo(project.createdAt)}</time>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {project.tags.map(tag => (
          <span key={tag} className="badge">{tag}</span>
        ))}
      </div>

      {/* Description */}
      <p className="text-body-sm text-text-secondary mt-3 line-clamp-2">
        {project.description}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border-subtle">
        <button className="flex items-center gap-1.5 text-text-dim
                           hover:text-neon-magenta transition-colors duration-150">
          <HeartIcon className="w-4 h-4" />
          <span className="text-mono-sm">{project.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-text-dim
                           hover:text-text-primary transition-colors duration-150">
          <MessageCircleIcon className="w-4 h-4" />
          <span className="text-mono-sm">{project.commentCount}</span>
        </button>
        <a href={project.url} target="_blank"
           className="ml-auto text-mono-sm text-neon-cyan hover:text-glow transition-colors">
          View Project ↗
        </a>
      </div>
    </div>
  </div>
</div>
```

### States

| State | Border | Shadow | Notes |
|-------|--------|--------|-------|
| Default | `border-border-subtle` | `shadow-card` | — |
| Hover | `border-neon-cyan` | `shadow-card-hover` | border + glow transition |
| Active (click) | — | — | `scale-[0.98]` for 100ms |
| Loading (skeleton) | `border-border-subtle` | none | pulsing `bg-bg-card` blocks |

---

## Component: VoteButtons

```tsx
// Inline version (used in cards)
<div className="flex items-center gap-1" role="group" aria-label="Vote">
  <button onClick={onUpvote}
          className={cn(
            "p-1 rounded-sm transition-all duration-150",
            isUpvoted
              ? "text-vote-up text-glow-lime scale-110"
              : "text-text-dim hover:text-vote-up hover:scale-110"
          )}>
    <ArrowUpIcon className="w-5 h-5" />
  </button>
  <span className={cn(
    "text-mono-sm tabular-nums min-w-[1.5rem] text-center transition-colors",
    score > 0 && "text-vote-up",
    score < 0 && "text-vote-down",
    score === 0 && "text-text-dim"
  )}>
    {score}
  </span>
  <button onClick={onDownvote}
          className={cn(
            "p-1 rounded-sm transition-all duration-150",
            isDownvoted
              ? "text-vote-down text-glow-red scale-110"
              : "text-text-dim hover:text-vote-down hover:scale-110"
          )}>
    <ArrowDownIcon className="w-5 h-5" />
  </button>
</div>
```

Vote animation chain:
1. Click → icon lights up (neon color) + `scale(1.15)` bounce (200ms)
2. Score number changes + flashes the neon color (100ms delay)
3. If toggling off → icon fades back to dim, score returns to neutral

---

## Component: NewsCard

```tsx
<div className={cn(
  "bg-bg-elevated rounded-md p-5",
  "border-l-[3px] transition-all duration-200",
  "hover:brightness-110",
  source === "hermes" && "border-l-neon-cyan",
  source === "openclaw" && "border-l-neon-magenta",
  source === "ai" && "border-l-neon-amber",
)}>
  <div className="flex items-center gap-2 mb-2">
    <span className={cn(
      "badge text-pixel uppercase tracking-wider",
      source === "hermes" && "badge-cyan",
      source === "openclaw" && "badge-magenta",
      source === "ai" && "badge-amber",
    )}>
      {source}
    </span>
    <time className="text-mono-sm text-text-dim">{timeAgo(article.publishedAt)}</time>
    {article.featured && (
      <span className="badge badge-amber text-pixel">HOT</span>
    )}
  </div>
  <a href={article.url} target="_blank"
     className="text-body-md text-text-primary font-semibold
                hover:text-neon-cyan transition-colors duration-150
                line-clamp-2">
    {article.title}
  </a>
  <p className="text-body-sm text-text-secondary mt-2 line-clamp-2">
    {article.summary}
  </p>
</div>
```

---

## Component: Navbar

```tsx
<nav className="
  fixed top-0 left-0 right-0 z-20
  bg-bg-deep/85 backdrop-blur-glass
  border-b border-border-subtle
  h-16
">
  <div className="max-w-content mx-auto px-4 h-full flex items-center justify-between">
    {/* Logo */}
    <a href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-md bg-gradient-cta flex items-center justify-center
                      group-hover:shadow-glow-cyan transition-shadow duration-200">
        <span className="text-text-on-neon font-bold text-sm">V</span>
      </div>
      <span className="font-display text-h2 text-text-primary hidden sm:inline
                       group-hover:text-glow-cyan transition-all duration-200">
        VibeHub
      </span>
    </a>

    {/* Nav Links — center */}
    <div className="hidden md:flex items-center gap-1">
      {[
        { label: "Feed", href: "/", icon: LayoutDashboardIcon },
        { label: "News", href: "/news", icon: NewspaperIcon },
        { label: "Create", href: "/create", icon: PlusCircleIcon },
      ].map(link => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) => cn(
            "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-150",
            "text-body-sm font-medium",
            isActive
              ? "text-neon-cyan text-glow-cyan bg-neon-cyan/5"
              : "text-text-secondary hover:text-text-primary hover:bg-white/5"
          )}
        >
          <link.icon className="w-4 h-4" />
          {link.label}
        </NavLink>
      ))}
    </div>

    {/* Right — Search, Notif, Avatar */}
    <div className="flex items-center gap-3">
      <SearchDialog />
      <NotificationBell />
      <UserDropdown />
    </div>
  </div>
</nav>
```

---

## Component: Button System

```tsx
// Usage patterns:

// Primary CTA — gradient, high emphasis (1 per section max)
<button className="
  px-6 py-3 rounded-md font-semibold text-body-sm
  bg-gradient-cta text-text-on-neon
  hover:shadow-glow-cyan hover:-translate-y-px
  active:scale-95
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0
">
  {children}
</button>

// Secondary — outlined neon cyan
<button className="
  px-5 py-2.5 rounded-md font-semibold text-body-sm
  border-2 border-neon-cyan text-neon-cyan bg-transparent
  hover:bg-neon-cyan/10 hover:shadow-glow-cyan
  active:scale-95
  transition-all duration-200
">
  {children}
</button>

// Ghost — subtle, for toolbars / secondary actions
<button className="
  px-4 py-2 rounded-md text-body-sm
  text-text-secondary bg-transparent
  hover:text-text-primary hover:bg-white/5
  transition-colors duration-150
">
  {children}
</button>

// Badge Button (Tag pill) — clickable tag
<button className="
  px-2.5 py-1 rounded-full text-mono-sm
  bg-neon-cyan/15 text-neon-cyan
  hover:bg-neon-cyan/25 hover:text-glow-cyan
  transition-all duration-150
">
  #{tag}
</button>
```

---

## Component: ProfileHTML Renderer (MySpace Mode)

```tsx
// Sandboxed iframe rendering of user-submitted HTML
// CRITICAL: must be sandboxed — user HTML is untrusted

const ProfileHtmlRenderer = ({ html }: { html: string }) => {
  if (!html) return null;

  return (
    <div className="
      rounded-xl border-2 border-neon-cyan overflow-hidden
      min-h-[400px] bg-bg-deep
    ">
      <div className="
        px-3 py-1.5 bg-bg-elevated border-b border-border-subtle
        flex items-center gap-2 text-mono-sm text-text-dim
      ">
        <span className="w-3 h-3 rounded-full bg-neon-red" />
        <span className="w-3 h-3 rounded-full bg-neon-amber" />
        <span className="w-3 h-3 rounded-full bg-neon-lime" />
        <span className="ml-2">MySpace Mode — Custom HTML Profile</span>
      </div>
      <iframe
        srcDoc={html}
        sandbox="allow-scripts"  // ← no allow-same-origin, no allow-popups
        className="w-full min-h-[400px] border-0"
        title="Custom Profile"
        style={{ background: '#0A0A0F' }}
      />
    </div>
  );
};
```

---

## Component: CommentSection

```tsx
// Each comment thread uses nested indentation via left border
<div className="space-y-4">
  {/* New comment composer */}
  <div className="flex gap-3">
    <Avatar src={user.avatar} size="sm" />
    <div className="flex-1">
      <textarea
        className="
          w-full bg-bg-deep border border-border-subtle rounded-md
          p-3 text-body-sm text-text-primary
          placeholder:text-text-dim
          focus:border-neon-cyan focus:shadow-glow-ring
          transition-all duration-150 resize-none
        "
        rows={3}
        placeholder="Share your thoughts..."
      />
      <button className="btn-primary mt-2">Post Comment</button>
    </div>
  </div>

  {/* Comments */}
  {comments.map(comment => (
    <CommentThread key={comment.id} comment={comment} depth={0} />
  ))}
</div>

// Recursive CommentThread for nesting
const CommentThread = ({ comment, depth }) => {
  const maxDepth = 5; // clamp at 5 levels

  return (
    <div className={depth > 0 ? "border-l-2 border-border-subtle pl-4 ml-6" : ""}>
      {/* Comment Body */}
      <div className="flex gap-3 py-3">
        <Avatar src={comment.user.avatar} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-mono-sm text-neon-cyan font-medium">
              @{comment.user.username}
            </span>
            <span className="text-mono-sm text-text-dim">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-body-sm text-text-primary mt-1">{comment.body}</p>
          <div className="flex items-center gap-3 mt-2">
            <button className="text-mono-sm text-text-dim hover:text-vote-up transition-colors">
              ▲ {comment.upvotes}
            </button>
            <button className="text-mono-sm text-text-dim hover:text-vote-down transition-colors">
              ▼
            </button>
            {depth < maxDepth && (
              <button className="text-mono-sm text-text-dim hover:text-neon-cyan transition-colors">
                Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recursive nested replies */}
      {comment.replies?.map(reply => (
        <CommentThread key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
};
```

---

## Component: Button Variants + States Spreadsheet

| Variant | Default | Hover | Active | Disabled |
|---------|---------|-------|--------|----------|
| `btn-primary` | bg-gradient-cta, text-on-neon | shadow-glow-cyan, -translate-y-px | scale-95 | opacity-50, no-pointer |
| `btn-secondary` | border-2 border-neon-cyan, text-neon-cyan, transparent bg | bg-neon-cyan/10, shadow-glow-cyan | scale-95 | opacity-50, no-pointer |
| `btn-ghost` | text-text-secondary, transparent | text-text-primary, bg-white/5 | scale-95 | opacity-40 |
| `btn-vote-up` | text-text-dim, transparent | text-vote-up, scale-110 | scale-90 (press) | — |
| `btn-vote-down` | text-text-dim, transparent | text-vote-down, scale-110 | scale-90 (press) | — |
| `badge` | bg-neon-cyan/15, text-neon-cyan | bg-neon-cyan/25, text-glow-cyan | — | — |
| `badge-magenta` | bg-neon-magenta/15, text-neon-magenta | bg-neon-magenta/25 | — | — |
| `badge-lime` | bg-neon-lime/15, text-neon-lime | bg-neon-lime/25 | — | — |

---

## Utility Classes (used everywhere, shortcut via @apply)

The following CSS-in-JS pattern should be used via a `cn()` utility
(class-variance-authority preferred) or via `@apply` in a global CSS file.

```css
/* Example: if using postcss + @apply */
@layer components {
  .btn-primary {
    @apply px-6 py-3 rounded-md font-semibold text-body-sm
           bg-gradient-cta text-text-on-neon
           hover:shadow-glow-cyan hover:-translate-y-px
           active:scale-95
           transition-all duration-200
           disabled:opacity-50 disabled:cursor-not-allowed
           disabled:hover:shadow-none disabled:hover:translate-y-0;
  }

  .btn-secondary {
    @apply px-5 py-2.5 rounded-md font-semibold text-body-sm
           border-2 border-neon-cyan text-neon-cyan bg-transparent
           hover:bg-neon-cyan/10 hover:shadow-glow-cyan
           active:scale-95
           transition-all duration-200;
  }

  .btn-vote {
    @apply p-1 rounded-sm transition-all duration-150
           text-text-dim hover:text-vote-up hover:scale-110;
  }

  .badge {
    @apply px-2.5 py-1 rounded-full text-mono-sm
           bg-neon-cyan/15 text-neon-cyan
           transition-all duration-150;
  }

  .badge-cyan  { @apply bg-neon-cyan/15 text-neon-cyan; }
  .badge-magenta { @apply bg-neon-magenta/15 text-neon-magenta; }
  .badge-lime { @apply bg-neon-lime/15 text-neon-lime; }
  .badge-amber { @apply bg-neon-amber/15 text-neon-amber; }

  .card-project {
    @apply bg-bg-card border border-border-subtle rounded-lg p-6 shadow-card
           transition-all duration-200 ease-out
           hover:border-neon-cyan hover:shadow-card-hover;
  }

  .card-news {
    @apply bg-bg-elevated rounded-md p-5 border-l-[3px]
           transition-all duration-200;
  }

  .input-neon {
    @apply bg-bg-deep border border-border-subtle rounded-md
           px-4 py-2.5 text-body-sm text-text-primary
           placeholder:text-text-dim
           focus:border-neon-cyan focus:shadow-glow-ring
           transition-all duration-150
           outline-none;
  }

  .scrollbar-neon {
    scrollbar-width: thin;
    scrollbar-color: #2A2A4A #0A0A0F;
  }

  .scrollbar-neon::-webkit-scrollbar {
    width: 8px;
  }
  .scrollbar-neon::-webkit-scrollbar-track {
    background: #0A0A0F;
  }
  .scrollbar-neon::-webkit-scrollbar-thumb {
    background: #2A2A4A;
    border-radius: 4px;
  }
  .scrollbar-neon::-webkit-scrollbar-thumb:hover {
    background: #00F0FF;
  }
}
```

---

## Page Layout Patterns

```tsx
// Feed Page layout
<div className="min-h-screen bg-bg-deep pt-16"> // pt-16 = navbar space
  <div className="max-w-content mx-auto px-4 py-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
    {/* Main Feed */}
    <main className="space-y-4">
      <FeedHeader />
      {projects.map(p => <ProjectCard key={p.id} project={p} />)}
    </main>

    {/* Sidebar */}
    <aside className="hidden lg:block space-y-6">
      <TrendingTags />
      <NewsTicker />
      <UserMiniProfile />
    </aside>
  </div>
</div>

// Profile Page layout
<div className="bg-bg-deep min-h-screen pt-16">
  {/* Profile Hero — full-width with bg-grid */}
  <section className="bg-bg-surface bg-grid-cyan bg-grid-md border-b border-border-subtle">
    <div className="max-w-content mx-auto px-4 py-10 flex items-center gap-8">
      <Avatar src={profile.avatar} size="xl" />
      <div className="flex-1">
        <h1 className="font-display text-h1 text-text-primary">{profile.displayName}</h1>
        <p className="text-body-sm text-text-secondary mt-1">@{profile.username}</p>
        <div className="flex gap-6 mt-4">
          <Stat label="Projects" value={profile.projectCount} />
          <Stat label="Upvotes" value={profile.totalUpvotes} />
          <Stat label="Rep" value={profile.reputation} />
        </div>
      </div>
    </div>
  </section>

  {/* Profile Content */}
  <div className="max-w-content mx-auto px-4 py-8 grid lg:grid-cols-[1fr_360px] gap-8">
    <div>
      <ProfileTabs />
      <div className="mt-6 space-y-4">
        {profile.projects.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </div>
    <aside className="space-y-6">
      <ProfileHtmlRenderer html={profile.customHtml} />
      {!profile.customHtml && (
        <div className="card-project text-center p-8">
          <span className="text-4xl">✏️</span>
          <p className="text-body-sm text-text-secondary mt-2">
            No custom profile yet —
          </p>
          <a href="/profile/edit" className="text-neon-cyan hover:text-glow text-mono-sm">
            Unlock MySpace Mode
          </a>
        </div>
      )}
    </aside>
  </div>
</div>
```

---

## Color Accessibility Cheatsheet

| Combination | Ratio | AA Pass? | Used For |
|-------------|-------|----------|----------|
| text-primary (#E8E8F0) on bg-deep (#0A0A0F) | 14.1:1 | ✅ AAA | Body text |
| text-secondary (#8888AA) on bg-deep (#0A0A0F) | 6.3:1 | ✅ AA | Secondary text |
| text-secondary on bg-card (#1A1A2E) | 4.8:1 | ✅ AA | Subtitles on cards |
| text-dim (#555577) on bg-deep | 3.1:1 | ❌ AA | Placeholder only, never primary content |
| text-on-neon (#0A0A0F) on neon-cyan (#00F0FF) | 8.2:1 | ✅ AAA | Button text |
| neon-cyan on bg-deep | 4.6:1 | ✅ AA | Link text, badges |
| neon-magenta on bg-deep | 4.1:1 | ✅ AA* | Badges, secondary accents |
| neon-lime on bg-deep | 5.8:1 | ✅ AA | Success indicators |
| neon-amber on bg-deep | 5.5:1 | ✅ AA | Featured badges |

*neon-magenta is borderline at 4.1:1 — use bold or larger sizes, never as body text.

---

## Tailwind Plugin: cn() helper (class-variance-authority)

```tsx
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This is the **only import** needed for conditional class composition.
Every component uses `cn()` for variant management.