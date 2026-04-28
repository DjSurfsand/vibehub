---
version: alpha
name: VibeHub
description: Cyberpunk-retro social platform where devs share vibecoded creations. GeoCities meets Blade Runner in a dark room with RGB lighting.
colors:
  bg-deep: "#0A0A0F"
  bg-surface: "#12122A"
  bg-card: "#1A1A2E"
  bg-elevated: "#16213E"
  neon-cyan: "#00F0FF"
  neon-magenta: "#FF2D95"
  neon-lime: "#39FF14"
  neon-amber: "#FFB347"
  neon-red: "#FF3355"
  text-primary: "#E8E8F0"
  text-secondary: "#8888AA"
  text-dim: "#555577"
  text-on-neon: "#0A0A0F"
  border-subtle: "#2A2A4A"
  border-neon-cyan: "#00F0FF"
  border-neon-magenta: "#FF2D95"
  gradient-cta: "linear-gradient(135deg, #00F0FF, #FF2D95)"
  gradient-gold: "linear-gradient(135deg, #FFB347, #FF2D95)"
  shadow-glow-cyan: "0 0 15px rgba(0, 240, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.1)"
  shadow-glow-magenta: "0 0 15px rgba(255, 45, 149, 0.3), 0 0 40px rgba(255, 45, 149, 0.1)"
  shadow-card: "0 4px 20px rgba(0, 0, 0, 0.4)"
  vote-up: "#39FF14"
  vote-down: "#FF3355"
typography:
  h1:
    fontFamily: Orbitron
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.02em"
    textTransform: uppercase
  h2:
    fontFamily: Orbitron
    fontSize: 1.75rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.01em"
  h3:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: Inter
    fontSize: 1.0625rem
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    lineHeight: 1.5
  mono:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    lineHeight: 1.5
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    lineHeight: 1.4
  pixel:
    fontFamily: '"Press Start 2P"'
    fontSize: 0.625rem
    lineHeight: 1.4
    letterSpacing: "0.05em"
  label-caps:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: 600
    letterSpacing: "0.08em"
    textTransform: uppercase
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px
components:
  btn-primary:
    backgroundColor: "{gradient-cta}"
    textColor: "{text-on-neon}"
    rounded: "{rounded.md}"
    padding: 12px 24px
    fontFamily: Inter
    fontWeight: 600
    fontSize: 0.875rem
  btn-primary-hover:
    boxShadow: "{shadow-glow-cyan}"
    transform: translateY(-1px)
  btn-secondary:
    backgroundColor: transparent
    border: 2px solid "{neon-cyan}"
    textColor: "{neon-cyan}"
    rounded: "{rounded.md}"
    padding: 10px 22px
    fontFamily: Inter
    fontWeight: 600
  btn-secondary-hover:
    backgroundColor: "rgba(0, 240, 255, 0.1)"
    boxShadow: "{shadow-glow-cyan}"
  btn-ghost:
    backgroundColor: transparent
    textColor: "{text-secondary}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  btn-ghost-hover:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{text-primary}"
  btn-vote-up:
    backgroundColor: transparent
    textColor: "{text-dim}"
    rounded: "{rounded.sm}"
    padding: 4px 8px
  btn-vote-up-active:
    textColor: "{vote-up}"
    textShadow: "0 0 8px rgba(57, 255, 20, 0.5)"
  btn-vote-down:
    backgroundColor: transparent
    textColor: "{text-dim}"
    rounded: "{rounded.sm}"
    padding: 4px 8px
  btn-vote-down-active:
    textColor: "{vote-down}"
    textShadow: "0 0 8px rgba(255, 51, 85, 0.5)"
  card-project:
    backgroundColor: "{bg-card}"
    textColor: "{text-primary}"
    rounded: "{rounded.lg}"
    padding: 24px
    border: 1px solid "{border-subtle}"
    boxShadow: "{shadow-card}"
  card-project-hover:
    borderColor: "{neon-cyan}"
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 240, 255, 0.15)"
  card-news:
    backgroundColor: "{bg-elevated}"
    textColor: "{text-primary}"
    rounded: "{rounded.md}"
    padding: 20px
    borderLeft: 3px solid "{neon-cyan}"
  card-news-hermes:
    borderLeftColor: "{neon-cyan}"
  card-news-openclaw:
    borderLeftColor: "{neon-magenta}"
  card-news-ai:
    borderLeftColor: "{neon-amber}"
  card-profile:
    backgroundColor: "{bg-card}"
    rounded: "{rounded.xl}"
    padding: 32px
    border: 1px solid "{border-subtle}"
  input:
    backgroundColor: "{bg-deep}"
    textColor: "{text-primary}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    border: 1px solid "{border-subtle}"
    fontFamily: Inter
    fontSize: 0.875rem
  input-focus:
    borderColor: "{neon-cyan}"
    boxShadow: "0 0 0 3px rgba(0, 240, 255, 0.15)"
  textarea:
    backgroundColor: "{bg-deep}"
    textColor: "{text-primary}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    border: 1px solid "{border-subtle}"
    fontFamily: Inter
    fontSize: 0.875rem
  badge:
    backgroundColor: "rgba(0, 240, 255, 0.15)"
    textColor: "{neon-cyan}"
    rounded: "{rounded.full}"
    padding: 2px 10px
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
  badge-magenta:
    backgroundColor: "rgba(255, 45, 149, 0.15)"
    textColor: "{neon-magenta}"
  badge-lime:
    backgroundColor: "rgba(57, 255, 20, 0.15)"
    textColor: "{neon-lime}"
  badge-amber:
    backgroundColor: "rgba(255, 179, 71, 0.15)"
    textColor: "{neon-amber}"
  avatar:
    rounded: "{rounded.full}"
    border: 2px solid "{border-subtle}"
    size: 40px
  avatar-lg:
    size: 64px
  avatar-xl:
    size: 96px
    border: 3px solid "{neon-cyan}"
  divider:
    height: 1px
    backgroundColor: "{border-subtle}"
  divider-neon:
    height: 1px
    background: "{gradient-cta}"
  toast:
    backgroundColor: "{bg-elevated}"
    textColor: "{text-primary}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    border: 1px solid "{border-subtle}"
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)"
  skeleton:
    backgroundColor: "{bg-card}"
    rounded: "{rounded.sm}"
  navbar:
    backgroundColor: "rgba(10, 10, 15, 0.85)"
    backdropFilter: blur(12px)
    borderBottom: 1px solid "{border-subtle}"
  navbar-link:
    textColor: "{text-secondary}"
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 500
  navbar-link-active:
    textColor: "{neon-cyan}"
    textShadow: "0 0 8px rgba(0, 240, 255, 0.3)"
  navbar-link-hover:
    textColor: "{text-primary}"
  profile-html-frame:
    backgroundColor: "{bg-deep}"
    rounded: "{rounded.xl}"
    border: 2px solid "{neon-cyan}"
    minHeight: 400px
  comment-thread:
    borderLeft: 2px solid "{border-subtle}"
    paddingLeft: 16px
  marquee-banner:
    backgroundColor: "{bg-elevated}"
    textColor: "{neon-cyan}"
    borderTop: 1px solid "{border-subtle}"
    borderBottom: 1px solid "{border-subtle}"
    padding: 8px 0
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
---
# VibeHub Design System

## Overview

**VibeHub** is a social platform where developers share their latest "vibecoded" creations — apps, sites, tools, art — and the community curates them via upvotes and comments. The visual identity channels **late-90s web nostalgia** (GeoCities, MySpace, visitor counters, starry backgrounds, `<blink>` tags) through a **modern dark-mode cyberpunk lens** (neon on deep space, glow effects, CRT grid textures).

The brand voice is **playful but technical** — like a hacker who runs a GeoCities fan site in their free time. It should feel:

- **Nostalgic but fresh** — retro nods without being dated
- **Electric** — neon colors that pop against deep darkness
- **Community-first** — warm glows, inviting surfaces, the voting mechanic feels like raising your hand at a demo night
- **A bit chaotic** — like MySpace profiles, like the internet used to be before it got boring

Every pixel says: *We're building weird, cool shit here. Come vibe.*

## Colors

### Dark Space Backgrounds

The canvas is **deep space**. Everything sits on layers of ultra-dark blue-black.

| Token | Hex | Role |
|-------|-----|------|
| `bg-deep` | `#0A0A0F` | Page background — near-black with the faintest blue tint |
| `bg-surface` | `#12122A` | Secondary surfaces, sidebars, news sections |
| `bg-card` | `#1A1A2E` | Card backgrounds, comment sections, profile panels |
| `bg-elevated` | `#16213E` | Elevated surfaces (modals, hover states, active cards) |

### Neon Accents (The "Vibe" in VibeHub)

Four neon channels, each with a distinct semantic role. Never use all four on one surface — pick two max.

| Token | Hex | Role |
|-------|-----|------|
| **Neon Cyan** `#00F0FF` | Primary interaction color. Links, primary buttons, active nav, glow effects. The "default" accent. Think electricity. |
| **Neon Magenta** `#FF2D95` | Secondary accent. Hearts, favorites, special badges, the VibeHub logo mark. Emotional / passionate. |
| **Neon Lime** `#39FF14` | Upvotes, success states, verification badges, "hot" trending tags. Positive feedback. |
| **Neon Amber** `#FFB347` | Warmth, gold badges, featured content, warnings. The "premium" neon. |
| **Neon Red** `#FF3355` | Downvotes, errors, destructive actions, blocked content. |

### Text

| Token | Hex | Role |
|-------|-----|------|
| `text-primary` | `#E8E8F0` | Body text, headings — almost-white with slight cool tone |
| `text-secondary` | `#8888AA` | Secondary info, timestamps, metadata |
| `text-dim` | `#555577` | Placeholder text, disabled states, subtle borders |
| `text-on-neon` | `#0A0A0F` | Text on neon backgrounds — always deep, never white |

### Borders & Shadows

| Token | Value | Role |
|-------|-------|------|
| `border-subtle` | `#2A2A4A` | Default card/input borders |
| `gradient-cta` | `linear-gradient(135deg, #00F0FF, #FF2D95)` | Primary CTA buttons |
| `gradient-gold` | `linear-gradient(135deg, #FFB347, #FF2D95)` | Featured / premium badges |
| `shadow-glow-cyan` | `0 0 15px rgba(0,240,255,0.3)` | Cyan neon glow |
| `shadow-glow-magenta` | `0 0 15px rgba(255,45,149,0.3)` | Magenta neon glow |

### Usage Guidelines

- **Do**: Use neon cyan for ALL interactive elements (links, buttons, nav active states)
- **Do**: Use neon lime exclusively for upvote indicators and verified/success states
- **Do**: Use neon magenta sparingly — heart/favorite, logo accent, easter egg moments
- **Don't**: Put neon text on neon backgrounds (unreadable — use `text-on-neon`)
- **Don't**: Use more than two neon colors on any single page section (chaos, not vibe)
- **Don't**: Use pure white (#FFF) anywhere — always use `text-primary`
- **Good combo**: cyan (interaction) + amber (featured) on feed
- **Good combo**: lime (votes) + magenta (hearts) on project detail

## Typography

### Typefaces

| Font | Used For | Why |
|------|----------|-----|
| **Orbitron** | H1, H2, logo, section titles | Geometric, futuristic, wide letter-spacing. Feels like a cyberpunk arcade sign. |
| **Inter** | Body text, labels, H3+, UI copy | Clean, neutral, highly readable at any size. The "modern" anchor that keeps the retro from going full clown. |
| **JetBrains Mono** | Code blocks, tags, usernames, metadata, timestamps | Developer-friendly monospace. Shows this is a platform *by* devs *for* devs. |
| **Press Start 2P** *(pixel)* | Badges, pixel-only labels, 404 messages | Used **sparingly** — only when the retro needs to wink at the user. Every pixel font use must earn its place. |

### Scale

| Token | Font | Size | Weight | Notes |
|-------|------|------|--------|-------|
| `h1` | Orbitron | 2.5rem / 40px | 700 | UPPERCASE by default. Use for page titles, hero sections |
| `h2` | Orbitron | 1.75rem / 28px | 600 | Section headers, modal titles |
| `h3` | Inter | 1.25rem / 20px | 600 | Card titles, subsystem headings |
| `body-lg` | Inter | 1.0625rem / 17px | 400 | Intro paragraphs, project descriptions |
| `body-md` | Inter | 0.9375rem / 15px | 400 | **Default body text** — used everywhere |
| `body-sm` | Inter | 0.8125rem / 13px | 400 | Comments, secondary info |
| `mono` | JetBrains Mono | 0.875rem / 14px | 400 | Code snippets, tags, usernames |
| `mono-sm` | JetBrains Mono | 0.75rem / 12px | 400 | Timestamps, tech tags, stats |
| `pixel` | Press Start 2P | 0.625rem / 10px | 400 | Badges only — hard to read at size, use sparingly |
| `label-caps` | Inter | 0.6875rem / 11px | 600 | UPPERCASE, wide tracking. Section labels, form labels |

### Line & Rhythm

- All body text: `line-height: 1.6` for readability on dark backgrounds
- Headings: tighter at `1.1–1.2`
- Vertical rhythm: use `spacing.md` (16px) between stacked text elements
- Never set more than `60ch` for a paragraph width

## Layout

### Grid System

- **Feed layout**: 2-column grid on tablets, single column on mobile, 3-column with a sidebar on desktop (1080px+)
- **Sidebar**: 300px fixed width, right-aligned — contains trending tags, news ticker, user mini-profile
- **Content max-width**: 1200px, centered with auto margins
- **Card grid**: `grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))`

### Spacing Scale

Rooted at 4px baseline. The scale:

| Token | PX | Use |
|-------|----|-----|
| `xs` | 4px | Icon padding, gap between inline elements |
| `sm` | 8px | Between badge elements, compact labels |
| `md` | 16px | **Default gap** — between card elements, button groups |
| `lg` | 24px | Between components, section padding |
| `xl` | 32px | Card internal padding, section headers |
| `xxl` | 48px | Between major sections |
| `section` | 80px | Page section breaks, hero spacing |

### Z-Index Stack

```
z-0    → Page background
z-10   → Cards, surfaces
z-20   → Sticky headers, nav
z-30   → Dropdowns, popovers
z-40   → Modals, overlays
z-50   → Toasts, notifications
```

### Breakpoints

| Name | Min-Width | Tailwind |
|------|-----------|----------|
| Mobile | 0 | (base) |
| Tablet | 640px | `sm:` |
| Desktop | 1024px | `lg:` |
| Wide | 1280px | `xl:` |

## Elevation & Depth

VibeHub uses **dark layers with neon borders**, not box-shadow, for depth.

| Level | Look | Token |
|-------|------|-------|
| Base (0) | Flat on `bg-deep` | Page |
| Surface (1) | `bg-surface` with subtle border | Sidebar, news sections |
| Card (2) | `bg-card` with `border-subtle` + `shadow-card` | Project cards, comment blocks |
| Elevated (3) | `bg-elevated` with neon border glow | Modals, hovered cards, focused inputs |
| Overlay (4) | `bg-surface` with heavy blurback | Mobile nav, modal backdrops |

Glow effects are elevation signals — a card gets a neon glow on hover, not a deeper shadow.

## Shapes

| Token | Radius | Use |
|-------|--------|-----|
| `sm` | 4px | Buttons, inputs, small interactive elements |
| `md` | 8px | Cards, modals, dropdowns — default surface radius |
| `lg` | 12px | Large cards (news, project detail panels) |
| `xl` | 16px | Profile cards, hero sections |
| `full` | 9999px | Avatars, badges, pill tags |

All corners are consistently rounded within their tier. No mixing `md` and `lg` on the same component.

## Components

### Navigation Bar

Fixed to top. Glass-morphism background (`rgba(10,10,15,0.85)` + `backdrop-filter: blur(12px)`). Bottom border is `border-subtle`.

Left: VibeHub logo (Orbitron, neon cyan + magenta gradient mark)
Center: Nav links (Feed, News, Create)
Right: Search icon, Notifications (bell), User avatar dropdown

Active nav link: neon cyan with subtle text glow
Inactive: `text-secondary`, hover → `text-primary`

Mobile: hamburger menu with full-screen overlay (bg-surface at z-40)

### Primary Button (`btn-primary`)

Gradient background (cyan → magenta), `rounded-md`, bold white text. Has an inner glow on hover. Never more than one per page section.

States:
- Default: gradient bg, white text
- Hover: elevated glow (`shadow-glow-cyan`), subtle lift (`-translate-y-px`)
- Active: pressed scale (`scale-95`)
- Disabled: 50% opacity, no pointer

### Secondary Button (`btn-secondary`)

Outlined with neon cyan border. Transparent background. Hover fills with `rgba(0,240,255,0.1)` + glow.

### Vote Buttons (`btn-vote-up` / `btn-vote-down`)

Compact, icon-only. Default state: dim text. Active state: lit neon color + subtle glow. Upvote turned neon lime by default, but the first upvote animates the glow in.

### Project Card (`card-project`)

The core feed component:

```
┌──────────────────────────────────┐
│  [screenshot / demo media]       │
│                                  │
│  Project Title              ⬆42 │
│  @username · 2h ago        ⬇3  │
│  ┌───┐ ┌───┐ ┌───┐              │
│  │react│ │python│ │ai│           │
│  └───┘ └───┘ └───┘              │
│  Brief description of the        │
│  vibecoded thing they made...    │
│  💬 12 comments                  │
└──────────────────────────────────┘
```

- Background: `bg-card`
- Border: `border-subtle` (1px)
- Hover: border shifts to neon cyan + subtle glow
- Tags: `badge` components (mono-sm, small pills)
- Vote section: vertically stacked on the right or inline at the bottom

### News Card (`card-news`)

Three variants distinguished by left border color:

- **cyan** left border → Hermes AI news
- **magenta** left border → OpenClaw news
- **amber** left border → General AI news

### Input & Textarea

Deep background (`bg-deep`), subtle border. Focus state: neon cyan border + a soft glow ring (`rgba(0,240,255,0.15)`). No rounded corners on textareas by default. Placeholder text in `text-dim`.

### Badges

Small mono-sm pills. Base color is neon cyan. Variants:
- **Cyan**: default tech tags
- **Magenta**: beta / early access
- **Lime**: verified / trending / hot
- **Amber**: featured / sponsored / gold

### Avatar

Circular (`rounded-full`), 2px border (cyan for selected/focused, subtle for default). Sizes: 32px (comment), 40px (nav), 64px (profile card), 96px (profile page hero).

### Comment Thread

Nested with left border indentation (`border-l-2 border-subtle`, `pl-4`). Each nest level uses `ml-6`. Comments are compact — avatar (32px), username (mono), body (body-sm), timestamp (mono-sm in text-dim).

### Skeleton Loading

Pulsing `bg-card` rectangles. Skeleton text lines are `rounded-sm`. Card skeleton matches `card-project` dimensions.

### Toast Notifications

Toasts appear in the top-right at z-50. Dark elevated surface, neon left border matching the toast type (cyan=info, lime=success, red=error). Auto-dismiss after 4 seconds.

## Animations & Micro-Interactions

### Essential

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Vote button → active | icon glows + slight bounce | 200ms | spring(80, 10, 10, 0) |
| Nav link hover | color fade | 150ms | ease-out |
| Card hover | border-color shift + glow | 200ms | ease-out |
| Button press | scale(0.95) | 100ms | ease-in-out |
| Page transition | content fades in | 200ms | ease-out |
| Toast enter | slide in from right | 300ms | cubic-bezier(0.16, 1, 0.3, 1) |

### Fun (use sparingly)

| Element | Effect | Trigger | Notes |
|---------|--------|---------|-------|
| Logo | scanning cyan glow pass | page load | Once per session |
| Upvote (+1) | count pop + lime flash | click | Micro-delight |
| 404 page | random retro glitch text | load | Rotate between "Lost in the Vibe" messages |
| New project submit | rainbow gradient border for 3s | success | Subtle playful reward |
| Scroll-trigger scan line | CRT line overlay flashes | first scroll | Easter egg, once per session |

## Do's and Don'ts

### Do
- **Do** use token references (`{neon-cyan}`) instead of hardcoded hex values
- **Do** keep backgrounds dark — `bg-deep` is the canvas, not `bg-card`
- **Do** use gradient for primary CTAs (it's the brand's main interactive statement)
- **Do** use `mono` for any developer-facing info (tags, usernames, stats)
- **Do** make vote buttons satisfying to click (visual feedback, not just data change)
- **Do** respect the retro-but-modern balance — one retro element per section max
- **Do** use `backdrop-filter: blur()` on overlays for depth
- **Do** validate WCAG contrast against AA minimum for all text sizes

### Don't
- **Don't** use `Press Start 2P` for anything other than badges, 404s, or one-off easter eggs — it's painful at scale
- **Don't** put more than 2 neon colors on one component
- **Don't** use `<blink>` or `<marquee>` in actual HTML — use CSS animations for the same effect
- **Don't** use pure `#000` black — always use `#0A0A0F` or darker variant
- **Don't** use animated backgrounds behind text — violates contrast and readability
- **Don't** use Comic Sans or Papyrus ironically or otherwise
- **Don't** forget hover states — every interactive element needs one
- **Don't** stack glow effects (a glowing card with a glowing button on it is too much)
- **Don't** make the retro theme override usability — MySpace *died* for a reason