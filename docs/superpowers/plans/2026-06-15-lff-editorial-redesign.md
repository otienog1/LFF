# LFF Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Luigi Footprints Foundation website as a block-rendered, content-driven site in an "Editorial Mono" visual system (ivory/ink + conservation green, Fraunces + Inter), with every page generated from `data/data.json`.

**Architecture:** A typed data layer (`lib/content.ts`) reads `data/data.json`; thin route files render `<BlockRenderer>` which dispatches on `block.type` to six block components. Shared primitives + a re-skinned Layout shell (Lenis, Navbar, Footer) wrap everything. Homepage + foundation ship first as a review milestone, then the remaining four pages, then the existing Donate/Contact pages are re-skinned and obsolete WordPress code is retired.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript 5 · Tailwind v4 (CSS-first `@theme`) · GSAP + @gsap/react · Lenis · next/font · vitest (data-layer tests only) · yarn 4.

**Verification model:** This project has no test harness and no lint script. Per-task verification is:
- **Typecheck:** `npx tsc --noEmit` (must pass clean).
- **Build:** `yarn build` (at milestones — Tasks 17, 26).
- **Unit tests (data layer only):** `yarn test` via vitest (Tasks 3, 16-renderer).
- **Visual:** `yarn dev` → open the stated route, confirm the described result.

**Design spec:** `docs/superpowers/specs/2026-06-15-lff-editorial-redesign-design.md` — read it before starting.

---

## File Structure

**Created:**
```
lib/content.ts                     data accessors: getPage, getAllPages, getAllSlugs
types/content.ts                   Block/Page TypeScript types + type guards
components/blocks/BlockRenderer.tsx switch(block.type) → component
components/blocks/HeroBlock.tsx
components/blocks/ContentBlock.tsx
components/blocks/CardsBlock.tsx
components/blocks/ImpactBlock.tsx
components/blocks/TeamBlock.tsx
components/blocks/CtaBlock.tsx
components/ui/Section.tsx           layout container w/ light|inverse variant
components/ui/Eyebrow.tsx           uppercase green label
components/ui/SmartImage.tsx        next/image wrapper for remote WP images
components/motion/Reveal.tsx        GSAP scroll-reveal (reduced-motion aware)
components/motion/AnimatedNumber.tsx count-up (reduced-motion aware)
app/about/page.tsx
app/our-work/page.tsx
app/impact/page.tsx
app/get-involved/page.tsx
lib/content.test.ts                 vitest
vitest.config.ts
```

**Modified:**
```
styles/globals.css                 palette tokens, font vars, type-scale utilities
app/layout.tsx                     Fraunces+Inter via next/font, metadata base
app/page.tsx                       home → BlockRenderer
next.config.ts                     images.remotePatterns for WP host
components/layout/Navbar.tsx        re-skin: transparent→solid, Donate btn, sheet
components/layout/Footer.tsx        re-skin: contact form + nav + social
components/layout/Layout.tsx        keep Lenis; apply paper bg + shell
components/ui/button.tsx            green/ghost/link variants
app/donate/page.tsx + components/donate/*  re-skin only (keep payment logic)
app/contact/page.tsx + components/contact/* re-skin; demote from nav
package.json                       add vitest + test script
```

**Removed (Task 24):**
```
app/our-story/             lib/api.js          data/all-projects.json
app/projects/              lib/pages.ts        data/homepage.json
components/home/*           lib/projects.ts     data/our-story.json
components/projects/*       lib/catogories.ts   data/projects-page.json
components/team/* (old)     lib/datetime.ts (if unused after migration)
components/ProjectBody.tsx
```

---

## Phase 0 — Foundation

### Task 1: Design tokens + fonts

**Files:**
- Modify: `styles/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace the `@theme` token block and Google-font import in `styles/globals.css`**

Replace the existing `@import url("...Sen...")` line and the `@theme { ... }` block (lines ~1-36) with:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme {
  /* Fonts — CSS vars injected on <html> by next/font */
  --font-display: var(--font-fraunces);
  --font-body: var(--font-inter);

  /* Editorial Mono palette */
  --color-paper: #FAF8F4;
  --color-paper-deep: #F1ECE3;
  --color-ink: #141414;
  --color-ink-soft: #565049;
  --color-line: #E3DDD1;
  --color-green: #1E5631;
  --color-green-deep: #163F24;

  --breakpoint-3xl: 1920px;

  --animate-timer: timer 8s linear forwards;
  @keyframes timer { to { stroke-dashoffset: 0; } }
}
```

Keep the existing `@utility container`, `@variant third-child`, and `@font-face` blocks below it unchanged.

- [ ] **Step 2: Add base + type-scale utilities at the end of `styles/globals.css`**

```css
@layer base {
  html { -webkit-font-smoothing: antialiased; }
  body {
    background: var(--color-paper);
    color: var(--color-ink);
    font-family: var(--font-body), system-ui, sans-serif;
  }
  ::selection { background: var(--color-green); color: var(--color-paper); }
  :focus-visible { outline: 2px solid var(--color-green); outline-offset: 2px; }
}

@utility display-1 { font-family: var(--font-display), serif; font-weight: 500; line-height: 1.05; letter-spacing: -0.01em; font-size: clamp(2.5rem, 5vw, 4.5rem); }
@utility display-2 { font-family: var(--font-display), serif; font-weight: 500; line-height: 1.08; letter-spacing: -0.01em; font-size: clamp(1.875rem, 3.5vw, 2.875rem); }
@utility display-3 { font-family: var(--font-display), serif; font-weight: 500; line-height: 1.15; font-size: clamp(1.3125rem, 2vw, 1.75rem); }
@utility eyebrow { font-family: var(--font-body), sans-serif; font-weight: 600; font-size: 0.6875rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-green); }
@utility body-lg { font-size: clamp(1rem, 1.2vw, 1.125rem); line-height: 1.6; }
```

- [ ] **Step 3: Wire Fraunces + Inter via next/font in `app/layout.tsx`**

Replace the existing font imports (`cormorant`, `inter`) and their usage on `<html>` with:

```tsx
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
```

In the `<html>` tag, set `className={`${fraunces.variable} ${inter.variable}`}`. Keep the existing favicon/metadata wiring.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no errors). If `cormorant`/`inter` referenced elsewhere, fix imports.

- [ ] **Step 5: Commit**

```bash
git add styles/globals.css app/layout.tsx
git commit -m "feat: editorial mono design tokens + Fraunces/Inter fonts"
```

### Task 2: Remote image host config

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add `images.remotePatterns` for the WordPress host**

In `next.config.ts`, merge into the config object (preserve existing `output`/other keys):

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "api.theluigifootprints.org", pathname: "/wp-content/**" },
  ],
},
```

If `output: "export"` is currently set, also add `images: { unoptimized: true, remotePatterns: [...] }` — static export cannot use the Image Optimization API. Verify current `output` value first and keep whichever export mode is already in use.

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add next.config.ts
git commit -m "feat: allow remote WP images for next/image"
```

### Task 3: Content types + data layer (TDD)

**Files:**
- Create: `types/content.ts`
- Create: `lib/content.ts`
- Create: `lib/content.test.ts`
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Add vitest + test script**

```bash
yarn add -D vitest
```
In `package.json` `scripts`, add: `"test": "vitest run"`, `"test:watch": "vitest"`.

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { environment: "node", include: ["lib/**/*.test.ts"] } });
```

- [ ] **Step 2: Write content types in `types/content.ts`**

```ts
export interface ImageRef { url: string; alt: string; }
export interface CtaRef { label: string; link: string; }
export interface Seo { title: string; description: string; }

interface BlockBase { id: string; type: string; title?: string; subtitle?: string; content?: string; image?: ImageRef | null; cta?: CtaRef; }

export interface HeroBlock extends BlockBase { type: "hero"; }
export interface ContentBlock extends BlockBase { type: "content"; }
export interface CardItem { title: string; description: string; }
export interface CardsBlock extends BlockBase { type: "cards"; items: CardItem[]; }
export interface ImpactItem { title: string; description: string; }
export interface ImpactBlock extends BlockBase { type: "impact"; items: ImpactItem[]; }
export interface TeamMember { name: string; role: string; bio: string; image: ImageRef; }
export interface TeamBlock extends BlockBase { type: "team"; items: TeamMember[]; }
export interface CtaBlock extends BlockBase { type: "cta"; }

export type Block = HeroBlock | ContentBlock | CardsBlock | ImpactBlock | TeamBlock | CtaBlock;
export interface Page { slug: string; title: string; seo: Seo; blocks: Block[]; }
export interface SiteData { pages: Page[]; }
```

- [ ] **Step 3: Write the failing test in `lib/content.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { getAllSlugs, getPage, getAllPages } from "./content";

describe("content layer", () => {
  it("returns all five page slugs", () => {
    expect(getAllSlugs().sort()).toEqual(["/", "/about", "/get-involved", "/impact", "/our-work"]);
  });
  it("getPage returns the home page with a hero first block", () => {
    const home = getPage("/");
    expect(home?.title).toBe("Home");
    expect(home?.blocks[0].type).toBe("hero");
  });
  it("getPage returns undefined for an unknown slug", () => {
    expect(getPage("/nope")).toBeUndefined();
  });
  it("getAllPages returns 5 pages", () => {
    expect(getAllPages()).toHaveLength(5);
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `yarn test`
Expected: FAIL — `./content` has no such exports.

- [ ] **Step 5: Implement `lib/content.ts`**

```ts
import data from "@/data/data.json";
import type { SiteData, Page } from "@/types/content";

const site = data as SiteData;

export function getAllPages(): Page[] { return site.pages; }
export function getAllSlugs(): string[] { return site.pages.map((p) => p.slug); }
export function getPage(slug: string): Page | undefined {
  return site.pages.find((p) => p.slug === slug);
}
```

Confirm `tsconfig.json` has `"resolveJsonModule": true` and the `@/*` path alias (it does per current config). If JSON import errors, add `"resolveJsonModule": true` to `compilerOptions`.

- [ ] **Step 6: Run test to verify it passes**

Run: `yarn test`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add types/content.ts lib/content.ts lib/content.test.ts vitest.config.ts package.json yarn.lock
git commit -m "feat: typed content layer reading data.json (TDD)"
```

### Task 4: UI primitives — Section, Eyebrow, SmartImage, Button variants

**Files:**
- Create: `components/ui/Section.tsx`
- Create: `components/ui/Eyebrow.tsx`
- Create: `components/ui/SmartImage.tsx`
- Modify: `components/ui/button.tsx`

- [ ] **Step 1: `components/ui/Section.tsx`**

```tsx
import { cn } from "@/lib/utils";

export function Section({
  children, variant = "light", className, id,
}: { children: React.ReactNode; variant?: "light" | "deep" | "inverse"; className?: string; id?: string; }) {
  const bg = { light: "bg-paper text-ink", deep: "bg-paper-deep text-ink", inverse: "bg-ink text-paper" }[variant];
  return (
    <section id={id} className={cn(bg, "py-16 md:py-28 lg:py-32")}>
      <div className={cn("container", className)}>{children}</div>
    </section>
  );
}
```

- [ ] **Step 2: `components/ui/Eyebrow.tsx`**

```tsx
import { cn } from "@/lib/utils";
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string; }) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}
```

- [ ] **Step 3: `components/ui/SmartImage.tsx`**

```tsx
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/types/content";

export function SmartImage({ image, className, sizes, priority }: { image: ImageRef; className?: string; sizes?: string; priority?: boolean; }) {
  return (
    <Image src={image.url} alt={image.alt} fill sizes={sizes ?? "100vw"} priority={priority}
      className={cn("object-cover", className)} />
  );
}
```

- [ ] **Step 4: Restyle `components/ui/button.tsx` variants**

Update the `cva` variants map so `variant` supports the new system (keep the file's existing structure; replace the variant class strings):
```ts
// variants.variant:
default: "bg-green text-paper hover:bg-green-deep",
ghost: "border border-ink text-ink hover:bg-ink hover:text-paper",
link: "text-ink underline-offset-4 border-b border-ink rounded-none hover:text-green hover:border-green",
// keep size variants; default radius: rounded-none (editorial squared buttons)
```
Set base classes to include `inline-flex items-center justify-center text-[13px] tracking-[0.03em] px-7 py-3.5 transition-colors`.

- [ ] **Step 5: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add components/ui/Section.tsx components/ui/Eyebrow.tsx components/ui/SmartImage.tsx components/ui/button.tsx
git commit -m "feat: editorial UI primitives (Section, Eyebrow, SmartImage, Button)"
```

### Task 5: Motion primitives — Reveal, AnimatedNumber

**Files:**
- Create: `components/motion/Reveal.tsx`
- Create: `components/motion/AnimatedNumber.tsx`

- [ ] **Step 1: `components/motion/Reveal.tsx` (GSAP scroll-reveal, reduced-motion aware)**

```tsx
"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(ref.current, {
      opacity: 0, y: 16, duration: 0.7, delay, ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%" },
    });
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}
```

- [ ] **Step 2: `components/motion/AnimatedNumber.tsx` (count-up)**

```tsx
"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Renders the stat string (e.g. "2,553+"); counts up the numeric part. */
export function AnimatedNumber({ value, className }: { value: string; className?: string; }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/[\d,]+/);
  const target = match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
  const prefix = match ? value.slice(0, match.index) : "";
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : value;

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = value; return; }
    const obj = { n: 0 };
    gsap.to(obj, {
      n: target, duration: 1.6, ease: "power1.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
      onUpdate: () => { el.textContent = `${prefix}${Math.round(obj.n).toLocaleString()}${suffix}`; },
    });
  }, { scope: ref });

  return <span ref={ref} className={className}>{value}</span>;
}
```

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add components/motion/Reveal.tsx components/motion/AnimatedNumber.tsx
git commit -m "feat: GSAP Reveal + AnimatedNumber motion primitives"
```

---

## Phase 1 — Shell

### Task 6: Navbar re-skin

**Files:**
- Modify: `components/layout/Navbar.tsx`

- [ ] **Step 1: Implement the editorial Navbar**

Replace the component body. Requirements (use existing `ui/sheet` for mobile):
- Fixed top; transparent over hero, switches to `bg-paper/95 backdrop-blur border-b border-line` after `window.scrollY > 24` (track with a `useState` + scroll listener, `"use client"`).
- Links: `About /about`, `Our Work /our-work`, `Impact /impact`, `Get Involved /get-involved` (array-driven). Active link gets `text-ink`, others `text-ink-soft hover:text-ink`.
- Logo left (`Link href="/"`, Fraunces, "Luigi Footprints"). Use existing logo image asset if present in `public/`.
- Donate button right: `<Button asChild><Link href="/donate">Donate</Link></Button>` (green).
- Mobile (`<md`): hamburger opens `Sheet` with the same links stacked + Donate.

```tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our Work" },
  { href: "/impact", label: "Impact" },
  { href: "/get-involved", label: "Get Involved" },
];

export function Navbar() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-colors",
      solid ? "bg-paper/95 backdrop-blur border-b border-line" : "bg-transparent")}>
      <nav className="container flex items-center justify-between py-4">
        <Link href="/" className="font-display text-xl">Luigi Footprints</Link>
        <div className="hidden md:flex items-center gap-7 text-[13px]">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-ink-soft hover:text-ink transition-colors">{l.label}</Link>
          ))}
          <Button asChild><Link href="/donate">Donate</Link></Button>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger aria-label="Open menu"><Menu /></SheetTrigger>
            <SheetContent side="right" className="bg-paper">
              <div className="flex flex-col gap-6 mt-10 text-lg">
                {LINKS.map((l) => (<Link key={l.href} href={l.href}>{l.label}</Link>))}
                <Button asChild><Link href="/donate">Donate</Link></Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
```

Adjust `Sheet`/`SheetTrigger` import names to match the existing `components/ui/sheet.tsx` exports.

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add components/layout/Navbar.tsx
git commit -m "feat: editorial Navbar (transparent→solid, Donate, mobile sheet)"
```

### Task 7: Footer re-skin (contact home)

**Files:**
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Implement the editorial Footer**

```tsx
import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our Work" },
  { href: "/impact", label: "Impact" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/donate", label: "Donate" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container py-16 md:py-24 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-display text-2xl">Luigi Footprints</p>
          <p className="mt-4 text-paper/70 max-w-[34ch] text-sm leading-relaxed">
            Protecting wildlife by empowering communities across Kenya&rsquo;s Amboseli ecosystem and beyond.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" aria-label="Facebook"><Facebook className="size-5" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="size-5" /></a>
            <a href="#" aria-label="YouTube"><Youtube className="size-5" /></a>
          </div>
        </div>
        <nav className="md:col-span-3 flex flex-col gap-3 text-sm text-paper/80">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-paper transition-colors">{l.label}</Link>
          ))}
          <Link href="/contact" className="hover:text-paper transition-colors">Contact</Link>
        </nav>
        <div className="md:col-span-5">
          <p className="eyebrow text-paper/70!">Get in touch</p>
          <div className="mt-4"><ContactForm /></div>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="container py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-paper/55">
          <span>&copy; {new Date().getFullYear()} Luigi Footprints Foundation</span>
          <span>Protecting Wildlife. Empowering Communities. Inspiring Change.</span>
        </div>
      </div>
    </footer>
  );
}
```

`ContactForm` is imported and reused here (single source — see Task 23). If the existing `ContactForm` requires props, pass a `compact` variant prop; otherwise reuse as-is. If the current Footer exports social-icon components (`FacebookIcon` etc.), you may keep those instead of the `lucide-react` icons.

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add components/layout/Footer.tsx
git commit -m "feat: editorial Footer with contact form + social"
```

### Task 8: Layout shell

**Files:**
- Modify: `components/layout/Layout.tsx`

- [ ] **Step 1: Confirm Layout wraps children with Lenis + Navbar + Footer**

Keep the existing Lenis smooth-scroll setup (`LenisContext`, `useLenis`). Ensure structure is:
```tsx
<>
  <Navbar />
  <main className="min-h-screen">{children}</main>
  <Footer />
</>
```
Apply no top padding to `main` (hero sits under the transparent navbar by design). Interior page heroes must include their own top spacing so content clears the fixed navbar — handled in HeroBlock `interior` variant (Task 9).

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add components/layout/Layout.tsx
git commit -m "feat: re-skinned Layout shell (Lenis + Navbar + Footer)"
```

---

## Phase 2 — Block components

### Task 9: HeroBlock

**Files:**
- Create: `components/blocks/HeroBlock.tsx`

- [ ] **Step 1: Implement HeroBlock**

```tsx
import Link from "next/link";
import type { HeroBlock as HeroBlockType } from "@/types/content";
import { SmartImage } from "@/components/ui/SmartImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/button";

export function HeroBlock({ block, variant = "home" }: { block: HeroBlockType; variant?: "home" | "interior"; }) {
  const tall = variant === "home";
  return (
    <section className={`relative flex items-center ${tall ? "min-h-[88vh]" : "min-h-[60vh] pt-24"}`}>
      {block.image && (
        <div className="absolute inset-0 -z-10">
          <SmartImage image={block.image} priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/75 to-ink/15" />
        </div>
      )}
      <div className="container text-paper">
        <Eyebrow className="text-paper/80!">Luigi Footprints Foundation</Eyebrow>
        <h1 className="display-1 max-w-[16ch] mt-4">{block.title}</h1>
        {block.subtitle && <p className="body-lg mt-5 max-w-[44ch] text-paper/85">{block.subtitle}</p>}
        {block.content && <p className="mt-4 max-w-[52ch] text-paper/75">{block.content}</p>}
        {block.cta && (
          <Button asChild className="mt-7"><Link href={block.cta.link}>{block.cta.label}</Link></Button>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add components/blocks/HeroBlock.tsx
git commit -m "feat: HeroBlock"
```

### Task 10: ContentBlock (alternating editorial row)

**Files:**
- Create: `components/blocks/ContentBlock.tsx`

- [ ] **Step 1: Implement ContentBlock**

```tsx
import type { ContentBlock as ContentBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SmartImage } from "@/components/ui/SmartImage";
import { Reveal } from "@/components/motion/Reveal";

export function ContentBlock({ block, index = 0, variant = "light" }: { block: ContentBlockType; index?: number; variant?: "light" | "deep"; }) {
  const imageRight = index % 2 === 0;
  return (
    <Section variant={variant}>
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <Reveal className={imageRight ? "md:order-1" : "md:order-2"}>
          {block.title && <Eyebrow>{block.title}</Eyebrow>}
          {block.subtitle && <h2 className="display-2 mt-3 max-w-[20ch]">{block.subtitle}</h2>}
          {block.content && <p className="body-lg mt-5 text-ink-soft max-w-[58ch]">{block.content}</p>}
        </Reveal>
        {block.image && (
          <div className={`relative aspect-[4/3] ${imageRight ? "md:order-2" : "md:order-1"}`}>
            <SmartImage image={block.image} sizes="(max-width:768px) 100vw, 50vw" />
          </div>
        )}
      </div>
    </Section>
  );
}
```

Note: when `block.title` is short (eyebrow) and `block.subtitle` is the headline — matches `data.json` where `title`="Our Core Principle" (eyebrow) and `subtitle`= the headline.

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add components/blocks/ContentBlock.tsx
git commit -m "feat: ContentBlock alternating editorial row"
```

### Task 11: CardsBlock

**Files:**
- Create: `components/blocks/CardsBlock.tsx`

- [ ] **Step 1: Implement CardsBlock**

```tsx
import Link from "next/link";
import type { CardsBlock as CardsBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

export function CardsBlock({ block, variant = "light" }: { block: CardsBlockType; variant?: "light" | "deep"; }) {
  return (
    <Section variant={variant}>
      <div className="max-w-2xl">
        {block.title && <Eyebrow>{block.title}</Eyebrow>}
        {block.subtitle && <h2 className="display-2 mt-3">{block.subtitle}</h2>}
        {block.content && <p className="body-lg mt-4 text-ink-soft">{block.content}</p>}
      </div>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mt-12">
        {block.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08} className="border-t-2 border-green pt-5">
            <span className="text-[13px] text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="display-3 mt-2">{item.title}</h3>
            <p className="mt-3 text-ink-soft">{item.description}</p>
          </Reveal>
        ))}
      </div>
      {block.cta && (
        <div className="mt-10"><Button asChild variant="link"><Link href={block.cta.link}>{block.cta.label}</Link></Button></div>
      )}
    </Section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add components/blocks/CardsBlock.tsx
git commit -m "feat: CardsBlock"
```

### Task 12: ImpactBlock

**Files:**
- Create: `components/blocks/ImpactBlock.tsx`

- [ ] **Step 1: Implement ImpactBlock (inverse band + count-up)**

```tsx
import type { ImpactBlock as ImpactBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";

export function ImpactBlock({ block }: { block: ImpactBlockType }) {
  return (
    <Section variant="inverse">
      <div className="max-w-2xl">
        {block.title && <Eyebrow className="text-paper/70!">{block.title}</Eyebrow>}
        {block.subtitle && <h2 className="display-2 mt-3 text-paper">{block.subtitle}</h2>}
        {block.content && <p className="body-lg mt-4 text-paper/70">{block.content}</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-14">
        {block.items.map((item) => (
          <div key={item.title}>
            <AnimatedNumber value={item.title} className="block display-1 text-green" />
            <p className="mt-3 text-paper/70 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
```

Note: `display-1` green on the ink band fails contrast — Task 26 adds `--color-green-light: #6BB585` and switches the stat figures to `text-green-light`. Until Task 26 runs the stats may be low-contrast; this is resolved in the accessibility pass.

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add components/blocks/ImpactBlock.tsx
git commit -m "feat: ImpactBlock with count-up on inverse band"
```

### Task 13: TeamBlock

**Files:**
- Create: `components/blocks/TeamBlock.tsx`

- [ ] **Step 1: Implement TeamBlock (grid + expandable bio)**

```tsx
"use client";
import { useState } from "react";
import type { TeamBlock as TeamBlockType, TeamMember } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SmartImage } from "@/components/ui/SmartImage";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function TeamBlock({ block }: { block: TeamBlockType }) {
  const [active, setActive] = useState<TeamMember | null>(null);
  return (
    <Section variant="light">
      <div className="max-w-2xl">
        {block.title && <Eyebrow>{block.title}</Eyebrow>}
        {block.subtitle && <h2 className="display-2 mt-3">{block.subtitle}</h2>}
        {block.content && <p className="body-lg mt-4 text-ink-soft">{block.content}</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {block.items.map((m) => (
          <button key={m.name} onClick={() => setActive(m)} className="text-left group">
            <div className="relative aspect-[3/4] overflow-hidden">
              <SmartImage image={m.image} sizes="(max-width:768px) 100vw, 33vw"
                className="transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="display-3 mt-4">{m.name}</h3>
            <p className="eyebrow mt-1">{m.role}</p>
          </button>
        ))}
      </div>
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="right" className="bg-paper overflow-y-auto max-w-md">
          {active && (
            <div>
              <div className="relative aspect-[3/4] mb-6"><SmartImage image={active.image} sizes="400px" /></div>
              <h3 className="display-2">{active.name}</h3>
              <p className="eyebrow mt-1">{active.role}</p>
              <p className="mt-5 text-ink-soft leading-relaxed">{active.bio}</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Section>
  );
}
```

Match `Sheet` prop names (`open`/`onOpenChange`) to the existing `components/ui/sheet.tsx` API; adapt if it uses a different controlled pattern.

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add components/blocks/TeamBlock.tsx
git commit -m "feat: TeamBlock with expandable trustee bios"
```

### Task 14: CtaBlock

**Files:**
- Create: `components/blocks/CtaBlock.tsx`

- [ ] **Step 1: Implement CtaBlock**

```tsx
import Link from "next/link";
import type { CtaBlock as CtaBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/button";

export function CtaBlock({ block }: { block: CtaBlockType }) {
  return (
    <Section variant="inverse" className="text-center">
      <h2 className="display-2 max-w-[20ch] mx-auto text-paper">{block.title}</h2>
      {block.subtitle && <p className="eyebrow mt-4 text-paper/70!">{block.subtitle}</p>}
      {block.content && <p className="body-lg mt-5 max-w-[52ch] mx-auto text-paper/75">{block.content}</p>}
      {block.cta && (
        <Button asChild className="mt-8"><Link href={block.cta.link}>{block.cta.label}</Link></Button>
      )}
    </Section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add components/blocks/CtaBlock.tsx
git commit -m "feat: CtaBlock"
```

### Task 15: BlockRenderer

**Files:**
- Create: `components/blocks/BlockRenderer.tsx`

- [ ] **Step 1: Implement the dispatcher**

```tsx
import type { Block } from "@/types/content";
import { HeroBlock } from "./HeroBlock";
import { ContentBlock } from "./ContentBlock";
import { CardsBlock } from "./CardsBlock";
import { ImpactBlock } from "./ImpactBlock";
import { TeamBlock } from "./TeamBlock";
import { CtaBlock } from "./CtaBlock";

export function BlockRenderer({ blocks, heroVariant = "home" }: { blocks: Block[]; heroVariant?: "home" | "interior"; }) {
  let contentIndex = 0;
  return (
    <>
      {blocks.map((block) => {
        switch (block.type) {
          case "hero": return <HeroBlock key={block.id} block={block} variant={heroVariant} />;
          case "content": return <ContentBlock key={block.id} block={block} index={contentIndex++} />;
          case "cards": return <CardsBlock key={block.id} block={block} />;
          case "impact": return <ImpactBlock key={block.id} block={block} />;
          case "team": return <TeamBlock key={block.id} block={block} />;
          case "cta": return <CtaBlock key={block.id} block={block} />;
          default: return null;
        }
      })}
    </>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS
```bash
git add components/blocks/BlockRenderer.tsx
git commit -m "feat: BlockRenderer dispatcher"
```

---

## Phase 3 — Homepage milestone (REVIEW CHECKPOINT)

### Task 16: Home page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Render home from content**

```tsx
import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export function generateMetadata(): Metadata {
  const page = getPage("/");
  return { title: page?.seo.title, description: page?.seo.description };
}

export default function HomePage() {
  const page = getPage("/");
  if (!page) return null;
  return <BlockRenderer blocks={page.blocks} heroVariant="home" />;
}
```

Ensure the home route is wrapped by `Layout` (via `app/layout.tsx` or a route layout, matching the current setup). If `Layout` is currently applied per-page, wrap here.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → PASS

- [ ] **Step 3: Visual verification**

Run: `yarn dev`, open `http://localhost:3000/`.
Expected: hero with overlay headline → philosophy row → 3 focus-area cards → ink impact band with counting numbers → CTA band. Navbar transparent at top, solid after scroll. No console errors.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: homepage rendered from data.json blocks"
```

> **REVIEW CHECKPOINT:** Pause here for user review of the live homepage before building remaining pages (per home-first sequencing). Address feedback by adjusting block components, then continue.

---

## Phase 4 — Remaining pages

### Task 17: Build verification of foundation

- [ ] **Step 1: Full production build**

Run: `yarn build`
Expected: build succeeds; `/` compiles. Fix any RSC/"use client" boundary errors (block components using hooks must have `"use client"`; TeamBlock already does).

- [ ] **Step 2: Commit any fixes**

```bash
git add -A && git commit -m "fix: production build of homepage foundation"
```

### Task 18: About page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Implement**

```tsx
import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export function generateMetadata(): Metadata {
  const page = getPage("/about");
  return { title: page?.seo.title, description: page?.seo.description };
}

export default function AboutPage() {
  const page = getPage("/about");
  if (!page) return null;
  return <BlockRenderer blocks={page.blocks} heroVariant="interior" />;
}
```

- [ ] **Step 2: Typecheck + visual**

Run: `npx tsc --noEmit` → PASS. `yarn dev` → `/about`: hero (interior, clears navbar) → legacy content row → mission/vision/philosophy cards → trustee grid (click opens bio sheet) → CTA.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: About page"
```

### Task 19: Our Work page

**Files:**
- Create: `app/our-work/page.tsx`

- [ ] **Step 1: Implement**

```tsx
import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export function generateMetadata(): Metadata {
  const page = getPage("/our-work");
  return { title: page?.seo.title, description: page?.seo.description };
}

export default function OurWorkPage() {
  const page = getPage("/our-work");
  if (!page) return null;
  return <BlockRenderer blocks={page.blocks} heroVariant="interior" />;
}
```

- [ ] **Step 2: Typecheck + visual**

`/our-work`: hero → four content rows alternating image side (Education, Olchani, Community enterprise, Coexistence). Confirm alternation reads correctly.

- [ ] **Step 3: Commit**

```bash
git add app/our-work/page.tsx
git commit -m "feat: Our Work page"
```

### Task 20: Impact page

**Files:**
- Create: `app/impact/page.tsx`

- [ ] **Step 1: Implement**

```tsx
import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export function generateMetadata(): Metadata {
  const page = getPage("/impact");
  return { title: page?.seo.title, description: page?.seo.description };
}

export default function ImpactPage() {
  const page = getPage("/impact");
  if (!page) return null;
  return <BlockRenderer blocks={page.blocks} heroVariant="interior" />;
}
```

- [ ] **Step 2: Typecheck + visual**

`/impact`: hero → 4-stat impact band (count-up) → crisis-response content row → "meaning behind the metrics" cards.

- [ ] **Step 3: Commit**

```bash
git add app/impact/page.tsx
git commit -m "feat: Impact page"
```

### Task 21: Get Involved page

**Files:**
- Create: `app/get-involved/page.tsx`

- [ ] **Step 1: Implement**

```tsx
import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export function generateMetadata(): Metadata {
  const page = getPage("/get-involved");
  return { title: page?.seo.title, description: page?.seo.description };
}

export default function GetInvolvedPage() {
  const page = getPage("/get-involved");
  if (!page) return null;
  return <BlockRenderer blocks={page.blocks} heroVariant="interior" />;
}
```

- [ ] **Step 2: Typecheck + visual**

`/get-involved`: hero → ways-to-help cards → tourism-partnership content row → Donate CTA. Footer contact form present.

- [ ] **Step 3: Commit**

```bash
git add app/get-involved/page.tsx
git commit -m "feat: Get Involved page"
```

---

## Phase 5 — Restyle existing + cleanup

### Task 22: Re-skin Donate page (keep payment logic)

**Files:**
- Modify: `app/donate/page.tsx`, `components/donate/DonateClient.tsx`

- [ ] **Step 1: Apply the visual system without touching payment logic**

Do NOT change `handleMpesa`, `PayPalSection`, the Mastercard `Checkout.js` wiring, or `payutil.tk` calls. Only:
- Wrap page content in `Section`/container; apply paper bg, Fraunces headings, `Eyebrow`.
- Replace buttons/inputs with the restyled `Button` and existing re-skinned `ui/input`, `ui/select`.
- Match spacing/typography to the system.

- [ ] **Step 2: Typecheck + manual test**

Run: `npx tsc --noEmit` → PASS. `yarn dev` → `/donate`: confirm amount/currency/method selectors and PayPal/M-Pesa/card flows still render and submit (do not complete a live charge; verify the flows initialize without errors).

- [ ] **Step 3: Commit**

```bash
git add app/donate/page.tsx components/donate/
git commit -m "style: re-skin Donate page to editorial system (logic unchanged)"
```

### Task 23: Re-skin Contact, demote from nav

**Files:**
- Modify: `app/contact/page.tsx`, `components/contact/ContactForm.tsx`

- [ ] **Step 1: Re-skin the contact form + page**

Apply the system to `ContactForm` (inputs, labels, textarea, Button) keeping its existing submit handler. Re-skin `app/contact/page.tsx` to match. Confirm `ContactForm` is the same component reused in the Footer (Task 7) — single source.

- [ ] **Step 2: Typecheck + visual**

Run: `npx tsc --noEmit` → PASS. `/contact` renders styled; footer form matches.

- [ ] **Step 3: Commit**

```bash
git add app/contact/ components/contact/
git commit -m "style: re-skin Contact form/page"
```

### Task 24: Remove obsolete routes, components, and WordPress data layer

**Files:**
- Delete: `app/our-story/`, `app/projects/`, `components/home/`, `components/projects/`, old `components/team/`, `components/ProjectBody.tsx`, `lib/api.js`, `lib/pages.ts`, `lib/projects.ts`, `data/all-projects.json`, `data/homepage.json`, `data/our-story.json`, `data/projects-page.json`

- [ ] **Step 1: Grep for references before deleting**

Run: `git grep -nE "lib/api|lib/pages|lib/projects|components/home|components/projects|ProjectBody|all-projects.json|homepage.json|our-story.json|projects-page.json"`
Expected: only references are inside the files being deleted. If `lib/catogories.ts` / `lib/datetime.ts` are only used by deleted files, delete them too; if used elsewhere, keep.

- [ ] **Step 2: Delete**

```bash
git rm -r app/our-story app/projects components/home components/projects components/ProjectBody.tsx lib/api.js lib/pages.ts lib/projects.ts data/all-projects.json data/homepage.json data/our-story.json data/projects-page.json
# delete old team components only if replaced by TeamBlock and unreferenced:
git rm -r components/team 2>/dev/null || true
```

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit` → PASS. `yarn build` → succeeds with no broken imports.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: retire WordPress data layer and obsolete routes/components"
```

### Task 25: Optional render-ready block types (testimonial, logos)

**Files:**
- Create: `components/blocks/TestimonialBlock.tsx`, `components/blocks/LogosBlock.tsx`
- Modify: `types/content.ts`, `components/blocks/BlockRenderer.tsx`

- [ ] **Step 1: Add types**

In `types/content.ts` add:
```ts
export interface TestimonialItem { quote: string; name: string; role?: string; image?: ImageRef; }
export interface TestimonialBlock extends BlockBase { type: "testimonial"; items: TestimonialItem[]; }
export interface LogoItem { name: string; image: ImageRef; url?: string; }
export interface LogosBlock extends BlockBase { type: "logos"; items: LogoItem[]; }
```
Add both to the `Block` union.

- [ ] **Step 2: Implement the two components**

`components/blocks/TestimonialBlock.tsx`:
```tsx
import type { TestimonialBlock as TestimonialBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function TestimonialBlock({ block }: { block: TestimonialBlockType }) {
  return (
    <Section variant="deep">
      {block.title && <Eyebrow>{block.title}</Eyebrow>}
      <div className="grid md:grid-cols-2 gap-12 mt-8">
        {block.items.map((t) => (
          <figure key={t.name}>
            <blockquote className="display-3">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm text-ink-soft">
              <span className="text-ink">{t.name}</span>{t.role ? `, ${t.role}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
```

`components/blocks/LogosBlock.tsx`:
```tsx
import type { LogosBlock as LogosBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SmartImage } from "@/components/ui/SmartImage";

export function LogosBlock({ block }: { block: LogosBlockType }) {
  return (
    <Section variant="light" className="text-center">
      {block.title && <Eyebrow>{block.title}</Eyebrow>}
      <div className="flex flex-wrap items-center justify-center gap-12 mt-8">
        {block.items.map((logo) => (
          <div key={logo.name} className="relative h-12 w-32 grayscale opacity-70 hover:opacity-100 transition-opacity">
            <SmartImage image={logo.image} sizes="128px" className="object-contain" />
          </div>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Wire into BlockRenderer**

Add `case "testimonial"` and `case "logos"` returning the new components.

- [ ] **Step 4: Typecheck + commit**

Run: `npx tsc --noEmit` → PASS (no `data.json` blocks use these yet, so nothing renders — render-ready only).
```bash
git add types/content.ts components/blocks/TestimonialBlock.tsx components/blocks/LogosBlock.tsx components/blocks/BlockRenderer.tsx
git commit -m "feat: render-ready testimonial + partner-logo block types"
```

### Task 26: Accessibility + final pass

**Files:**
- Modify: `styles/globals.css` (if a lighter green stat token is needed), block components as needed

- [ ] **Step 1: Contrast audit**

Verify each green usage against its background for WCAG AA:
- `#1E5631` on `#FAF8F4` (buttons/links): confirm ≥ 4.5:1 (passes ~5.4:1).
- `#1E5631` on `#141414` (Impact stats on ink): this **fails** (~1.6:1). Add `--color-green-light: #6BB585;` to `@theme` and use `text-green-light` for `AnimatedNumber` / stat figures on inverse backgrounds (update `ImpactBlock` and any inverse green text).

- [ ] **Step 2: Semantics + keyboard**

Confirm: one `<h1>` per page (hero), heading order; `<main>` landmark; nav/footer landmarks; Sheet/menu and trustee buttons keyboard-operable with visible green focus ring; all images have alt (sourced from `data.json`).

- [ ] **Step 3: Reduced motion**

With OS "reduce motion" on, confirm Reveal/parallax/count-up are disabled (already coded) — numbers show final value immediately.

- [ ] **Step 4: Full build + final commit**

Run: `npx tsc --noEmit` → PASS. `yarn build` → PASS.
```bash
git add -A
git commit -m "fix: accessibility pass (contrast tokens, focus, reduced motion)"
```

---

## Done

All five content pages render from `data/data.json` via the block renderer; Donate/Contact re-skinned with logic intact; WordPress layer retired; testimonial/logos block types render-ready for future content. Site is typechecked, builds clean, and meets WCAG AA.
