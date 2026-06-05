# LFF Website Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full component rewrite of the Luigi Footprints Foundation website with a minimal, luxurious, editorial aesthetic using Cormorant Garamond + Inter, GSAP + Lenis smooth scroll, and shadcn/ui for interactive elements.

**Architecture:** Data layer (`lib/`, `types/`, JSON files, `app/*/page.tsx` data fetching) is entirely untouched. All root-level `components/*.tsx` files are replaced with a new sub-directory structure. Each page file is updated only to swap old component imports for new ones — data fetching calls remain identical.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind v4 (`@tailwindcss/postcss`), GSAP 3 + `@gsap/react`, Lenis v2, shadcn/ui (new-york style, neutral base)

---

## File Map

**Create:**
- `components/layout/Layout.tsx` — LenisContext, GSAP ScrollTrigger init, Navbar + Footer wrapper
- `components/layout/Navbar.tsx` — fixed header, scroll-aware transparency, mobile overlay
- `components/layout/Footer.tsx` — dark minimal footer, three columns
- `components/home/Hero.tsx` — full-screen GSAP image crossfade slider
- `components/home/Philosophy.tsx` — centered pull-quote, scroll reveal
- `components/home/StoryTeaser.tsx` — two-column editorial, parallax image
- `components/home/ProjectsGrid.tsx` — 3-card featured grid with stagger
- `components/home/LuigiSection.tsx` — full-bleed parallax quote
- `components/home/CtaStrip.tsx` — cream donate call-to-action
- `components/projects/ProjectCard.tsx` — card with GSAP hover reveal
- `components/projects/ProjectFilter.tsx` — gold pill filter buttons
- `components/team/TeamGrid.tsx` — photo grid
- `components/team/TeamSheet.tsx` — shadcn Sheet bio panel
- `components/donate/DonateClient.tsx` — existing logic, new shadcn UI
- `components/ui/` — shadcn auto-generated

**Modify:**
- `package.json` — add lenis, @gsap/react
- `styles/globals.css` — new design tokens, shadcn CSS variable overrides
- `app/layout.tsx` — next/font fonts, CSS variable injection
- `components/GsapTransitionWrapper.tsx` — update overlay color
- `app/page.tsx` — swap component imports
- `app/our-story/page.tsx` — swap component imports
- `app/projects/page.tsx` — swap component imports
- `app/projects/[slug]/page.tsx` — new editorial layout
- `app/contact/page.tsx` — new shadcn form layout
- `app/donate/page.tsx` — point to new DonateClient

**Delete (final task):**
- All root-level `components/*.tsx` except `GsapTransitionWrapper.tsx` and `components/ui/`

---

## Task 1: Install packages and initialise shadcn/ui

**Files:**
- Modify: `package.json`
- Create: `components/ui/` (via shadcn CLI)
- Create: `components/ui/button.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`, `sheet.tsx`, `label.tsx`
- Create: `lib/utils.ts` (via shadcn CLI)
- Modify: `styles/globals.css` (shadcn appends CSS variables)
- Create: `components.json`

- [ ] **Step 1: Add lenis and @gsap/react**

```bash
yarn add lenis @gsap/react
```

Expected output: `Done in Xs` with no peer-dependency errors. Verify:

```bash
yarn list lenis @gsap/react
```

Both packages appear in the tree.

- [ ] **Step 2: Initialise shadcn with Tailwind v4 defaults**

```bash
npx shadcn@latest init --defaults
```

When prompted (if interactive), select:
- Style: **New York**
- Base color: **Neutral**
- CSS variables: **Yes**

The CLI creates `components.json`, `lib/utils.ts`, and appends CSS variables to `styles/globals.css`.

- [ ] **Step 3: Add required shadcn components**

```bash
npx shadcn@latest add button input textarea select sheet label
```

This generates files in `components/ui/`. Do not edit these files — they are overridden by the theme variables in Task 2.

- [ ] **Step 4: Verify build still passes**

```bash
yarn build
```

Expected: build succeeds. If shadcn's CSS variable format conflicts with Tailwind v4, the error will be in `globals.css` — fix by removing the duplicate `@layer base` blocks that shadcn may have added, keeping only one `:root` block.

- [ ] **Step 5: Commit**

```bash
git add package.json yarn.lock components/ui/ lib/utils.ts components.json styles/globals.css
git commit -m "feat: add lenis, @gsap/react; initialise shadcn/ui"
```

---

## Task 2: Update design tokens in globals.css

**Files:**
- Modify: `styles/globals.css`

Replace the entire `@theme { ... }` block and the shadcn `:root` block. Keep the `@utility container`, `@variant third-child`, `@layer base` font-face declarations, and the `@layer components` section (we'll trim that in the final task).

- [ ] **Step 1: Replace the `@theme` block**

Find and replace everything between `@theme {` and its closing `}` with:

```css
@theme {
  /* Fonts — populated by next/font CSS variables injected on <html> */
  --font-display: var(--font-cormorant);
  --font-body: var(--font-inter);

  /* New palette */
  --color-base: #1a1510;
  --color-surface: #242018;
  --color-border: #3a3228;
  --color-cream: #f5ede0;
  --color-muted: #9a8e7e;
  --color-gold: #c8b87a;
  --color-gold-light: #d4c88a;
  --color-green: #1a4a28;

  /* Keep legacy lff_* tokens until old components are deleted in Task 19 */
  --color-lff_100: #FFFBF2;
  --color-lff_200: #FFF8E4;
  --color-lff_300: #FFF4D7;
  --color-lff_400: #FFF0C9;
  --color-lff_500: #FFECBC;
  --color-lff_600: #CCBD96;
  --color-lff_700: #998E71;
  --color-lff_800: #665F4B;
  --color-lff_900: #332F26;
  --color-lffgreen: #145A32;
  --color-lffvegas: #C4B454;

  /* Breakpoint */
  --breakpoint-3xl: 1920px;

  /* Timer animation (hero slider dot) */
  --animate-timer: timer 8s linear forwards;
  @keyframes timer {
    to { stroke-dashoffset: 0; }
  }
}
```

- [ ] **Step 2: Override shadcn CSS variables to match dark theme**

Find the `:root { ... }` block that shadcn's init wrote inside `@layer base` (or at top-level). Replace its entire contents with:

```css
@layer base {
  :root {
    /* shadcn component overrides — dark espresso theme */
    --background: 30 24% 8%;
    --foreground: 35 66% 92%;
    --card: 33 19% 12%;
    --card-foreground: 35 66% 92%;
    --popover: 33 19% 12%;
    --popover-foreground: 35 66% 92%;
    --primary: 42 42% 63%;
    --primary-foreground: 30 24% 8%;
    --secondary: 33 19% 12%;
    --secondary-foreground: 35 66% 92%;
    --muted: 33 19% 12%;
    --muted-foreground: 30 12% 55%;
    --accent: 42 42% 63%;
    --accent-foreground: 30 24% 8%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 35 66% 92%;
    --border: 28 18% 19%;
    --input: 28 18% 19%;
    --ring: 42 42% 63%;
    --radius: 0.25rem;
  }
}
```

Note: these are HSL channel values (no `hsl()` wrapper) — the format shadcn components expect. `bg-background` in shadcn components resolves to `hsl(var(--background))`.

- [ ] **Step 3: Add scrollbar styling for the dark theme at the top of `@layer components`**

Locate the `::-webkit-scrollbar-track` rule in `@layer components` and replace:

```css
::-webkit-scrollbar-track { background: #ffecbc; }
::-webkit-scrollbar-thumb { background: #998e71; border: 2px solid #ffecbc; }
::-webkit-scrollbar-thumb:hover { background: #665f4b; }
```

with:

```css
::-webkit-scrollbar-track { background: #1a1510; }
::-webkit-scrollbar-thumb { background: #3a3228; border: 2px solid #1a1510; }
::-webkit-scrollbar-thumb:hover { background: #c8b87a; }
```

- [ ] **Step 4: Verify build**

```bash
yarn build
```

Expected: no CSS errors. If shadcn adds a duplicate `:root` block and Tailwind complains about conflicting custom properties, remove the one shadcn added and keep only the one from Step 2.

- [ ] **Step 5: Commit**

```bash
git add styles/globals.css
git commit -m "feat: update design tokens — dark espresso palette, Cormorant/Inter fonts, shadcn overrides"
```

---

## Task 3: Update app/layout.tsx with next/font and font CSS variables

**Files:**
- Modify: `app/layout.tsx`
- Modify: `components/GsapTransitionWrapper.tsx`

- [ ] **Step 1: Rewrite app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import GsapTransitionWrapper from '@/components/GsapTransitionWrapper'
import '../styles/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Luigi Footprints Foundation',
    default: 'Luigi Footprints Foundation',
  },
  description: 'We are a Non-Governmental Organization involved in wildlife conservation and community development',
  icons: {
    apple: '/favicon/apple-touch-icon.png',
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    other: [{ rel: 'mask-icon', url: '/favicon/safari-pinned-tab.svg', color: '#000000' }],
  },
  manifest: '/favicon/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <meta name="msapplication-TileColor" content="#1a1510" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#1a1510" />
      </head>
      <body className="bg-base text-cream">
        <GsapTransitionWrapper>
          {children}
        </GsapTransitionWrapper>
        <Script src="/js/imagesloaded.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update GsapTransitionWrapper overlay color**

In `components/GsapTransitionWrapper.tsx`, change the overlay div class from `bg-lff_600` to `bg-base`:

```tsx
<div ref={overlay} className="z-50 bg-base fixed w-full bottom-0 h-0" />
```

- [ ] **Step 3: Verify build**

```bash
yarn build
```

Expected: build succeeds, fonts download at build time. The `--font-cormorant` and `--font-inter` CSS variables will now be available on `<html>` and referenced by `--font-display` and `--font-body` in the Tailwind theme.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx components/GsapTransitionWrapper.tsx
git commit -m "feat: load Cormorant Garamond + Inter via next/font, inject font CSS variables"
```

---

## Task 4: Create components/layout/Layout.tsx

This replaces the old `components/Layout.tsx`. Initialises Lenis smooth scroll, wires it to GSAP ScrollTrigger, and exports `LenisContext` for child components.

**Files:**
- Create: `components/layout/Layout.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import Navbar from './Navbar'
import Footer from './Footer'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lenisInstance = new Lenis({ autoRaf: false })
    setLenis(lenisInstance)

    const ticker = (time: number) => lenisInstance.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      lenisInstance.destroy()
    }
  }, [])

  useGSAP(() => {
    if (!mainRef.current) return
    gsap.from(mainRef.current, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all',
    })
  }, { scope: mainRef, dependencies: [] })

  return (
    <LenisContext.Provider value={lenis}>
      <Navbar />
      <main ref={mainRef}>
        {children}
      </main>
      <Footer />
    </LenisContext.Provider>
  )
}
```

- [ ] **Step 2: Create the layout sub-directory if needed**

The file path `components/layout/Layout.tsx` requires the `components/layout/` directory to exist. Creating the file above is sufficient if using an editor or the Write tool.

- [ ] **Step 3: Stub Navbar and Footer so the file compiles**

Navbar and Footer are created in Tasks 5 and 6. For now, create stubs:

`components/layout/Navbar.tsx`:
```tsx
export default function Navbar() { return <nav /> }
```

`components/layout/Footer.tsx`:
```tsx
export default function Footer() { return <footer /> }
```

- [ ] **Step 4: Verify TypeScript**

```bash
yarn tsc --noEmit
```

Expected: no errors in `components/layout/Layout.tsx`. If Lenis types are missing, run `yarn add -D @types/lenis` — but Lenis v2 ships its own types so this should not be needed.

- [ ] **Step 5: Commit**

```bash
git add components/layout/
git commit -m "feat: create Layout with Lenis smooth scroll + GSAP ScrollTrigger"
```

---

## Task 5: Create components/layout/Navbar.tsx

**Files:**
- Modify: `components/layout/Navbar.tsx` (replace the stub from Task 4)

- [ ] **Step 1: Write Navbar.tsx**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const links = [
  { href: '/our-story', label: 'Story' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuLinksRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useGSAP(() => {
    if (!menuRef.current || !menuLinksRef.current) return
    if (menuOpen) {
      gsap.set(menuRef.current, { display: 'flex' })
      gsap.to(menuRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.from(menuLinksRef.current.children, {
        opacity: 0, y: 24, stagger: 0.08, duration: 0.4, ease: 'power2.out',
      })
    } else {
      gsap.to(menuRef.current, {
        opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => gsap.set(menuRef.current, { display: 'none' }),
      })
    }
  }, { dependencies: [menuOpen] })

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between',
          'px-8 md:px-12 h-16 transition-all duration-300',
          scrolled
            ? 'bg-[rgba(26,21,16,0.92)] backdrop-blur-[12px]'
            : 'bg-transparent',
        ].join(' ')}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-display not-italic text-[11px] tracking-[0.25em] uppercase text-cream"
        >
          Luigi Footprints Foundation
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="group relative font-body text-[11px] uppercase tracking-[0.12em] text-cream/70 hover:text-cream transition-colors duration-200"
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 w-full h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left" />
            </Link>
          ))}
          <Link
            href="/donate"
            className="font-body text-[11px] uppercase tracking-[0.12em] text-gold border border-gold px-4 py-1.5 hover:bg-gold hover:text-base transition-all duration-200"
          >
            Donate →
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-cream transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-cream transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-cream transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 bg-base hidden opacity-0 flex-col items-center justify-center"
      >
        <ul ref={menuLinksRef} className="flex flex-col items-center gap-10">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className="font-display italic text-5xl text-cream hover:text-gold transition-colors duration-200"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/donate"
              onClick={() => setMenuOpen(false)}
              className="font-display italic text-5xl text-gold"
            >
              Donate →
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
yarn tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat: add Navbar — fixed, scroll-aware, mobile overlay"
```

---

## Task 6: Create components/layout/Footer.tsx

**Files:**
- Modify: `components/layout/Footer.tsx` (replace stub)

- [ ] **Step 1: Write Footer.tsx**

```tsx
import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
  { href: '/donate', label: 'Donate' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0f0d09] pt-16 pb-8">
      {/* Top gold rule */}
      <div className="flex justify-center mb-16">
        <div className="w-10 h-px bg-gold" />
      </div>

      <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Col 1: Identity */}
        <div>
          <p className="font-display not-italic text-[11px] uppercase tracking-[0.2em] text-cream mb-3">
            Luigi Footprints Foundation
          </p>
          <p className="font-body text-[12px] text-muted leading-relaxed">
            Conserving wildlife and empowering communities across East Africa.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.15em] text-gold mb-4">Navigation</p>
          <ul className="space-y-2">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-body text-[12px] text-muted hover:text-cream transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Contact */}
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.15em] text-gold mb-4">Contact</p>
          <a
            href="mailto:info@theluigifootprints.org"
            className="font-body text-[12px] text-muted hover:text-cream transition-colors duration-200 block mb-4"
          >
            info@theluigifootprints.org
          </a>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/maniagosafaris/" target="_blank" rel="noreferrer" className="font-body text-[11px] uppercase tracking-[0.1em] text-muted hover:text-gold transition-colors duration-200">Instagram</a>
            <a href="https://www.facebook.com/ManiagoSafarisEastAfrica" target="_blank" rel="noreferrer" className="font-body text-[11px] uppercase tracking-[0.1em] text-muted hover:text-gold transition-colors duration-200">Facebook</a>
            <a href="https://www.youtube.com/channel/UCVmNdFZ3SvfszacIMCfpPHg" target="_blank" rel="noreferrer" className="font-body text-[11px] uppercase tracking-[0.1em] text-muted hover:text-gold transition-colors duration-200">YouTube</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1280px] mx-auto px-8 border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="font-body text-[11px] text-muted">
          © {new Date().getFullYear()} Luigi Footprints Foundation
        </p>
        <p className="font-body text-[11px] text-muted">
          In partnership with <span className="text-gold">·</span> Maniago Safaris
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
yarn tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat: add Footer — dark minimal, three columns, gold accents"
```

---

## Task 7: Create components/home/Hero.tsx

**Files:**
- Create: `components/home/Hero.tsx`

The hero receives `slides` (object with `image1`, `image2`, `image3`) and `intro` (text). It cycles images via GSAP crossfade and plays an entrance animation on mount.

- [ ] **Step 1: Create Hero.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface SlideImages {
  image1: { sourceUrl: string }
  image2: { sourceUrl: string }
  image3: { sourceUrl: string }
}

interface HeroProps {
  slides: SlideImages
  intro: string
}

export default function Hero({ slides, intro }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null)
  const currentSlide = useRef(0)
  const images = [slides.image1.sourceUrl, slides.image2.sourceUrl, slides.image3.sourceUrl]

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.6, delay: 0.3 })
      .from('.hero-rule', { scaleX: 0, transformOrigin: 'left', duration: 0.5 }, '-=0.2')
      .from('.hero-headline', { opacity: 0, y: 40, duration: 0.9 }, '-=0.3')
      .from('.hero-body', { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
      .from('.hero-ctas', { opacity: 0, y: 16, duration: 0.5 }, '-=0.4')
      .from('.hero-scroll', { opacity: 0, duration: 0.5 }, '-=0.2')
  }, { scope: containerRef, dependencies: [] })

  useEffect(() => {
    const slideEls = containerRef.current?.querySelectorAll('.hero-slide')
    if (!slideEls || slideEls.length < 2) return

    const interval = setInterval(() => {
      const next = (currentSlide.current + 1) % images.length
      gsap.to(slideEls[currentSlide.current], { opacity: 0, duration: 1.2, ease: 'power2.inOut' })
      gsap.to(slideEls[next], { opacity: 1, duration: 1.2, ease: 'power2.inOut' })
      currentSlide.current = next
    }, 6000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section ref={containerRef} className="relative w-full h-svh overflow-hidden">
      {/* Background image stack */}
      {images.map((src, i) => (
        <div
          key={src}
          className={`hero-slide absolute inset-0 bg-cover bg-center ${i === 0 ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(26,21,16,0.55)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full max-w-[1280px] mx-auto px-8 pb-20 md:pb-28">
        <p className="hero-eyebrow font-body text-[10px] uppercase tracking-[0.22em] text-gold mb-4">
          Wildlife · Community · Kenya
        </p>
        <div className="hero-rule w-10 h-px bg-gold mb-6" />
        <h1 className="hero-headline font-display italic text-[clamp(56px,8vw,96px)] leading-[1.0] text-cream mb-6 max-w-2xl">
          Rewild the World
        </h1>
        <p
          className="hero-body font-body font-light text-[16px] text-cream/80 mb-10 max-w-md leading-relaxed"
          dangerouslySetInnerHTML={{ __html: intro }}
        />
        <div className="hero-ctas flex flex-wrap gap-4">
          <Link
            href="/donate"
            className="font-body text-[11px] uppercase tracking-[0.12em] bg-gold text-base px-6 py-3 hover:bg-gold-light transition-colors duration-200"
          >
            Donate →
          </Link>
          <Link
            href="/our-story"
            className="font-body text-[11px] uppercase tracking-[0.12em] border border-cream/60 text-cream px-6 py-3 hover:border-cream transition-colors duration-200"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-body text-[9px] uppercase tracking-[0.2em] text-cream/40">Scroll</span>
        <div className="w-px h-10 bg-cream/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 bg-gold animate-[iconscroll_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
yarn tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/home/Hero.tsx
git commit -m "feat: add Hero — full-screen GSAP slider with entrance animation"
```

---

## Task 8: Create components/home/Philosophy.tsx

**Files:**
- Create: `components/home/Philosophy.tsx`

- [ ] **Step 1: Create Philosophy.tsx**

```tsx
'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface PhilosophyProps {
  title: string
  content: string
}

export default function Philosophy({ title, content }: PhilosophyProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('.philosophy-content', {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    })
  }, { scope: sectionRef, dependencies: [] })

  return (
    <section
      ref={sectionRef}
      className="bg-cream py-[120px] px-8 flex justify-center"
    >
      <div className="philosophy-content max-w-[800px] text-center">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-8">{title}</p>
        <blockquote
          className="font-display italic text-[clamp(28px,4vw,52px)] text-base leading-[1.2]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/Philosophy.tsx
git commit -m "feat: add Philosophy section — cream pull-quote with scroll reveal"
```

---

## Task 9: Create components/home/StoryTeaser.tsx

**Files:**
- Create: `components/home/StoryTeaser.tsx`

- [ ] **Step 1: Create StoryTeaser.tsx**

```tsx
'use client'

import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface StoryTeaserProps {
  title: string
  intro: string
  content: string
  image: string
}

export default function StoryTeaser({ title, intro, content, image }: StoryTeaserProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Text reveal
    gsap.from('.teaser-text', {
      opacity: 0,
      x: -40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
    })
    // Parallax on image
    gsap.to(imageRef.current, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, { scope: sectionRef, dependencies: [] })

  return (
    <section
      ref={sectionRef}
      className="bg-base py-[120px] px-8"
    >
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div className="teaser-text">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-6">Our Story</p>
          <h2 className="font-display italic text-[clamp(32px,4vw,48px)] text-cream leading-[1.1] mb-6">
            {title}
          </h2>
          <p
            className="font-body font-light text-[16px] text-muted leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: intro }}
          />
          <p
            className="font-body font-light text-[16px] text-muted leading-relaxed mb-8"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <Link
            href="/our-story"
            className="font-body text-[11px] uppercase tracking-[0.15em] text-gold border-b border-gold pb-0.5 hover:text-gold-light hover:border-gold-light transition-colors duration-200"
          >
            Read more →
          </Link>
        </div>

        {/* Right: parallax image */}
        <div className="relative h-[500px] overflow-hidden">
          <div
            ref={imageRef}
            className="absolute inset-0 w-full h-[120%] bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/StoryTeaser.tsx
git commit -m "feat: add StoryTeaser — two-column editorial with parallax image"
```

---

## Task 10: Create components/home/ProjectsGrid.tsx

The home page passes `projects: Record<string, { image: { sourceUrl: string }; text: string }>` and a `title`. This component renders the first 3 entries.

**Files:**
- Create: `components/home/ProjectsGrid.tsx`

- [ ] **Step 1: Create ProjectsGrid.tsx**

```tsx
'use client'

import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface ProjectEntry {
  image: { sourceUrl: string }
  text: string
}

interface ProjectsGridProps {
  projects: Record<string, ProjectEntry>
  title: string
  text: string
}

export default function ProjectsGrid({ projects, title, text }: ProjectsGridProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const entries = Object.values(projects).slice(0, 3)

  useGSAP(() => {
    gsap.from('.home-project-card', {
      opacity: 0,
      y: 60,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
    })
  }, { scope: sectionRef, dependencies: [] })

  return (
    <section ref={sectionRef} className="bg-surface py-[120px] px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-4">Selected Work</p>
            <h2 className="font-display italic text-[clamp(32px,4vw,52px)] text-cream leading-[1.1]">
              {title}
            </h2>
          </div>
          <p className="font-body font-light text-[14px] text-muted max-w-xs" dangerouslySetInnerHTML={{ __html: text }} />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {entries.map((entry, i) => (
            <HomeProjectCard key={i} entry={entry} />
          ))}
        </div>

        {/* Link */}
        <div className="text-center">
          <Link
            href="/projects"
            className="font-body text-[11px] uppercase tracking-[0.15em] text-gold border-b border-gold pb-0.5 hover:text-gold-light hover:border-gold-light transition-colors duration-200"
          >
            View all projects →
          </Link>
        </div>
      </div>
    </section>
  )
}

function HomeProjectCard({ entry }: { entry: ProjectEntry }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    gsap.to(cardRef.current!.querySelector('.card-overlay'), { opacity: 1, duration: 0.3 })
    gsap.to(cardRef.current!.querySelector('.card-img'), { scale: 1.05, duration: 0.4 })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current!.querySelector('.card-overlay'), { opacity: 0, duration: 0.3 })
    gsap.to(cardRef.current!.querySelector('.card-img'), { scale: 1, duration: 0.4 })
  }

  return (
    <div
      ref={cardRef}
      className="home-project-card relative overflow-hidden aspect-[3/4] cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={entry.image.sourceUrl}
        alt=""
        className="card-img w-full h-full object-cover"
      />
      <div className="card-overlay absolute inset-0 bg-[rgba(26,21,16,0.6)] opacity-0 flex items-end p-6">
        <p className="font-display italic text-[22px] text-cream leading-tight">{entry.text}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/ProjectsGrid.tsx
git commit -m "feat: add ProjectsGrid — 3-column home grid with GSAP hover"
```

---

## Task 11: Create components/home/LuigiSection.tsx and CtaStrip.tsx

**Files:**
- Create: `components/home/LuigiSection.tsx`
- Create: `components/home/CtaStrip.tsx`

- [ ] **Step 1: Create LuigiSection.tsx**

```tsx
'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface LuigiSectionProps {
  images: { image1: { sourceUrl: string }; image2: { sourceUrl: string } }
  title: string
  text: string
  text1: string
  text2: string
}

export default function LuigiSection({ images, title, text, text1, text2 }: LuigiSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Parallax background
    gsap.to(bgRef.current, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    // Text reveal
    gsap.from('.luigi-content', {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
    })
  }, { scope: sectionRef, dependencies: [] })

  return (
    <section ref={sectionRef} className="relative h-[70vh] overflow-hidden flex items-center justify-center">
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-[130%] bg-cover bg-center"
        style={{ backgroundImage: `url(${images.image1.sourceUrl})` }}
      />
      <div className="absolute inset-0 bg-[rgba(26,21,16,0.60)]" />

      {/* Content */}
      <div className="luigi-content relative z-10 max-w-[800px] mx-auto px-8 text-center">
        <h2 className="font-display italic text-[clamp(28px,4vw,52px)] text-cream leading-[1.15] mb-6"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="font-body font-light text-[15px] text-cream/70 leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: text }}
        />
        <p className="font-body font-light text-[13px] text-gold uppercase tracking-[0.15em]"
          dangerouslySetInnerHTML={{ __html: text1 }}
        />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create CtaStrip.tsx**

```tsx
import Link from 'next/link'

interface CtaStripProps {
  title: string
  content: string
}

export default function CtaStrip({ title, content }: CtaStripProps) {
  return (
    <section className="bg-cream py-[120px] px-8 text-center">
      <div className="max-w-[640px] mx-auto">
        <h2 className="font-display italic text-[clamp(32px,4vw,52px)] text-base leading-[1.1] mb-6">
          {title}
        </h2>
        <p className="font-body font-light text-[16px] text-[#665f4b] leading-relaxed mb-10"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <Link
          href="/donate"
          className="inline-block font-body text-[11px] uppercase tracking-[0.15em] bg-gold text-base px-8 py-3 hover:bg-gold-light transition-colors duration-200"
        >
          Donate
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/home/LuigiSection.tsx components/home/CtaStrip.tsx
git commit -m "feat: add LuigiSection (parallax quote) and CtaStrip"
```

---

## Task 12: Update app/page.tsx

Replace all old component imports with the new home components and the new Layout.

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Rewrite app/page.tsx**

```tsx
import type { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import Hero from '@/components/home/Hero'
import Philosophy from '@/components/home/Philosophy'
import StoryTeaser from '@/components/home/StoryTeaser'
import ProjectsGrid from '@/components/home/ProjectsGrid'
import LuigiSection from '@/components/home/LuigiSection'
import CtaStrip from '@/components/home/CtaStrip'
import { getHomePage } from '@/lib/pages'

export const metadata: Metadata = { title: 'Home' }

export default async function Home() {
  const { page } = await getHomePage()

  return (
    <Layout>
      <Hero
        slides={page.heroSlider[0]}
        intro={page.heroText}
      />
      <Philosophy
        title={page.philosophyTitle}
        content={page.philosophyText}
      />
      <StoryTeaser
        title={page.ourStoryTitle}
        intro={page.ourStoryIntro}
        content={page.ourStoryText}
        image={page.ourStoryImage.sourceUrl}
      />
      <ProjectsGrid
        projects={page.projects}
        title={page.projectsTitle}
        text={page.projectText}
      />
      <LuigiSection
        images={page.luigiImages}
        title={page.luigiTitle}
        text={page.luigiText}
        text1={page.luigiText1}
        text2={page.luigiText2}
      />
      <CtaStrip
        title={page.ctaTitle}
        content={page.ctaText}
      />
    </Layout>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
yarn build
```

Expected: build succeeds. Home page renders with new components. Old components are still present but unused on this page.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: update home page to use new component hierarchy"
```

---

## Task 13: Create team components and update app/our-story/page.tsx

**Files:**
- Create: `components/team/TeamSheet.tsx`
- Create: `components/team/TeamGrid.tsx`
- Modify: `app/our-story/page.tsx`

- [ ] **Step 1: Create TeamSheet.tsx**

```tsx
'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface TrusteeData {
  name: string
  title: string
  image: { sourceUrl: string }
  text1: string
  text2: string
}

interface TeamSheetProps {
  member: TrusteeData | null
  onClose: () => void
}

export default function TeamSheet({ member, onClose }: TeamSheetProps) {
  return (
    <Sheet open={!!member} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="bg-surface border-border w-full max-w-lg overflow-y-auto"
      >
        {member && (
          <>
            <SheetHeader className="mb-8">
              <img
                src={member.image.sourceUrl}
                alt={member.name}
                className="w-full aspect-square object-cover mb-6"
              />
              <SheetTitle className="font-display italic text-[28px] text-cream text-left leading-tight">
                {member.name}
              </SheetTitle>
              <p className="font-body text-[12px] uppercase tracking-[0.12em] text-gold text-left">
                {member.title}
              </p>
            </SheetHeader>
            <div className="space-y-4">
              <p
                className="font-body font-light text-[15px] text-muted leading-relaxed"
                dangerouslySetInnerHTML={{ __html: member.text1 }}
              />
              <p
                className="font-body font-light text-[15px] text-muted leading-relaxed"
                dangerouslySetInnerHTML={{ __html: member.text2 }}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
```

- [ ] **Step 2: Create TeamGrid.tsx**

```tsx
'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import TeamSheet from './TeamSheet'

gsap.registerPlugin(ScrollTrigger)

interface TrusteeData {
  name: string
  title: string
  thumb: { sourceUrl: string }
  image: { sourceUrl: string }
  text1: string
  text2: string
}

interface TeamGridProps {
  title: [string, string]
  trustees: Record<string, TrusteeData>
}

export default function TeamGrid({ title, trustees }: TeamGridProps) {
  const [selected, setSelected] = useState<TrusteeData | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const members = Object.values(trustees)

  useGSAP(() => {
    gsap.from('.team-member', {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
    })
  }, { scope: sectionRef, dependencies: [] })

  return (
    <>
      <section ref={sectionRef} className="bg-base py-[120px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-16">
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-4">The Team</p>
            <h2 className="font-display italic text-[clamp(32px,4vw,52px)] text-cream leading-[1.1]">
              <em>{title[0]}</em>{' '}{title[1]}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {members.map(member => (
              <button
                key={member.name}
                onClick={() => setSelected(member)}
                className="team-member text-left group"
              >
                <div className="overflow-hidden aspect-square mb-4">
                  <img
                    src={member.thumb.sourceUrl}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                  />
                </div>
                <h4 className="font-display italic text-[18px] text-cream leading-tight mb-1">
                  {member.name}
                </h4>
                <p className="font-body text-[11px] uppercase tracking-[0.1em] text-gold">
                  {member.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>
      <TeamSheet member={selected} onClose={() => setSelected(null)} />
    </>
  )
}
```

- [ ] **Step 3: Update app/our-story/page.tsx**

```tsx
import type { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import TeamGrid from '@/components/team/TeamGrid'
import { getOurStory } from '@/lib/pages'

export const metadata: Metadata = { title: 'Our Story' }

export default async function OurStoryPage() {
  const { page } = await getOurStory()

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-svh overflow-hidden flex items-end">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${page.heroImage.sourceUrl})` }}
        />
        <div className="absolute inset-0 bg-[rgba(26,21,16,0.5)]" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-8 pb-20 w-full">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-4">
            Non-Governmental · Kenya
          </p>
          <div className="w-10 h-px bg-gold mb-6" />
          <h1 className="font-display italic text-[clamp(48px,7vw,80px)] text-cream leading-[1.0]">
            Our Story
          </h1>
        </div>
      </section>

      {/* Who We Are */}
      <section className="bg-base py-[120px] px-8">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <img src={page.whoWeAreImage.sourceUrl} alt="" className="w-full" />
          <div>
            <p
              className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-6"
              dangerouslySetInnerHTML={{ __html: page.whoWeAreTitle }}
            />
            <h2
              className="font-display italic text-[clamp(28px,3vw,40px)] text-cream leading-[1.15] mb-8"
              dangerouslySetInnerHTML={{ __html: page.whoWeAreText }}
            />
            <p
              className="font-body font-light text-[16px] text-muted leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page.whoWeAreText1 }}
            />
          </div>
        </div>
      </section>

      {/* Editorial text — hero content */}
      <section className="bg-surface py-[80px] px-8">
        <div className="max-w-[720px] mx-auto">
          <p
            className="font-body font-light text-[18px] text-muted leading-[1.8]"
            dangerouslySetInnerHTML={{ __html: page.heroContent }}
          />
        </div>
      </section>

      {/* Banner */}
      <div className="overflow-hidden">
        <img src={page.banner.sourceUrl} alt="" className="w-full" />
      </div>

      {/* Team */}
      <TeamGrid title={[page.title1, page.title2]} trustees={page.trustees} />
    </Layout>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
yarn build
```

Expected: no errors. Our Story page renders.

- [ ] **Step 5: Commit**

```bash
git add components/team/ app/our-story/page.tsx
git commit -m "feat: add TeamGrid + TeamSheet; update Our Story page"
```

---

## Task 14: Create project components and update app/projects/page.tsx

**Files:**
- Create: `components/projects/ProjectCard.tsx`
- Create: `components/projects/ProjectFilter.tsx`
- Modify: `app/projects/page.tsx`

- [ ] **Step 1: Create ProjectCard.tsx**

```tsx
'use client'

import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { projectPathBySlug } from '@/lib/projects'

interface ProjectCardProps {
  title: string
  slug: string
  image: { sourceUrl: string }
  tag?: string
  tall?: boolean
}

export default function ProjectCard({ title, slug, image, tag, tall }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    gsap.to(cardRef.current!.querySelector('.pc-overlay'), { opacity: 1, duration: 0.35 })
    gsap.to(cardRef.current!.querySelector('.pc-img'), { scale: 1.05, duration: 0.45 })
    gsap.from(cardRef.current!.querySelector('.pc-title'), { y: 16, opacity: 0, duration: 0.3 })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current!.querySelector('.pc-overlay'), { opacity: 0, duration: 0.3 })
    gsap.to(cardRef.current!.querySelector('.pc-img'), { scale: 1, duration: 0.4 })
  }

  return (
    <Link href={projectPathBySlug(slug)}>
      <div
        ref={cardRef}
        className={`relative overflow-hidden cursor-pointer ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={image.sourceUrl}
          alt={title}
          className="pc-img w-full h-full object-cover"
        />
        <div className="pc-overlay absolute inset-0 bg-[rgba(26,21,16,0.65)] opacity-0 flex flex-col justify-end p-6">
          {tag && (
            <span className="font-body text-[9px] uppercase tracking-[0.15em] text-gold border border-green px-2 py-0.5 w-fit mb-3 bg-green/20">
              {tag}
            </span>
          )}
          <h3 className="pc-title font-display italic text-[24px] text-cream leading-tight">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create ProjectFilter.tsx**

```tsx
'use client'

interface ProjectFilterProps {
  tags: string[]
  active: string
  onChange: (tag: string) => void
}

export default function ProjectFilter({ tags, active, onChange }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-12">
      {['All', ...tags].map(tag => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          className={[
            'font-body text-[10px] uppercase tracking-[0.15em] px-4 py-2 border transition-all duration-200',
            active === tag
              ? 'bg-gold text-base border-gold'
              : 'border-gold text-gold hover:bg-gold/10',
          ].join(' ')}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Update app/projects/page.tsx**

```tsx
import type { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import ProjectsClient from '@/components/projects/ProjectsClient'
import { getOurProjects } from '@/lib/pages'
import { getMoreProjects } from '@/lib/projects'

export const metadata: Metadata = { title: 'Our Projects' }

export default async function ProjectsPage() {
  const { page } = await getOurProjects()
  const moreProjects = await getMoreProjects(20)

  return (
    <Layout>
      {/* Minimal hero */}
      <section className="bg-base pt-40 pb-20 px-8">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-6">
            {page.pageTitle}
          </p>
          <h1 className="font-display italic text-[clamp(48px,6vw,72px)] text-cream leading-[1.0] max-w-xl">
            Conservation in Action
          </h1>
        </div>
      </section>

      <ProjectsClient
        featuredProjects={page.projects}
        moreProjects={moreProjects}
        sectionTitle={page.projectsSectionTitle}
        introText={page.projectsText}
      />
    </Layout>
  )
}
```

- [ ] **Step 4: Create components/projects/ProjectsClient.tsx** (client wrapper for filter state)

```tsx
'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import ProjectCard from './ProjectCard'
import ProjectFilter from './ProjectFilter'
import type { MoreProject } from '@/types'

gsap.registerPlugin(ScrollTrigger)

interface FeaturedProject {
  image: { sourceUrl: string }
  title: string
  slug: string
}

interface ProjectsClientProps {
  featuredProjects: FeaturedProject[]
  moreProjects: MoreProject[]
  sectionTitle: string
  introText: string
}

export default function ProjectsClient({
  featuredProjects,
  moreProjects,
  sectionTitle,
  introText,
}: ProjectsClientProps) {
  const [activeTag, setActiveTag] = useState('All')
  const gridRef = useRef<HTMLDivElement>(null)

  const allTags = ['Wildlife', 'Community', 'Youth']

  const visibleProjects = moreProjects.filter(p =>
    activeTag === 'All' || (p as any).typesOfProjects?.some((t: any) => t.name === activeTag)
  )

  useGSAP(() => {
    gsap.from('.projects-card', {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: gridRef.current, start: 'top 75%' },
    })
  }, { scope: gridRef, dependencies: [] })

  return (
    <section className="bg-base py-[80px] px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Featured */}
        <div className="mb-20">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-8">{sectionTitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((p, i) => (
              <div key={p.slug} className="projects-card">
                <ProjectCard title={p.title} slug={p.slug} image={p.image} tall={i % 2 === 1} />
              </div>
            ))}
          </div>
        </div>

        {/* All projects with filter */}
        <div className="border-t border-border pt-16">
          <ProjectFilter tags={allTags} active={activeTag} onChange={setActiveTag} />
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleProjects.map((p, i) => (
              <div key={p.slug} className="projects-card">
                <ProjectCard
                  title={p.title}
                  slug={p.slug}
                  image={p.image}
                  tall={i % 3 === 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Verify build**

```bash
yarn build
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/projects/ app/projects/page.tsx
git commit -m "feat: add ProjectCard, ProjectFilter, ProjectsClient; update projects page"
```

---

## Task 15: Update app/projects/[slug]/page.tsx

**Files:**
- Modify: `app/projects/[slug]/page.tsx`

Keep all data fetching unchanged. Rewrite the JSX to match the editorial detail layout.

- [ ] **Step 1: Rewrite the page JSX (data fetching lines are unchanged)**

Replace only the `return (...)` block in `app/projects/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import ProjectBody from '@/components/ProjectBody'
import { getProjectBySlug, getAllProjects, getRelatedProjects, projectPathBySlug } from '@/lib/projects'
import { categoryPathBySlug } from '@/lib/catogories'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { projects } = await getAllProjects()
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { project } = await getProjectBySlug(slug)
  return {
    title: project?.title ?? 'Project',
    openGraph: { images: [project?.featuredImage?.sourceUrl ?? ''] },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const { project } = await getProjectBySlug(slug)

  if (!project) return null

  const { typesOfProjects, databaseId: projectId } = project
  const category = typesOfProjects.length ? typesOfProjects[0] : null
  const categoryName = category?.name ?? null
  const categorySlug = category?.slug ?? null
  const relatedProjectsList = await getRelatedProjects(category ?? null, projectId)

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-svh overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${project.featuredImage?.sourceUrl})` }}
        />
        <div className="absolute inset-0 bg-[rgba(26,21,16,0.5)]" />
        <div className="absolute bottom-16 left-0 right-0 max-w-[1280px] mx-auto px-8 z-10">
          {categoryName && (
            <span className="font-body text-[9px] uppercase tracking-[0.15em] text-gold border border-green px-2 py-0.5 bg-green/20 inline-block mb-4">
              {categoryName}
            </span>
          )}
          <h1 className="font-display italic text-[clamp(40px,5vw,64px)] text-cream leading-[1.05] max-w-2xl mb-3">
            {project.title}
          </h1>
          <p className="font-body text-[12px] uppercase tracking-[0.12em] text-cream/50">
            {new Date(project.date).getFullYear()}
          </p>
        </div>
      </section>

      {/* Back link */}
      <div className="max-w-[720px] mx-auto px-8 pt-16">
        <Link
          href="/projects"
          className="font-body text-[11px] uppercase tracking-[0.15em] text-gold hover:text-gold-light transition-colors duration-200"
        >
          ← All Projects
        </Link>
      </div>

      {/* Content */}
      <article className="max-w-[720px] mx-auto px-8 py-12">
        <ProjectBody content={project.content} />
      </article>

      {/* Related projects */}
      {relatedProjectsList.length > 0 && (
        <section className="bg-surface py-16 px-8">
          <div className="max-w-[1280px] mx-auto">
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-6">
              {categoryName ? `More from ${categoryName}` : 'More Projects'}
            </p>
            <ul className="flex flex-wrap gap-4">
              {relatedProjectsList.map(p => (
                <li key={p.title}>
                  <Link
                    href={projectPathBySlug(p.slug)}
                    className="font-body text-[12px] uppercase tracking-[0.1em] text-muted hover:text-cream border border-border px-4 py-2 hover:border-gold transition-all duration-200 block"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </Layout>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
yarn build
```

Expected: project detail page generates for all slugs.

- [ ] **Step 3: Commit**

```bash
git add app/projects/[slug]/page.tsx
git commit -m "feat: update project detail page — editorial layout with full-bleed hero"
```

---

## Task 16: Update app/contact/page.tsx

Replace the existing minimal email-button page with a two-column shadcn form layout. On submit, opens a `mailto:` link with form data (no backend required for static export).

**Files:**
- Modify: `app/contact/page.tsx`

- [ ] **Step 1: Create the contact client component**

Create `components/contact/ContactForm.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = encodeURIComponent(`Name: ${form.name}\n\n${form.message}`)
    window.location.href = `mailto:info@theluigifootprints.org?subject=${encodeURIComponent(form.subject)}&body=${body}`
  }

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={set('name')}
            required
            className="bg-surface border-border text-cream placeholder:text-muted/40 focus-visible:ring-gold"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={set('email')}
            required
            className="bg-surface border-border text-cream placeholder:text-muted/40 focus-visible:ring-gold"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">Subject</Label>
        <Input
          id="subject"
          value={form.subject}
          onChange={set('subject')}
          required
          className="bg-surface border-border text-cream placeholder:text-muted/40 focus-visible:ring-gold"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">Message</Label>
        <Textarea
          id="message"
          value={form.message}
          onChange={set('message')}
          required
          rows={6}
          className="bg-surface border-border text-cream placeholder:text-muted/40 focus-visible:ring-gold resize-none"
        />
      </div>
      <Button
        type="submit"
        className="font-body text-[11px] uppercase tracking-[0.15em] bg-gold text-base hover:bg-gold-light border-0 rounded-none px-8 py-3 h-auto"
      >
        Send Message →
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Rewrite app/contact/page.tsx**

```tsx
import type { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import ContactForm from '@/components/contact/ContactForm'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <Layout>
      <section className="bg-base min-h-svh pt-40 pb-20 px-8">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* Left: info */}
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-6">Get in touch</p>
            <h1 className="font-display italic text-[clamp(40px,5vw,64px)] text-cream leading-[1.05] mb-12">
              We&apos;d love to<br />hear from you
            </h1>
            <div className="space-y-6">
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.15em] text-gold mb-2">Email</p>
                <a
                  href="mailto:info@theluigifootprints.org"
                  className="font-body font-light text-[15px] text-muted hover:text-cream transition-colors duration-200"
                >
                  info@theluigifootprints.org
                </a>
              </div>
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.15em] text-gold mb-3">Follow</p>
                <div className="flex gap-6">
                  <a href="https://www.instagram.com/maniagosafaris/" target="_blank" rel="noreferrer"
                    className="font-body text-[12px] text-muted hover:text-cream transition-colors duration-200">Instagram</a>
                  <a href="https://www.facebook.com/ManiagoSafarisEastAfrica" target="_blank" rel="noreferrer"
                    className="font-body text-[12px] text-muted hover:text-cream transition-colors duration-200">Facebook</a>
                  <a href="https://www.youtube.com/channel/UCVmNdFZ3SvfszacIMCfpPHg" target="_blank" rel="noreferrer"
                    className="font-body text-[12px] text-muted hover:text-cream transition-colors duration-200">YouTube</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </Layout>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
yarn build
```

- [ ] **Step 4: Commit**

```bash
git add components/contact/ app/contact/page.tsx
git commit -m "feat: update Contact page — two-column layout with shadcn form"
```

---

## Task 17: Create components/donate/DonateClient.tsx

Preserve all existing payment logic (PayPal, Mpesa, Mastercard Checkout) exactly. Replace only the UI layer with shadcn components and the new design system.

**Files:**
- Create: `components/donate/DonateClient.tsx`
- Modify: `app/donate/page.tsx`

- [ ] **Step 1: Read the existing donate-client.tsx to understand the full logic**

Read `app/donate/donate-client.tsx` to capture all state variables, handlers (`handleMpesa`, `handleCheckout`, `handleAmount`), and the PayPal configuration. The new component preserves them verbatim.

- [ ] **Step 2: Create components/donate/DonateClient.tsx**

```tsx
'use client'

import Layout from '@/components/layout/Layout'
import { useState, useEffect, useRef } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import gsap from 'gsap'
import { v4 } from 'uuid'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

declare const Checkout: {
  configure: (config: {
    session?: { id: string }
    merchant?: string
    order?: Record<string, unknown>
    transaction?: Record<string, unknown>
    interaction?: Record<string, unknown>
  }) => void
  showLightbox?: () => void
}

// ─── Amount presets ────────────────────────────────────────────────────────
const AMOUNTS_USD = { row1: ['10', '25', '50'], row2: ['100', '250', '500'] }
const AMOUNTS_KES = { row1: ['500', '1000', '2500'], row2: ['5000', '10000', '25000'] }

// ─── Progress bar ──────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full h-px bg-border mb-12">
      <div
        className="h-full bg-gold transition-all duration-500"
        style={{ width: `${(step / 2) * 100}%` }}
      />
    </div>
  )
}

// ─── Amount pill button ────────────────────────────────────────────────────
function AmountPill({
  value,
  selected,
  currency,
  onClick,
}: {
  value: string
  selected: boolean
  currency: string
  onClick: () => void
}) {
  const fmt = new Intl.NumberFormat('en', { style: 'currency', currency })
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'font-body text-[13px] px-4 py-2 border transition-all duration-200',
        selected ? 'bg-gold text-base border-gold' : 'border-border text-muted hover:border-gold hover:text-cream',
      ].join(' ')}
    >
      {fmt.format(parseFloat(value))}
    </button>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────
export default function DonateClient() {
  const [page, setPage] = useState(1)
  const [amount, setAmount] = useState('25')
  const [currency, setCurrency] = useState('USD')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sessionID, setSessionID] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const thankRef = useRef<HTMLDivElement>(null)

  const amounts = currency === 'KES' ? AMOUNTS_KES : AMOUNTS_USD

  useEffect(() => {
    if (sent && thankRef.current) {
      gsap.to(thankRef.current, { duration: 0.3, opacity: 1, ease: 'power3.inOut' })
      setTimeout(() => setSent(false), 5000)
    }
  }, [sent])

  useEffect(() => {
    fetch('https://payutil.tk/mastercard/authenticate', { method: 'POST' })
      .then(r => r.json())
      .then(data => setSessionID(data?.session?.id ?? ''))
      .catch(() => {})

    Checkout.configure({
      session: { id: sessionID },
      merchant: 'LUIGI',
      order: {
        amount,
        currency,
        description: 'Donation to The Luigi Footprints Foundation',
        id: v4(),
        reference: v4(),
      },
      transaction: { reference: v4() },
      interaction: {
        operation: 'PURCHASE',
        merchant: { name: 'Luigi Footprints Foundation:' },
      },
    })
  }, [amount, currency, sessionID])

  const handleMpesa = async () => {
    setLoading(true)
    await fetch('https://payutil.tk/mpesa/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone_number: phone,
        amount: Math.ceil(parseFloat(amount)),
        reference_code: 'Donation',
        description: 'A donation to The Luigi Footprints Foundation',
      }),
    }).then(r => r.json()).then(() => setLoading(false))
  }

  return (
    <Layout>
      <section className="bg-base min-h-svh pt-40 pb-20 px-8">
        <div className="max-w-[640px] mx-auto">
          {/* Header */}
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-4">Support our work</p>
          <h1 className="font-display italic text-[clamp(36px,4vw,56px)] text-cream leading-[1.05] mb-12">
            Make a Donation
          </h1>

          <ProgressBar step={page - 1} />

          {/* Step 1: Amount */}
          {page === 1 && (
            <div className="space-y-8">
              {/* Currency */}
              <div className="space-y-2">
                <Label className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="bg-surface border-border text-cream w-40 focus:ring-gold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border">
                    <SelectItem value="USD" className="text-cream focus:bg-gold/20">USD</SelectItem>
                    <SelectItem value="KES" className="text-cream focus:bg-gold/20">KES</SelectItem>
                    <SelectItem value="EUR" className="text-cream focus:bg-gold/20">EUR</SelectItem>
                    <SelectItem value="GBP" className="text-cream focus:bg-gold/20">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preset amounts */}
              <div className="space-y-2">
                <Label className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">Amount</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {amounts.row1.map(v => (
                    <AmountPill key={v} value={v} selected={amount === v} currency={currency} onClick={() => setAmount(v)} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {amounts.row2.map(v => (
                    <AmountPill key={v} value={v} selected={amount === v} currency={currency} onClick={() => setAmount(v)} />
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div className="space-y-2">
                <Label htmlFor="custom-amount" className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">
                  Custom amount
                </Label>
                <Input
                  id="custom-amount"
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  onChange={e => setAmount(e.target.value)}
                  className="bg-surface border-border text-cream placeholder:text-muted/40 focus-visible:ring-gold w-48"
                />
              </div>

              <Button
                onClick={() => setPage(2)}
                disabled={!amount || parseFloat(amount) <= 0}
                className="font-body text-[11px] uppercase tracking-[0.15em] bg-gold text-base hover:bg-gold-light border-0 rounded-none px-8 py-3 h-auto disabled:opacity-40"
              >
                Continue →
              </Button>
            </div>
          )}

          {/* Step 2: Payment */}
          {page === 2 && (
            <div className="space-y-8">
              {/* Payment method tabs */}
              <div className="flex gap-2">
                {[
                  { id: 'card', label: 'Card' },
                  { id: 'paypal', label: 'PayPal' },
                  { id: 'mpesa', label: 'M-Pesa' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={[
                      'font-body text-[11px] uppercase tracking-[0.12em] px-4 py-2 border transition-all duration-200',
                      paymentMethod === m.id ? 'bg-gold text-base border-gold' : 'border-border text-muted hover:border-gold',
                    ].join(' ')}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Card */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <p className="font-body font-light text-[14px] text-muted">
                    You will be charged{' '}
                    <span className="text-cream">
                      {new Intl.NumberFormat('en', { style: 'currency', currency }).format(parseFloat(amount))}
                    </span>
                    {' '}via secure Mastercard checkout.
                  </p>
                  <Button
                    onClick={() => Checkout.showLightbox?.()}
                    className="font-body text-[11px] uppercase tracking-[0.15em] bg-gold text-base hover:bg-gold-light border-0 rounded-none px-8 py-3 h-auto"
                  >
                    Pay with Card →
                  </Button>
                </div>
              )}

              {/* PayPal */}
              {paymentMethod === 'paypal' && (
                <div>
                  <PayPalScriptProvider
                    options={{
                      clientId: 'AfcPQsuVQb3JFz4o8t3g3JolRBipWWIpAjHM5-6dLqYbmtfwz34Ey-aOZyByb_mFkjkVGJCJMjJfGK4EqOCy5n5BkTOZ8X5F',
                      currency,
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: 'vertical', color: 'gold', shape: 'rect' }}
                      createOrder={(_data, actions) =>
                        actions.order.create({
                          intent: 'CAPTURE',
                          purchase_units: [{
                            amount: { currency_code: currency, value: amount },
                          }],
                        })
                      }
                      onApprove={(_data, actions) =>
                        actions.order!.capture().then(() => setSent(true))
                      }
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* M-Pesa */}
              {paymentMethod === 'mpesa' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">
                      Phone number (with country code)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254..."
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="bg-surface border-border text-cream placeholder:text-muted/40 focus-visible:ring-gold"
                    />
                  </div>
                  <Button
                    onClick={handleMpesa}
                    disabled={loading || !phone}
                    className="font-body text-[11px] uppercase tracking-[0.15em] bg-gold text-base hover:bg-gold-light border-0 rounded-none px-8 py-3 h-auto disabled:opacity-40"
                  >
                    {loading ? 'Processing…' : 'Pay via M-Pesa →'}
                  </Button>
                </div>
              )}

              {/* Back */}
              <button
                type="button"
                onClick={() => setPage(1)}
                className="font-body text-[11px] uppercase tracking-[0.12em] text-muted hover:text-cream transition-colors duration-200"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Thank you */}
          {sent && (
            <div ref={thankRef} className="opacity-0 mt-8 p-6 border border-gold bg-gold/10">
              <p className="font-display italic text-[24px] text-cream mb-2">Thank you.</p>
              <p className="font-body font-light text-[14px] text-muted">
                Your donation to the Luigi Footprints Foundation is deeply appreciated.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
```

- [ ] **Step 3: Update app/donate/page.tsx**

```tsx
import type { Metadata } from 'next'
import DonateClient from '@/components/donate/DonateClient'

export const metadata: Metadata = { title: 'Donate' }

export default function DonatePage() {
  return <DonateClient />
}
```

- [ ] **Step 4: Verify TypeScript**

```bash
yarn tsc --noEmit
```

- [ ] **Step 5: Verify build**

```bash
yarn build
```

- [ ] **Step 6: Commit**

```bash
git add components/donate/ app/donate/page.tsx
git commit -m "feat: add DonateClient — new design with shadcn, preserve payment logic"
```

---

## Task 18: Update ProjectBody for editorial styling and delete old components

**Files:**
- Modify: `components/ProjectBody.tsx` (update prose styles)
- Delete: all `components/*.tsx` root-level files that are now replaced

- [ ] **Step 1: Read and update ProjectBody.tsx**

Read `components/ProjectBody.tsx` to see its current markup. It wraps `content` in a div. Add the editorial typography classes:

```tsx
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ProjectBodyProps {
  content: string | null
}

export default function ProjectBody({ content }: ProjectBodyProps) {
  const bodyRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!bodyRef.current) return
    const paras = bodyRef.current.querySelectorAll('p, h2, h3, img')
    gsap.from(paras, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: bodyRef.current, start: 'top 80%' },
    })
  }, { scope: bodyRef, dependencies: [] })

  if (!content) return null

  return (
    <div
      ref={bodyRef}
      className="
        font-body font-light text-[17px] text-muted leading-[1.8]
        [&_h2]:font-display [&_h2]:italic [&_h2]:text-[32px] [&_h2]:text-cream [&_h2]:leading-tight [&_h2]:mt-12 [&_h2]:mb-4
        [&_h3]:font-display [&_h3]:italic [&_h3]:text-[24px] [&_h3]:text-cream [&_h3]:leading-tight [&_h3]:mt-8 [&_h3]:mb-3
        [&_p]:mb-6
        [&_img]:w-full [&_img]:my-10
        [&_a]:text-gold [&_a]:underline-offset-2 [&_a]:hover:text-gold-light
        [&_strong]:text-cream [&_strong]:font-normal
        [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-6 [&_blockquote]:font-display [&_blockquote]:italic [&_blockquote]:text-[24px] [&_blockquote]:text-cream [&_blockquote]:my-8
      "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
```

Note: `ProjectBody.tsx` remains in `components/` root (not deleted) because it's used by the project detail page directly.

- [ ] **Step 2: Delete old root-level components**

The following files are no longer imported anywhere and can be deleted:

```bash
rm components/Alert.tsx
rm components/Categories.tsx
rm components/Container.tsx
rm components/countries.tsx
rm components/Date.tsx
rm components/FirstHomes.tsx
rm components/Footer.tsx
rm components/Header.tsx
rm components/Intro.tsx
rm components/LFFLogo.tsx
rm components/MoreProjects.tsx
rm components/Navigation.tsx
rm components/Philosophy.tsx
rm components/ProjectHeader.tsx
rm components/ProjectPreview.tsx
rm components/ProjectTitle.tsx
rm components/SectionSeparator.tsx
rm components/Select.tsx
rm components/SocialIcons.tsx
rm components/ThankYou.tsx
rm components/CtaSection.tsx
rm components/Logo.tsx
rm components/HeroProject.tsx
rm components/OurStory.tsx
rm components/CoverImage.tsx
rm components/Projects.tsx
rm components/Tags.tsx
rm components/Luigi.tsx
rm components/HeroSection.tsx
rm components/Navbar.tsx
rm components/TheTeam.tsx
rm components/TeamMember.tsx
rm components/Layout.tsx
```

Keep: `components/GsapTransitionWrapper.tsx`, `components/ProjectBody.tsx`, `components/ui/`, `components/layout/`, `components/home/`, `components/projects/`, `components/team/`, `components/donate/`, `components/contact/`

- [ ] **Step 3: Remove legacy lff_* color tokens from globals.css**

In `styles/globals.css`, remove the "Keep legacy lff_* tokens" section from the `@theme` block (lines added in Task 2 Step 1):

```css
/* DELETE this block: */
  --color-lff_100: #FFFBF2;
  --color-lff_200: #FFF8E4;
  /* ... all lff_* tokens ... */
  --color-lffvegas: #C4B454;
```

- [ ] **Step 4: Final build verification**

```bash
yarn tsc --noEmit && yarn build
```

Expected output:
- TypeScript: 0 errors
- Build: `Export successful` with all routes generated
- Routes: `/`, `/our-story`, `/projects`, `/projects/[slug]`, `/contact`, `/donate`

If any import errors remain (referencing deleted components), fix them now before committing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: delete old components, update ProjectBody, remove legacy tokens — redesign complete"
```

---

## Summary

| Task | What it produces |
|---|---|
| 1 | lenis + @gsap/react installed; shadcn/ui initialised with 6 components |
| 2 | New dark espresso design tokens; shadcn CSS variable overrides |
| 3 | Cormorant Garamond + Inter loaded via next/font; dark body background |
| 4 | Layout with Lenis smooth scroll + GSAP ScrollTrigger context |
| 5 | Fixed Navbar: scroll-aware transparency + mobile overlay |
| 6 | Dark minimal Footer with three columns |
| 7 | Full-screen Hero with GSAP crossfade slider |
| 8 | Philosophy cream pull-quote with scroll reveal |
| 9 | StoryTeaser two-column editorial with parallax |
| 10 | ProjectsGrid 3-column home grid with GSAP hover |
| 11 | LuigiSection parallax quote + cream CtaStrip |
| 12 | Home page wired to all new components |
| 13 | TeamGrid + shadcn TeamSheet; Our Story page updated |
| 14 | ProjectCard + ProjectFilter + ProjectsClient; Projects page updated |
| 15 | Project detail page with editorial layout |
| 16 | Contact page with shadcn form, mailto submit |
| 17 | DonateClient with shadcn UI, all payment logic preserved |
| 18 | ProjectBody editorial styles; old components deleted; final build green |
