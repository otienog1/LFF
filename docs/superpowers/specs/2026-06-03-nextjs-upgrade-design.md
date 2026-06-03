# Design: Upgrade to Next.js 15 + React 19 + TypeScript + Tailwind v4

**Date:** 2026-06-03  
**Status:** Approved  

## Problem

The LFF site runs Next.js 12 / React 17 with Pages Router. All packages are outdated. The site needs to be upgraded to Next.js 15, React 19, TypeScript, and Tailwind v4, with a migration from Pages Router to App Router.

## Goal

Upgrade all packages to their latest versions and migrate the codebase to:
- Next.js 15 + React 19
- App Router (from Pages Router)
- TypeScript (`.ts` / `.tsx` throughout)
- Tailwind CSS v4 (CSS-first config)

## Approach: Two sequential phases

**Phase 1:** Package upgrades + App Router migration + TypeScript  
**Phase 2:** Tailwind v4 migration  

Each phase produces a working, buildable site.

---

## Phase 1: Package upgrades + App Router + TypeScript

### Package changes

**Upgrade:**

| Package | From | To |
|---|---|---|
| `next` | 12.1.0 | 15 |
| `react` | ^17.0.2 | ^19 |
| `react-dom` | ^17.0.2 | ^19 |
| `gsap` | ^3.8.0 | latest |
| `sharp` | ^0.29.2 | latest |
| `date-fns` | ^2.23.0 | ^3 |
| `@paypal/react-paypal-js` | ^7.5.0 | latest |
| `react-transition-group` | ^4.4.2 | latest |
| `uuid` | ^9.0.0 | latest |

**Remove:**

| Package | Reason |
|---|---|
| `next-transpile-modules` | Built into Next.js 13+ |
| `locomotive-scroll` | Never imported anywhere |
| `cors` | Only used by deleted API routes |
| `@tailwindcss/custom-forms` | Deprecated (removed in Phase 2 anyway) |

**Add (devDependencies):**

| Package | Purpose |
|---|---|
| `typescript` ^5 | TypeScript compiler |
| `@types/react` ^19 | React types |
| `@types/react-dom` ^19 | React DOM types |
| `@types/node` ^22 | Node.js types |

**`package.json` scripts:** Remove `"export": "yarn build && next export"` — replaced by `output: 'export'` in config.

---

### next.config.ts (rewritten)

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'api.theluigifootprints.org' }],
    unoptimized: true,
  },
}

export default nextConfig
```

`unoptimized: true` is required because static export (`output: 'export'`) has no server to run Next.js image optimization.

---

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### Shared types — `types/index.ts`

```ts
export interface ImageRef {
  sourceUrl: string
}

export interface FeaturedImage {
  altText: string
  caption: string
  sourceUrl: string
  srcSet: string
  sizes: string
  id: string
}

export interface TypeOfProject {
  databaseId: number
  id: string
  name: string
  slug: string
}

export interface Project {
  id: string
  databaseId: number
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  modified: string
  featuredImage: FeaturedImage
  typesOfProjects: TypeOfProject[]
  tags: { name: string; slug: string }[]
}

export interface Homepage {
  heroText: string
  heroSlider: Array<{ image1: ImageRef; image2: ImageRef; image3: ImageRef }>
  sliderText: Array<{
    text: { heading: string; explainer: string }
    text1: { heading: string; explainer: string }
    text2: { heading: string; explainer: string }
  }>
  philosophyImage: ImageRef
  philosophyTitle: string
  philosophyText: string
  ourStoryTitle: string
  ourStoryIntro: string
  ourStoryText: string
  ourStoryImage: ImageRef
  projectsTitle: string
  projectText: string
  projects: Record<string, { image: ImageRef; text: string }>
  luigiTitle: string
  luigiText: string
  luigiText1: string
  luigiText2: string
  luigiImages: { image1: ImageRef; image2: ImageRef }
  ctaImage: ImageRef
  ctaTitle: string
  ctaText: string
}

export interface OurStory {
  heroContent: string
  heroImage: ImageRef
  whoWeAreTitle: string
  whoWeAreImage: ImageRef
  whoWeAreText: string
  whoWeAreText1: string
  title1: string
  title2: string
  trustees: Record<string, {
    name: string
    title: string
    thumb: ImageRef
    image: ImageRef
    text1: string
    text2: string
  }>
  banner: ImageRef
}

export interface ProjectsPage {
  pageTitle: string
  projectsText: string
  projectsSectionTitle: string
  projects: Array<{ image: ImageRef; title: string; slug: string }>
  moreProjects: Array<{ image: ImageRef; title: string; slug: string }>
}

export interface RelatedProject {
  title: string
  slug: string
}

export interface MoreProject {
  title: string
  slug: string
  image: FeaturedImage
}
```

---

### App Router file structure

```
app/
  layout.tsx                   ← root layout (metadata, GsapTransitionWrapper)
  page.tsx                     ← home page
  our-story/
    page.tsx
  projects/
    page.tsx
    [slug]/
      page.tsx                 ← generateStaticParams() here
  contact/
    page.tsx
  donate/
    page.tsx
components/
  GsapTransitionWrapper.tsx    ← extracted from _app.js, 'use client'
  Layout.tsx                   ← 'use client' (GSAP, IntersectionObserver)
  Navbar.tsx                   ← 'use client' (useState, useEffect)
  ... (all other components)
types/
  index.ts                     ← shared type definitions
```

**Deleted:**
- `pages/` directory entirely
- `pages/api/api.js`
- `pages/api/hello.js`

---

### Data fetching pattern

**Before (Pages Router):**
```js
export async function getStaticProps() {
  const { page } = await getHomePage()
  return { props: { page } }
}
export default function Home({ page }) { ... }
```

**After (App Router server component):**
```tsx
import { getHomePage } from '@/lib/pages'
import type { Homepage } from '@/types'

export default async function Home() {
  const { page } = await getHomePage()
  return <HomeClient page={page} />
}
```

Pages are server components by default. Components with hooks/GSAP become `'use client'` components.

**`generateStaticParams` for `[slug]`:**
```tsx
export async function generateStaticParams() {
  const { projects } = await getAllProjects()
  return projects.map(p => ({ slug: p.slug }))
}
```

---

### `'use client'` components

Every component that uses hooks, GSAP, or browser APIs needs the directive at the top:

| Component | Reason |
|---|---|
| `components/GsapTransitionWrapper.tsx` | SwitchTransition, Transition, useRef, GSAP |
| `components/Layout.tsx` | GSAP, IntersectionObserver, useState, useEffect |
| `components/Navbar.tsx` | useState (mobile menu), useEffect |
| `components/HeroSection.tsx` | GSAP animations |
| `components/HeroProject.tsx` | GSAP (if used) |
| `components/Projects.tsx` | likely useState |

Page files themselves (`app/*/page.tsx`) remain server components — they import and pass data to client components.

---

### `next/link` fix (12 files)

Old pattern (Next.js 12):
```jsx
<Link href="/contact"><a className="...">text</a></Link>
```

New pattern (Next.js 13+):
```tsx
<Link href="/contact" className="...">text</Link>
```

Files: `pages/projects/[slug].js`, `pages/contact/index.js`, `components/Navbar.js`, `components/Projects.js`, `components/CtaSection.js`, `components/Footer.js`, `components/HeroProject.js`, `components/HeroSection.js`, `components/Logo.js`, `components/OurStory.js`, `components/ProjectPreview.js`, `components/CoverImage.js`

---

### `next/head` → metadata API

Pages currently using `<Head>` get replaced with an exported `metadata` object:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Luigi Footprints Foundation',
  description: '...',
}
```

For dynamic pages (e.g., `[slug]`):
```tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { project } = await getProjectBySlug(slug)
  return { title: project?.title ?? 'Project' }
}
```

---

### File renames

| Old | New |
|---|---|
| `next.config.js` | `next.config.ts` |
| `app/layout.js` (new) | `app/layout.tsx` |
| `app/page.js` (new) | `app/page.tsx` |
| `app/*/page.js` (new) | `app/*/page.tsx` |
| `components/*.js` | `components/*.tsx` |
| `lib/pages.js` | `lib/pages.ts` |
| `lib/projects.js` | `lib/projects.ts` |
| `lib/catogories.js` | `lib/catogories.ts` |
| `lib/datetime.js` | `lib/datetime.ts` |

`postcss.config.js` stays `.js` (no TypeScript support for PostCSS config).

---

## Phase 2: Tailwind v4 migration

### Package changes

**Remove:** `tailwindcss` (v3), `autoprefixer` (v4 handles prefixing internally), `@tailwindcss/custom-forms`  
**Install:** `tailwindcss` (v4), `@tailwindcss/postcss`

### postcss.config.js (rewritten)

```js
module.exports = {
  plugins: { '@tailwindcss/postcss': {} }
}
```

### Delete: `tailwind.config.js`

Tailwind v4 uses CSS-first configuration. The entire `tailwind.config.js` (colors, fonts, plugins, variants) moves into `styles/globals.css`.

### styles/globals.css (rewritten)

```css
@import "tailwindcss";

/* ─── Theme tokens ─── */
@theme {
  /* Fonts */
  --font-itc: "ITC Berkeley Oldstyle Std", Georgia, serif;
  --font-sen: "'Sen', sans-serif";
  --font-sorts: "'Sen', sans-serif";
  --font-poppins: "poppins";
  --font-verl: "Verlag";
  --font-tenor: "Tenor Sans";

  /* lff color scale */
  --color-lff_100: #FFFBF2;
  --color-lff_200: #FFF8E4;
  --color-lff_300: #FFF4D7;
  --color-lff_400: #FFF0C9;
  --color-lff_500: #FFECBC;
  --color-lff_600: #CCBD96;
  --color-lff_700: #998E71;
  --color-lff_800: #665F4B;
  --color-lff_900: #332F26;
  --color-lff_success: #3BBA5D;
  --color-lff_danger: #E94F2C;

  /* lff named colors */
  --color-lffgreen: #145A32;
  --color-lffvegas: #C4B454;
  --color-lffbg: #FFECBC;
  --color-lffdark: #292D32;
  --color-lfffooter: #234A34;
  --color-lfflighter: #FFF7E1;
  --color-lfflight: #FFFAED;

  /* lffgreen scale */
  --color-lffgreen_400: #437B5B;
  --color-lffgreen_500: #145A32;
  --color-lffgreen_600: #104828;

  /* lffvegas scale */
  --color-lffvegas_100: #F3F0DD;
  --color-lffvegas_200: #E7E1BB;
  --color-lffvegas_300: #DCD298;
  --color-lffvegas_500: #C4B454;
  --color-lffvegas_600: #9D9043;
  --color-lffvegas_700: #766C32;
  --color-lffvegas_800: #4E4822;
  --color-lffvegas_900: #272411;

  /* text-only colors */
  --color-primary: #3F3F3F;
  --color-faded: #292D32;

  /* Custom breakpoint */
  --breakpoint-3xl: 1920px;

  /* Timer animation (SVG stroke animation) */
  --animate-timer: timer 8s linear forwards;
  @keyframes timer {
    to { stroke-dashoffset: 0; }
  }
}

/* ─── Custom container (responsive max-widths matching tailwind.config.js) ─── */
@utility container {
  margin-inline: auto;
  padding-inline: 1rem;

  @media (width >= 640px)  { max-width: 768px; }
  @media (width >= 768px)  { max-width: 1024px; }
  @media (width >= 1024px) { max-width: 1024px; }
  @media (width >= 1280px) { max-width: 1200px; }
  @media (width >= 1536px) { max-width: 1440px; }
  @media (width >= 1920px) { max-width: 1536px; }
}

/* ─── third-child variant ─── */
@variant third-child (&:nth-child(3));

/* ─── @font-face declarations (unchanged from current globals.css) ─── */
```

**Class names in JSX are unchanged.** Tailwind v4 generates the same utility classes (`text-lff_800`, `bg-lff_200`, `font-sen`, `text-primary`, etc.) from the CSS variable names. In v4, a single `--color-*` token generates `bg-*`, `text-*`, `border-*`, and `placeholder:*` utilities automatically — no separate `backgroundColor`/`textColor`/`borderColor`/`placeholderColor` blocks needed.

**Content scanning:** Tailwind v4 auto-detects `.ts` and `.tsx` files — no `content` array needed.

---

## Constraints

- All class names in JSX remain identical across both phases
- JSON data files (`data/*.json`) are untouched
- `lib/` functions keep the same signatures — only file extensions change
- `styles/globals.css` `@font-face` declarations and Google Fonts import are preserved exactly as-is
- `postcss.config.js` stays `.js` (PostCSS does not support `.ts` config)
