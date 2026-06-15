# LFF Editorial Redesign — Design Spec

**Date:** 2026-06-15
**Status:** Approved (brainstorming)
**Source of truth for content:** `data/data.json`

## Summary

A complete redesign of the Luigi Footprints Foundation website around newly rewritten
content. The visual direction is **Editorial Mono**: an ivory-and-ink, magazine-style
aesthetic anchored to the foundation's black logo, with a single deep conservation
green reserved for actions. The content is **block-based** and rendered by a generic
block renderer, so every page is generated from `data/data.json` with zero hardcoded copy.

Build sequence: **homepage + design system + shared components first**, validate, then
roll out the remaining four pages.

## Visual System (locked)

### Art direction
Editorial Mono — light, warm, magazine-like; ink on ivory paper; photography carries the
emotional weight; type and whitespace carry the luxury. Inspired by Aesop / Phaidon /
National Geographic editorial, not corporate charity.

### Color tokens
```
--paper        #FAF8F4   page background (ivory)
--paper-deep   #F1ECE3   alternating section background
--ink          #141414   primary text, logo, inverse-section background
--ink-soft     #565049   secondary text
--line         #E3DDD1   hairline rules, borders, dividers
--green        #1E5631   actions: buttons, links, key stats, focus rings
--green-deep   #163F24   hover / pressed
```
Two surface modes: **light** (ink on paper, default) and **inverse** (paper on ink),
the latter reserved for occasional full-bleed CTA bands and hero overlays so drama is earned.

### Typography
Display: **Fraunces** (soft serif, weight 500). Body/UI: **Inter**. Both via `next/font`.

| Role | Font | Size (clamp) | Notes |
|---|---|---|---|
| Display / H1 | Fraunces 500 | 40 → 72px | leading 1.05, tracking −0.01em |
| H2 | Fraunces 500 | 30 → 46px | section titles |
| H3 | Fraunces 500 | 21 → 28px | card / row headings |
| Eyebrow | Inter 600 | 11–12px | uppercase, tracking 0.22em, green |
| Body | Inter 400 | 16 → 18px | leading 1.6, measure ≤ 65ch |
| Meta / small | Inter 500 | 13–14px | captions, labels |

### Spacing, grid, motion
- 4px base spacing unit.
- Section vertical rhythm: `py 64px` (mobile) → `120–160px` (desktop).
- 12-column grid; container max-width 1200 / 1440 (existing `@utility container` retained).
- Motion: keep Lenis smooth scroll; GSAP scroll-reveal (fade + 16px rise) as the house
  transition; count-up on Impact numbers; subtle hero image parallax. All gated behind
  `prefers-reduced-motion`.

## Information Architecture

### Pages and visitor journey
| Page | Route | Role | Emotional beat |
|---|---|---|---|
| Home | `/` | Overview: who, why, proof, invitation | Hook & orient |
| About | `/about` | Luigi's legacy, philosophy, trustees | Trust & heritage |
| Our Work | `/our-work` | The four programs on the ground | Credibility & substance |
| Impact | `/impact` | Numbers → meaning, crisis response | Proof & emotion |
| Get Involved | `/get-involved` | Pathways to help | Conversion |
| Donate | `/donate` | Transactional (restyled, logic kept) | Action |

### Navigation
- Header: the five content pages, plus a visually distinct **Donate** button (green) pinned right.
- Navbar starts transparent over the hero and solidifies to ivory on scroll.
- Mobile: nav collapses into a sheet (reuse existing `ui/sheet`).
- **Contact** is not in the primary nav. The contact form + email/social live in the
  **footer** (present on every page) and the form is surfaced again on the Get Involved page,
  keeping the conversion path clean. The existing `/contact` route and its form-submit logic
  are retained and re-skinned, reachable from the footer, but demoted from the main nav.
- Every page ends in a CTA block (toward Get Involved or Donate) — no dead ends.

## Technical Architecture

### Block renderer
`data/data.json` is an array of `pages`, each with `slug`, `title`, `seo`, and a `blocks[]`
array. Each block has a `type`. Rendering pipeline:

```
data/data.json
  └─ lib/content.ts          getPage(slug), getAllPages(), getAllSlugs()  (typed)
       └─ app/<route>/page.tsx
            └─ <BlockRenderer blocks={page.blocks} />
                 └─ switch(block.type) → block component
```

- Five content routes (`/`, `/about`, `/our-work`, `/impact`, `/get-involved`) become thin,
  near-identical `page.tsx` files: fetch page by slug → render blocks → emit metadata from `seo`.
- `generateMetadata` per page reads `page.seo.title` / `page.seo.description`.
- Adding a page later = adding JSON, no new component code.

### Block types → components
| `block.type` | Component | Used on |
|---|---|---|
| `hero` | `HeroBlock` | all pages |
| `content` | `ContentBlock` | home, about, our-work, impact, get-involved |
| `cards` | `CardsBlock` | home, about, impact, get-involved |
| `impact` | `ImpactBlock` | home, impact |
| `team` | `TeamBlock` | about |
| `cta` | `CtaBlock` | home, about, get-involved |

### Component inventory

**Block components** (content-driven, one responsibility each):
1. `HeroBlock` — full-bleed image, ink-gradient overlay for legibility, eyebrow + Fraunces H1
   + subtitle + body + optional CTA. Variants: `home` (tall) and `interior` (shorter).
2. `ContentBlock` — editorial image/text row; alternates image side (left/right) down the page;
   optional eyebrow/subtitle.
3. `CardsBlock` — responsive 3-up cards with optional numbered tag and top rule.
4. `ImpactBlock` — oversized Fraunces/green stat figures with count-up + caption; renders on
   an inverse (ink) band on the homepage.
5. `TeamBlock` — trustee portrait grid (name + role); click expands full bio in a sheet/panel
   (reuse existing `ui/sheet` + TeamSheet pattern).
6. `CtaBlock` — full-width inverse band: headline + body + green button.

**Shared primitives:**
- `Layout` — Lenis smooth scroll + Navbar + Footer (retained shell, re-skinned).
- `Navbar` — transparent→solid on scroll, logo, links, Donate button, mobile sheet.
- `Footer` — contact form + nav + social + legal (the contact home).
- `Section` / `Container` — consistent max-width, vertical rhythm, light/inverse bg variant.
- `Eyebrow` — uppercase green label.
- `Button` — restyle existing `ui/button`: `primary` (green), `ghost`, `link` variants.
- `AnimatedNumber` — count-up for stats (reduced-motion aware).
- `Reveal` — GSAP scroll-reveal wrapper.
- `SmartImage` — `next/image` wrapper for remote WordPress images with aspect ratios.

Existing `ui/` parts (`input`, `label`, `textarea`, `select`, `sheet`) are kept and re-skinned
for Donate and Contact forms.

### Data layer changes
- **Add:** `lib/content.ts` (accessors) and block/page TypeScript types derived from the
  `data.json` schema.
- **Retire** (replaced by the block renderer): `lib/api.js` (WordPress GraphQL),
  `lib/pages.ts`, `lib/projects.ts`, and the old `data/*.json` WP snapshots
  (`all-projects.json`, `homepage.json`, `our-story.json`, `projects-page.json`).
- **Remove obsolete routes:** `/our-story` and `/projects/*` — their content is now covered
  by `/about` and `/our-work`.
- **Keep:** Donate (`/donate`) and Contact logic. Donate's payment integration (M-Pesa STK,
  PayPal, Mastercard lightbox) is preserved as-is and only re-skinned to the new system.

### Images
Content images are remote WordPress URLs (`api.theluigifootprints.org/wp-content/...`).
Register that host in `next.config.ts` `images.remotePatterns` for `next/image` optimization.
Note several images are reused across blocks (e.g. `Luigi.webp`, `Tree-Planting.webp`,
`Give.webp`) — acceptable for this phase.

## Page Compositions

All pages assemble from the six block types in `data.json` order. No bespoke per-page layout code.

- **Home** — hero → content (philosophy) → cards (focus areas) → impact (inverse band, count-up)
  → cta (Get Involved).
- **About** — hero → content (Luigi's legacy) → cards (Mission/Vision/Philosophy) → team
  (5 trustees, expandable bios) → cta.
- **Our Work** — hero → four alternating content rows (Education, Olchani restoration,
  Community enterprise, Coexistence & guarding).
- **Impact** — hero → impact (4 stats) → content (crisis response) → cards (meaning behind
  the metrics).
- **Get Involved** — hero → cards (ways to help) → content (tourism partnerships) → cta (Donate).

## Conversion & Accessibility

### Conversion
- Persistent green Donate button in the header on every page.
- Every page terminates in a CTA block.
- Impact stats positioned immediately before asks to build credibility.
- Get Involved presents tiered, concrete actions ("Sponsor a Student", "Support a Tree
  Nursery", "Fund Coexistence Tools").

### Accessibility (target WCAG 2.1 AA)
- Contrast: ink-on-paper ≈ 13:1; verify every green pairing meets AA (green on ivory for
  buttons/large text; check small-text usages and adjust to `--green-deep` where needed).
- Semantic landmarks (`header`, `nav`, `main`, `footer`), correct heading order per page.
- Keyboard-navigable mobile nav sheet and trustee bio expanders; visible green focus rings.
- Alt text sourced from `data.json` (`image.alt` present on all images).
- `prefers-reduced-motion` disables GSAP reveals, parallax, and count-up.

## Recommended Future Sections (content not yet available)

The brief requests testimonials/beneficiary stories, partner logos, news & updates, and a
timeline. None exist in `data/data.json`, and a hard requirement is no hardcoded content.
Plan:
- Design two optional block types now — `testimonial` and `logos` (partners) — that render
  automatically when matching blocks are added to `data.json`; do not ship placeholder content.
- Note `news` and a Luigi `timeline` as future content slots (block types to add when content
  is ready).

This keeps the live site honest while making it trivial to reach the full "award-ready"
scope the moment content lands.

## Out of Scope (this phase)
- Authoring testimonial/partner/news/timeline content.
- Rebuilding the donation payment flow (only re-skinned).
- A CMS migration; `data/data.json` is the source of truth for now.

## Open Questions
None outstanding. All visual and structural decisions confirmed during brainstorming.
