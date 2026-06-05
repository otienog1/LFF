# LFF Website Redesign — Design Spec

## Summary

Full component rewrite of the Luigi Footprints Foundation website. Minimal, luxurious, premium aesthetic — editorial warmth over cold modernism. Data layer (lib/, JSON files, app/ routing) is untouched; only components are rewritten.

---

## Design Direction

**Mood:** A's cinematic drama + C's warm intimacy. Deep warm espresso backgrounds, not cold black. Muted gold accents. Italic serif headlines that feel editorial. Calm, considered, premium — like a high-end conservation magazine.

---

## Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-base` | `#1a1510` | Primary background |
| `--color-surface` | `#242018` | Cards, panels, elevated surfaces |
| `--color-border` | `#3a3228` | Dividers, input borders |
| `--color-cream` | `#f5ede0` | Primary text, light backgrounds |
| `--color-muted` | `#9a8e7e` | Secondary text, captions |
| `--color-gold` | `#c8b87a` | Accent — eyebrows, rules, hover states, CTAs |
| `--color-gold-light` | `#d4c88a` | Gold hover state |
| `--color-green` | `#1a4a28` | Conservation accent, project tags only |

### Typography

| Role | Font | Weight | Style | Size |
|---|---|---|---|---|
| Hero headline | Cormorant Garamond | 600 | italic | 80–96px |
| Section headline | Cormorant Garamond | 600 | italic | 52–64px |
| Pull quote | Cormorant Garamond | 400 | italic | 36px |
| Nav / subheading | Cormorant Garamond | 400 | normal | variable |
| Body copy | Inter | 300 | normal | 16–18px |
| Eyebrow / label | Inter | 400 | normal, uppercase | 10–11px, ls 0.15em |
| Caption | Inter | 300 | normal | 13px |

Loaded via `next/font/google`. CSS variables: `--font-cormorant`, `--font-inter`. Referenced in Tailwind `@theme`.

### Spacing & Layout

- Max content width: 1280px, centered
- Section vertical padding: 120px desktop / 64px mobile
- Column gutter: 32px
- Body copy max-width: 720px (editorial pages)

---

## Tailwind v4 Theme

Replace all existing `lff_*` tokens in `styles/globals.css` with the new palette above using `@theme`. Fonts injected as `--font-cormorant` and `--font-inter`.

---

## Layout & Navigation

### Root Layout (`components/layout/Layout.tsx`)

- Dark `#1a1510` body background set globally via CSS
- Fonts (Cormorant Garamond 400/400i/600/600i + Inter 300/400) loaded via `next/font/google`
- **Lenis** (`lenis` package) for smooth scroll, initialized here, exposed via `LenisContext`
- GSAP ScrollTrigger registered once and wired to Lenis's RAF tick:
  ```ts
  gsap.ticker.add(time => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  ```
- Page entrance animation: `gsap.from(main, { opacity: 0, y: 24, duration: 0.8, ease: 'power2.out' })` on mount
- All scroll animations use `useGSAP` hook from `@gsap/react` for automatic cleanup

### Navbar (`components/layout/Navbar.tsx`)

Layout:
```
[LUIGI FOOTPRINTS FOUNDATION]          [Story]  [Projects]  [Contact]  [Donate →]
```

- `position: fixed`, full width, `z-index: 50`
- **Transparent** at top of page (cream text)
- **On scroll > 80px**: `background: rgba(26,21,16,0.92)`, `backdrop-filter: blur(12px)`, transitions 300ms
- Logo: Cormorant Garamond 400, 11px, letter-spacing 0.25em, uppercase, `--color-cream`
- Nav links: Inter 300, 11px, uppercase, letter-spacing 0.12em, cream at 70% opacity → 100% on hover
- Hover underline: gold 1px rule, `scaleX` from 0 → 1, `transform-origin: left`, 250ms ease
- Donate link: thin gold border, gold text → filled gold background on hover
- Mobile (< 768px): hamburger → GSAP full-screen `#1a1510` overlay with Cormorant 48px nav links, stagger reveal

### Footer (`components/layout/Footer.tsx`)

- Background: `#0f0d09` (darker than base)
- Top: centered gold rule (1px, 40px wide) as section separator
- Three columns: LFF name + tagline | Navigation links | Social + contact email
- Inter 300, 12px, `--color-muted`
- Bottom bar: copyright · "Maniago Safaris" credit, separated by gold `·`

---

## Pages

### Home (`app/page.tsx`)

**Hero**
- Full-screen (`100svh`), dark overlay `rgba(26,21,16,0.55)` over background image
- Gold eyebrow: "Wildlife · Community · Kenya" (Inter uppercase)
- Gold 40px rule (1px height)
- Cormorant italic 96px headline: "Rewild the World"
- Inter 300 16px sub-line
- Two CTAs: "Donate →" (gold fill button) + "Our Story" (ghost/outline button)
- Images cycle via GSAP crossfade (opacity 1.2s ease, 6s interval)
- Scroll indicator: animated gold chevron bouncing

**Philosophy**
- Cream `#f5ede0` background, dark text
- Single Cormorant italic pull-quote, max-width 800px, 52px, centered
- Scroll-triggered fade + translate-up reveal (ScrollTrigger, scrub: false)

**Our Story Teaser**
- Two-column: left = editorial copy (eyebrow, Cormorant 48px headline, 2 Inter body paragraphs, "Read more →" link), right = tall image
- Right image: subtle parallax via ScrollTrigger `yPercent: -10` on scroll
- Dark `#1a1510` background

**Projects**
- "Selected Work" gold eyebrow
- 3-column card grid, scroll-triggered stagger reveal (0.15s between cards)
- Card: full-bleed image, Cormorant title + gold tag overlaid, opacity-0 → opacity-1 on hover (GSAP)
- "View all projects →" link below grid

**Luigi Section**
- Full-bleed dark background image, `rgba(26,21,16,0.6)` overlay
- Centered: Cormorant italic 52px quote from Luigi, Inter caption attribution
- Image parallax: ScrollTrigger `yPercent: -15`

**CTA Strip**
- Cream `#f5ede0` background
- Centered: "Support our work" Cormorant 52px, Inter body line, gold "Donate" button

---

### Our Story (`app/our-story/page.tsx`)

- Full-screen hero with parallax image + "Our Story" title
- Editorial layout below: max-width 720px centered, Inter 300 18px body, line-height 1.8
- Cormorant italic 36px pull-quotes break the text at key moments
- Team section: photo grid (square crop), Cormorant name + Inter title below each
- Click → shadcn `Sheet` (side panel slides in from right) with full bio text
- Sheet styled to dark theme: `#242018` background, cream text

---

### Projects Listing (`app/projects/page.tsx`)

- Page hero: title only, minimal, Cormorant italic
- Filter pills (project tags): gold border, transparent fill → gold fill active. GSAP fade transition between filtered states
- 2-column grid, alternating image aspect ratios (4:3 and 3:4) for visual rhythm
- Card hover: image `scale(1.05)` 400ms ease, title slides up from bottom (GSAP)
- Scroll-triggered stagger reveal on initial load

---

### Project Detail (`app/projects/[slug]/page.tsx`)

- Full-bleed hero image (100svh), ScrollTrigger parallax `yPercent: -20`
- Title + metadata (location, date, gold tag) in cream overlay, bottom-left
- Content area: max-width 720px, editorial typography (same as Our Story body)
- Inline images: full width of content column with subtle fade-in on scroll
- Back link: "← All Projects" in Inter uppercase, gold, top-left of content area

---

### Contact (`app/contact/page.tsx`)

- Two-column layout: left = LFF address / email / socials (Inter 300), right = form
- Form fields: Name, Email, Subject, Message — all shadcn `Input` / `Textarea`
- shadcn components styled via CSS variable overrides (dark background, gold focus ring, cream text)
- Submit: shadcn `Button` in gold fill variant
- No decorative elements — clean and functional

---

### Donate (`app/donate/page.tsx` + `donate-client.tsx`)

- Existing multi-step logic preserved (`DonateClient.tsx`)
- All UI replaced with shadcn components styled to theme
- Steps: Amount → Payment Info → Review → Complete
- Progress: thin gold rule fills left-to-right across steps (`scaleX` animation)
- Amount step: custom gold pill buttons (not shadcn) for preset amounts, shadcn `Input` for custom
- Payment step: shadcn `Input`, `Select` for currency, `Label` for all fields
- Consistent dark `#1a1510` background throughout

---

## Component File Map

```
components/
  layout/
    Layout.tsx          — Lenis context, GSAP ScrollTrigger init, page entrance animation
    Navbar.tsx          — fixed header, scroll-aware transparency, mobile overlay
    Footer.tsx          — minimal dark footer, three columns
  home/
    Hero.tsx            — full-screen GSAP image crossfade slider
    Philosophy.tsx      — centered pull-quote, scroll reveal
    StoryTeaser.tsx     — two-column editorial with parallax image
    ProjectsGrid.tsx    — 3-card featured grid with stagger
    LuigiSection.tsx    — full-bleed parallax quote
    CtaStrip.tsx        — cream donate call-to-action
  projects/
    ProjectCard.tsx     — card with GSAP hover reveal
    ProjectFilter.tsx   — gold pill filter buttons
  team/
    TeamGrid.tsx        — photo grid
    TeamSheet.tsx       — shadcn Sheet bio panel
  ui/                   — shadcn auto-generated (Button, Input, Textarea, Select, Sheet, Dialog, Label)
  donate/
    DonateClient.tsx    — existing logic, new shadcn UI
```

All existing components in `components/` root are deleted and replaced by the above structure.

---

## Technical Decisions

### Lenis (Smooth Scroll)
- Package: `lenis` (replaces custom GSAP smooth scroll in current Layout.tsx)
- Single instance created in `Layout.tsx`, exposed via `React.createContext<Lenis | null>`
- All ScrollTrigger animations reference Lenis via `gsap.ticker` integration (not `scroller` prop)

### GSAP
- Packages: `gsap`, `@gsap/react`
- `useGSAP` hook used everywhere — automatic context cleanup on unmount, no manual `kill()` calls
- ScrollTrigger registered once: `gsap.registerPlugin(ScrollTrigger)` in Layout
- No `new SmoothScroll()` — Lenis handles scroll

### shadcn/ui Setup
- Init: `npx shadcn@latest init` with `neutral` base, CSS variables mode
- Theme override in `globals.css`: all shadcn CSS variables (`--background`, `--foreground`, `--primary`, etc.) remapped to the new palette
- Components added: `Button`, `Input`, `Textarea`, `Select`, `Sheet`, `Label`
- No shadcn components used outside of forms and the team bio Sheet

### Fonts
- `next/font/google`: `Cormorant_Garamond` (subsets: latin, weights: 400/600, styles: normal/italic) + `Inter` (subsets: latin, weights: 300/400)
- Injected as CSS variables on `<html>`: `--font-cormorant`, `--font-inter`
- Tailwind `@theme`: `--font-display: var(--font-cormorant)`, `--font-body: var(--font-inter)`

### Data Layer (unchanged)
- `lib/pages.ts` — all page data fetching functions untouched
- All JSON data files in `lib/` untouched
- All `app/` route files (`page.tsx`) updated only to use new components; data fetching calls unchanged
- `output: 'export'` in `next.config.js` unchanged

### TypeScript
- All new components fully typed
- No `any` except where external library type gaps require it (GSAP DOM targets, imagesLoaded)
- Props interfaces defined inline (small components) or as named types (reused)

---

## Packages to Add

```
lenis
@gsap/react
```

shadcn/ui components added via CLI (no new npm packages beyond what shadcn installs).

## Packages to Remove

```
(none — existing packages retained)
```

---

## Out of Scope

- CMS integration — static JSON data files stay
- i18n / multi-language
- Analytics changes
- Any backend / API changes
- SEO metadata changes (existing metadata patterns preserved)
