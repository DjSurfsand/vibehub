# VibeHub

> A retro-cyberpunk social platform for sharing vibecoded creations.
> GeoCities meets Blade Runner in a dark room with RGB lighting.

Share your latest vibecoded projects, upvote others' work, customize your profile with MySpace-style HTML, and stay up to date with Hermes AI, OpenClaw, and general AI news.

## Design Identity

| Element | Value |
|---------|-------|
| **Tone** | Playful, technical, electric — like a hacker running a GeoCities fan site |
| **Palette** | Deep space (`#0A0A0F`) + neon accents (cyan `#00F0FF`, magenta `#FF2D95`, lime `#39FF14`) |
| **Display font** | Orbitron — geometric, futuristic, uppercase by default |
| **Body font** | Inter — clean anchor, prevents retro from going full clown |
| **Code font** | JetBrains Mono — developer-first |
| **Accent font** | Press Start 2P — pixel font used sparingly for badges and easter eggs |
| **Shaping** | 4px (sm), 8px (md), 12px (lg), 16px (xl), full (avatars) |
| **Elevation** | Dark layers with neon border glows, not box-shadows |

## Project Structure

```
vibehub/
├── DESIGN.md              ← Full design system (Google DESIGN.md spec)
├── COMPONENT_PLAN.md      ← Component tree, code patterns, variant spreadsheets
├── tailwind.config.js     ← Tailwind v4 theme config
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/
│   └── vibehub.svg        ← Gradient favicon
└── src/
    ├── main.tsx           ← Entry point (currently renders DesignShowcase)
    ├── index.css          ← Global styles, @tailwind components, custom utilities
    ├── vite-env.d.ts
    ├── DesignShowcase.tsx  ← Live demo of every component
    └── lib/
        └── utils.ts       ← cn() class-merging utility
```

## Quick Start

```bash
cd vibehub
npm install
npm run dev
```

Opens at `http://localhost:5173` — shows the full DesignShowcase page with every component rendered.

## Components (per COMPONENT_PLAN.md)

| Component | File (future) | Status |
|-----------|--------------|--------|
| `Navbar` | `src/components/layout/Navbar.tsx` | Planned |
| `ProjectCard` | `src/components/project/ProjectCard.tsx` | Pattern defined |
| `VoteButtons` | `src/components/project/VoteButtons.tsx` | Pattern defined |
| `NewsCard` | `src/components/news/NewsCard.tsx` | Pattern defined |
| `CommentSection` | `src/components/comment/CommentSection.tsx` | Pattern defined |
| `CommentThread` | `src/components/comment/CommentThread.tsx` | Pattern defined |
| `ProfileHtmlRenderer` | `src/components/profile/ProfileHtmlRenderer.tsx` | Pattern defined |
| `Avatar` | `src/components/ui/Avatar.tsx` | Planned |
| `Badge` | `src/components/ui/Badge.tsx` | Planned |
| `Button variants` | `src/components/ui/Button.tsx` | Pattern defined |
| `Input / Textarea` | `src/components/ui/Input.tsx` | Pattern defined |
| `ToastProvider` | `src/components/ui/Toast.tsx` | Planned |
| `Modal` | `src/components/ui/Modal.tsx` | Planned |
| `Skeleton` | `src/components/ui/Skeleton.tsx` | Pattern defined |

## Pages (future)

- `/` — Feed (hot projects)
- `/news` — AI/Hermes/OpenClaw news
- `/create` — Submit a project
- `/projects/:id` — Project detail + comments
- `/profile/:username` — Custom profile (HTML renderer)
- `/profile/:username/edit` — Profile editor
- `/settings` — Account settings
- `/auth/login`, `/auth/register`

## Design Tokens (reference)

Full spec in `DESIGN.md`. Quick cheatsheet:

```
Colors:     bg-{deep|surface|card|elevated}, neon-{cyan|magenta|lime|amber|red}
Text:       text-{primary|secondary|dim|on-neon}
Typography: text-{h1|h2|h3|body-lg|body-md|body-sm|mono|mono-sm|pixel|label-caps}
Fonts:      font-{display|body|mono|pixel}
Spacing:    {xs|sm|md|lg|xl|xxl|section}
Shadows:    shadow-{card|card-hover|glow-cyan|glow-magenta|glow-lime|glow-ring|toast|modal}
Buttons:    btn-primary, btn-secondary, btn-ghost, btn-vote-up, btn-vote-down
Cards:      card-project, card-news (variants: card-news-{hermes|openclaw|ai})
Badges:     badge (variants: badge-{cyan|magenta|lime|amber|red})
Inputs:     input-neon, textarea-neon
Dividers:   divider-neon, divider-subtle
Utility:    text-glow, text-glow-{cyan|magenta|lime|red|amber}, bg-grid-{cyan|magenta}
Layout:     page-container, page-section, sidebar-section
```

## License

MIT — vibe it forward.