# Next.js 15 + React 19 + TypeScript + Tailwind v4 Upgrade

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the LFF site from Next.js 12 / React 17 / JS / Tailwind v3 to Next.js 15 / React 19 / TypeScript / Tailwind v4, migrating from Pages Router to App Router.

**Architecture:** Phase 1 upgrades packages, adds TypeScript, and rewrites the Pages Router (`pages/`) as an App Router (`app/`) while keeping Tailwind v3 in place so the site builds cleanly at the end of Phase 1. Phase 2 then replaces Tailwind v3 with v4, moving all theme config from `tailwind.config.js` into `styles/globals.css`. Each phase ends with a passing `yarn build`.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind CSS v4, GSAP 3, react-transition-group, @paypal/react-paypal-js, date-fns v3, yarn berry

---

## File Map

**Created:**
- `types/index.ts` — shared TypeScript interfaces
- `tsconfig.json` — TypeScript config
- `next.config.ts` — replaces `next.config.js`
- `components/GsapTransitionWrapper.tsx` — page-transition overlay (extracted from `pages/_app.js`)
- `app/layout.tsx` — root layout (metadata, GsapTransitionWrapper, globals.css import)
- `app/page.tsx` — home page server component
- `app/our-story/page.tsx` — our story page
- `app/projects/page.tsx` — projects listing page
- `app/projects/[slug]/page.tsx` — project detail page (generateStaticParams)
- `app/contact/page.tsx` — contact page
- `app/donate/page.tsx` — donate page server wrapper (metadata only)
- `app/donate/donate-client.tsx` — donate page full client component
- `components/FirstHomes.tsx` — extracted from `pages/projects/[slug].js`

**Renamed (.js → .tsx or .ts):**
- All 33 `components/*.js` → `components/*.tsx`
- `lib/pages.js` → `lib/pages.ts`
- `lib/projects.js` → `lib/projects.ts`
- `lib/catogories.js` → `lib/catogories.ts`
- `lib/datetime.js` → `lib/datetime.ts`

**Deleted:**
- `pages/` directory (entire)
- `next.config.js`
- `tailwind.config.js` (Phase 2)

**Modified:**
- `package.json` — upgrade/remove/add packages
- `styles/globals.css` — Phase 2: CSS-first Tailwind v4 config
- `postcss.config.js` — Phase 2: switch to @tailwindcss/postcss

---

## PHASE 1: Package upgrades + App Router + TypeScript

---

### Task 1: Update package.json for Phase 1

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Overwrite package.json**

Replace the entire file with:

```json
{
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@paypal/react-paypal-js": "^8",
    "classnames": "^2.3.1",
    "date-fns": "^3",
    "gsap": "^3",
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "react-transition-group": "^4",
    "sharp": "^0.33",
    "uuid": "^9"
  },
  "devDependencies": {
    "@tailwindcss/custom-forms": "^0.2.1",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/react-transition-group": "^4.4.4",
    "autoprefixer": "10.4.5",
    "postcss": "latest",
    "tailwindcss": "latest",
    "typescript": "^5"
  },
  "packageManager": "yarn@4.16.0"
}
```

Note: `@tailwindcss/custom-forms` stays for Phase 1 (Tailwind v3 still active). It is removed in Phase 2.

- [ ] **Step 2: Install dependencies**

```bash
yarn install
```

Expected: packages resolve without peer dependency errors. Next.js 15 + React 19 are compatible.

- [ ] **Step 3: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: upgrade packages to Next.js 15 / React 19 / TypeScript 5"
```

---

### Task 2: TypeScript configuration + shared types

**Files:**
- Create: `tsconfig.json`
- Create: `types/index.ts`

- [ ] **Step 1: Create tsconfig.json**

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

- [ ] **Step 2: Create types/index.ts**

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

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json types/index.ts
git commit -m "chore: add tsconfig and shared TypeScript types"
```

---

### Task 3: Rewrite next.config.ts

**Files:**
- Delete: `next.config.js`
- Create: `next.config.ts`

- [ ] **Step 1: Delete next.config.js**

```bash
rm next.config.js
```

- [ ] **Step 2: Create next.config.ts**

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

`unoptimized: true` is required — static export has no server for Next.js image optimization.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "chore: rewrite next.config as TypeScript, remove next-transpile-modules"
```

---

### Task 4: GsapTransitionWrapper.tsx + app/layout.tsx

**Files:**
- Create: `components/GsapTransitionWrapper.tsx`
- Create: `app/layout.tsx`

- [ ] **Step 1: Create components/GsapTransitionWrapper.tsx**

This extracts the GSAP page-transition logic from `pages/_app.js`. Uses `usePathname()` (App Router equivalent of `router.pathname`) as the `SwitchTransition` key.

```tsx
'use client'

import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { SwitchTransition, Transition } from 'react-transition-group'
import gsap from 'gsap'

interface Props {
  children: React.ReactNode
}

export default function GsapTransitionWrapper({ children }: Props) {
  const overlay = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const resetOverlay = () => {
    gsap.set(overlay.current, { yPercent: 'unset', height: '0%' })
  }

  function enter() {
    window.scrollTo(0, 0)
    gsap.timeline({ defaults: { duration: 1 }, onComplete: () => resetOverlay() })
      .set(overlay.current, { height: '100%' })
      .to(overlay.current, { yPercent: -100, ease: 'power3.inOut' }, 1)
  }

  function exit() {
    gsap.timeline({ defaults: { duration: 1 } })
      .to(overlay.current, { height: '100%', ease: 'power3.inOut' }, 1)
  }

  return (
    <SwitchTransition>
      <Transition
        key={pathname}
        timeout={2200}
        in={true}
        onEnter={enter}
        onExit={exit}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <>
          {children}
          <div ref={overlay} className="z-50 bg-lff_600 fixed w-full bottom-0 h-0" />
        </>
      </Transition>
    </SwitchTransition>
  )
}
```

- [ ] **Step 2: Create app/layout.tsx**

This replaces `pages/_app.js`. The `Meta` component (`components/Meta.js`) used `next/head` — its favicon/meta content moves here via the metadata API. The Google Fonts `<link>` stays in `globals.css`.

```tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import GsapTransitionWrapper from '@/components/GsapTransitionWrapper'
import '../styles/globals.css'

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
    <html lang="en">
      <head>
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#000" />
      </head>
      <body>
        <GsapTransitionWrapper>
          {children}
        </GsapTransitionWrapper>
        <Script src="/js/imagesloaded.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/GsapTransitionWrapper.tsx app/layout.tsx
git commit -m "feat: add GsapTransitionWrapper and App Router root layout"
```

---

### Task 5: Convert lib/ files to TypeScript

**Files:**
- Delete: `lib/datetime.js`, `lib/catogories.js`, `lib/pages.js`, `lib/projects.js`
- Create: `lib/datetime.ts`, `lib/catogories.ts`, `lib/pages.ts`, `lib/projects.ts`

- [ ] **Step 1: Create lib/datetime.ts (delete datetime.js)**

```ts
import { format } from 'date-fns'

export function formatDate(date: string, pattern = 'PPP'): string {
  return format(new Date(date), pattern)
}

export function sortObjectsByDateDesc<T extends Record<string, string>>(
  array: T[],
  { key = 'date' }: { key?: string } = {}
): T[] {
  return array.sort((a, b) => new Date(a[key]).getTime() - new Date(b[key]).getTime())
}

export function sortObjectsByDateAsc<T extends Record<string, string>>(
  array: T[],
  { key = 'date' }: { key?: string } = {}
): T[] {
  return array.sort((a, b) => new Date(b[key]).getTime() - new Date(a[key]).getTime())
}
```

```bash
rm lib/datetime.js
```

- [ ] **Step 2: Create lib/catogories.ts (delete catogories.js)**

Note: filename preserves the original intentional typo.

```ts
export function categoryPathBySlug(slug: string): string {
  return `/categories/${slug}`
}

export function mapCategoryData(category: Record<string, unknown> = {}): Record<string, unknown> {
  return { ...category }
}
```

```bash
rm lib/catogories.js
```

- [ ] **Step 3: Create lib/pages.ts (delete pages.js)**

```ts
import type { Homepage, OurStory, ProjectsPage } from '@/types'
import homepageData from '../data/homepage.json'
import ourStoryData from '../data/our-story.json'
import projectsPageData from '../data/projects-page.json'

export const getHomePage = async (): Promise<{ page: Homepage }> => ({
  page: homepageData as Homepage,
})

export const getOurStory = async (): Promise<{ page: OurStory }> => ({
  page: ourStoryData as OurStory,
})

export const getOurProjects = async (): Promise<{ page: ProjectsPage }> => ({
  page: projectsPageData as ProjectsPage,
})
```

```bash
rm lib/pages.js
```

- [ ] **Step 4: Create lib/projects.ts (delete projects.js)**

```ts
import type { Project, RelatedProject, MoreProject, TypeOfProject } from '@/types'
import projectsData from '../data/all-projects.json'
import { sortObjectsByDateAsc } from './datetime'

const projects = projectsData as Project[]

export function projectPathBySlug(slug: string): string {
  return `/projects/${slug}`
}

export const getProjectBySlug = async (slug: string): Promise<{ project: Project | undefined }> => ({
  project: projects.find(p => p.slug === slug),
})

export async function getAllProjects(): Promise<{ projects: Project[] }> {
  return { projects }
}

export async function getRelatedProjects(
  category: TypeOfProject | null,
  projectId: number,
  count = 3
): Promise<RelatedProject[]> {
  if (!category) return []
  const filtered = projects
    .filter(p => p.typesOfProjects.some(t => t.databaseId === category.databaseId))
    .filter(p => p.databaseId !== projectId)
  const sorted = sortObjectsByDateAsc(filtered as unknown as Record<string, string>[]) as unknown as Project[]
  return sorted.slice(0, count).map(p => ({ title: p.title, slug: p.slug }))
}

export async function getMoreProjects(count: number): Promise<MoreProject[]> {
  const sorted = sortObjectsByDateAsc(projects as unknown as Record<string, string>[]) as unknown as Project[]
  return sorted.slice(0, count).map(p => ({
    title: p.title,
    slug: p.slug,
    image: p.featuredImage,
  }))
}
```

```bash
rm lib/projects.js
```

- [ ] **Step 5: Commit**

```bash
git add lib/datetime.ts lib/catogories.ts lib/pages.ts lib/projects.ts
git commit -m "chore: convert lib/ files to TypeScript"
```

---

### Task 6: Create app/page.tsx (home)

**Files:**
- Create: `app/page.tsx`

- [ ] **Step 1: Create app/page.tsx**

Replaces `pages/index.js`. Server component — data fetching replaces `getStaticProps`. The `<Head>` block is removed; page title comes from the metadata template in `app/layout.tsx`.

```tsx
import type { Metadata } from 'next'
import Layout from '@/components/Layout'
import HeroSection from '@/components/HeroSection'
import Philosophy from '@/components/Philosophy'
import OurStory from '@/components/OurStory'
import CtaSection from '@/components/CtaSection'
import Projects from '@/components/Projects'
import Luigi from '@/components/Luigi'
import { getHomePage } from '@/lib/pages'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Home() {
  const { page } = await getHomePage()

  return (
    <Layout>
      <HeroSection
        intro={page.heroText}
        slides={page.heroSlider[0]}
        text={page.sliderText[0]}
      />
      <Philosophy
        image={page.philosophyImage.sourceUrl}
        title={page.philosophyTitle}
        content={page.philosophyText}
      />
      <OurStory
        title={page.ourStoryTitle}
        intro={page.ourStoryIntro}
        content={page.ourStoryText}
        image={page.ourStoryImage.sourceUrl}
      />
      <Projects
        projects={page.projects}
        text={page.projectText}
        title={page.projectsTitle}
      />
      <Luigi
        images={page.luigiImages}
        title={page.luigiTitle}
        text={page.luigiText}
        text1={page.luigiText1}
        text2={page.luigiText2}
      />
      <CtaSection
        image={page.ctaImage.sourceUrl}
        title={page.ctaTitle}
        content={page.ctaText}
      />
    </Layout>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add home page (App Router)"
```

---

### Task 7: Create app/our-story/page.tsx

**Files:**
- Create: `app/our-story/page.tsx`

- [ ] **Step 1: Create app/our-story/page.tsx**

Replaces `pages/our-story/index.js`. Direct port with server-component data fetching.

```tsx
import type { Metadata } from 'next'
import Layout from '@/components/Layout'
import Container from '@/components/Container'
import TheTeam from '@/components/TheTeam'
import Logo from '@/components/Logo'
import { getOurStory } from '@/lib/pages'

export const metadata: Metadata = {
  title: 'Our Story',
}

export default async function OurStoryPage() {
  const { page } = await getOurStory()

  return (
    <Layout>
      <section className="bg-lff_600">
        <Logo />
        <div className="h-screen">
          <div className="flex h-1/2 justify-center items-end pb-40 md:pb-0 md:mb-40">
            <Container>
              <h1 className="text-5xl md:text-7xl text-lff_400 text-center tracking-widest font-bold">Our Story</h1>
            </Container>
          </div>
          <div className="flex md:justify-end md:min-h-screen">
            <Container>
              <div className="flex h-1/2 md:h-2/3 md:items-center">
                <div className="h-full md:flex md:items-center w-full -translate-y-1/5 relative">
                  <img src={page.heroImage.sourceUrl} className="w-full md:hidden" alt="" />
                  <p
                    className="md:hidden text-xl md:text-3xl text-lff_100 leading-loose md:w-2/3 mt-16 tracking-wider z-20 px-4 md:px-0"
                    dangerouslySetInnerHTML={{ __html: page.heroContent }}
                  />
                  <p
                    data-scroll-speed="50"
                    className="hidden md:block text-xl md:text-3xl text-lff_100 leading-loose md:w-2/3 mt-16 tracking-wider z-20 px-4 md:px-0"
                    dangerouslySetInnerHTML={{ __html: page.heroContent }}
                  />
                  <img src={page.heroImage.sourceUrl} className="w-2/5 hidden md:block absolute right-0 z-10" alt="" />
                </div>
              </div>
            </Container>
          </div>
        </div>
        <div className="flex md:py-40 mt-80">
          <Container>
            <div className="flex w-full items-center flex-wrap">
              <div className="w-full md:w-6/12">
                <img src={page.whoWeAreImage.sourceUrl} className="w-full" alt="" />
              </div>
              <div className="w-full md:w-6/12 pt-16 md:pt-0 px-4 md:px-0 md:pl-16">
                <h5
                  dangerouslySetInnerHTML={{ __html: page.whoWeAreTitle }}
                  className="text-lff_100 text-base uppercase font-bold tracking-widest"
                />
                <h3
                  dangerouslySetInnerHTML={{ __html: page.whoWeAreText }}
                  className="text-lff_100 text-3xl my-10 leading-tight font-extrabold"
                />
                <h3
                  dangerouslySetInnerHTML={{ __html: page.whoWeAreText1 }}
                  className="text-lff_100 text-lg leading-relaxed"
                />
              </div>
            </div>
          </Container>
        </div>
        <div className="pt-28 md:mt-40 overflow-hidden">
          <img data-scroll-speed="120" src={page.banner.sourceUrl} className="hidden md:block w-full" alt="" />
          <img src={page.banner.sourceUrl} className="w-full md:hidden" alt="" />
        </div>
      </section>
      <TheTeam title={[page.title1, page.title2]} trustees={page.trustees} />
    </Layout>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/our-story/page.tsx
git commit -m "feat: add our-story page (App Router)"
```

---

### Task 8: Create app/projects/page.tsx

**Files:**
- Create: `app/projects/page.tsx`

- [ ] **Step 1: Create app/projects/page.tsx**

Replaces `pages/projects/index.js`.

```tsx
import type { Metadata } from 'next'
import Layout from '@/components/Layout'
import MoreProjects from '@/components/MoreProjects'
import HeroProject from '@/components/HeroProject'
import Intro from '@/components/Intro'
import { getOurProjects } from '@/lib/pages'
import { getMoreProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Our Projects',
}

export default async function ProjectsPage() {
  const { page } = await getOurProjects()
  const moreProjects = await getMoreProjects(5)

  return (
    <Layout>
      <Intro title={page.pageTitle} text={page.projectsText} />
      <section className="py-28 md:min-h-screen bg-lff_600 border-t border-lff_500">
        {page.projects && (
          <HeroProject
            projects={page.projects}
            title={page.projectsSectionTitle}
          />
        )}
      </section>
      <section className="py-28 min-h-screen flex justify-center bg-lff_600 border-t border-lff_500">
        {moreProjects.length > 0 && <MoreProjects projects={moreProjects} />}
      </section>
    </Layout>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/projects/page.tsx
git commit -m "feat: add projects listing page (App Router)"
```

---

### Task 9: Create app/projects/[slug]/page.tsx + components/FirstHomes.tsx

**Files:**
- Create: `components/FirstHomes.tsx`
- Create: `app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create components/FirstHomes.tsx**

Extracted from `pages/projects/[slug].js`.

```tsx
export default function FirstHomes() {
  const images = Array(36).fill('https://maniagosafaris.com/images/lff/dignity_housing/')
  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="w-full md:w-4/5 mx-auto">
        <h3 className="text-3xl text-lff_800 my-20 font-bold text-center">
          The making of the first Homes
        </h3>
        <div className="flex flex-wrap w-full">
          {images.map((base, i) => (
            <div key={i} className="flex w-1/2 md:w-1/3 p-3">
              <div className="overflow-hidden w-full">
                <img src={`${base}${i + 1}.jpg`} className="w-full" alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/projects/[slug]/page.tsx**

Replaces `pages/projects/[slug].js`. `getStaticPaths` → `generateStaticParams`. `getStaticProps` → inline async server component. In Next.js 15, `params` is a Promise.

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Layout from '@/components/Layout'
import Container from '@/components/Container'
import ProjectBody from '@/components/ProjectBody'
import ProjectHeader from '@/components/ProjectHeader'
import SectionSeparator from '@/components/SectionSeparator'
import Logo from '@/components/Logo'
import FirstHomes from '@/components/FirstHomes'
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
  const relatedProjectsTitle = {
    name: categoryName,
    link: categorySlug ? categoryPathBySlug(categorySlug) : null,
  }

  return (
    <Layout>
      <article>
        <Logo />
        <ProjectHeader
          title={project.title}
          coverImage={project.featuredImage}
          date={project.date}
          categories={project.typesOfProjects}
        />
        <ProjectBody content={project.content} />
        {project.slug === 'dignity-housing-for-wildife-rangers' && <FirstHomes />}
      </article>
      <SectionSeparator />
      {relatedProjectsList.length > 0 && (
        <div>
          {relatedProjectsTitle.name ? (
            <span>
              More from{' '}
              <Link href={relatedProjectsTitle.link ?? ''}>
                {relatedProjectsTitle.name}
              </Link>
            </span>
          ) : (
            <span>More Projects</span>
          )}
          <ul>
            {relatedProjectsList.map(p => (
              <li key={p.title}>
                <Link href={projectPathBySlug(p.slug)}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/FirstHomes.tsx app/projects/[slug]/page.tsx
git commit -m "feat: add project detail page with generateStaticParams (App Router)"
```

---

### Task 10: Create app/contact/page.tsx + app/donate/page.tsx

**Files:**
- Create: `app/contact/page.tsx`
- Create: `app/donate/page.tsx`
- Create: `app/donate/donate-client.tsx`

- [ ] **Step 1: Create app/contact/page.tsx**

The social links had nested `<a>` inside `<span>` inside `<Link>` — that creates invalid nested `<a>` tags. Remove the inner `<a>` tags.

```tsx
import type { Metadata } from 'next'
import Layout from '@/components/Layout'
import Container from '@/components/Container'
import Link from 'next/link'
import Logo from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  return (
    <Layout preview>
      <div className="flex md:justify-center p-6 md:p-0">
        <Container>
          <Logo />
          <div className="flex mt-28 md:mt-0 flex-col md:flex-row md:h-screen">
            <div className="flex w-full md:w-1/2 md:h-full relative items-center">
              <div>
                <h3 className="text-center md:text-left font-sorts text-4xl md:text-5xl xl:text-7xl 2xl:text-9xl text-lff_800 leading-none">
                  We&apos;d love to hear from you
                </h3>
              </div>
              <div className="hidden md:flex w-3/4 justify-between absolute bottom-4 text-sm">
                <div>
                  <Link href="https://www.instagram.com/maniagosafaris/">
                    <span className="flex space-x-3 cursor-pointer">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.6481 4.91018C15.4339 4.91018 15.2245 4.97347 15.0465 5.09205C14.8684 5.21063 14.7296 5.37918 14.6476 5.57637C14.5656 5.77356 14.5442 5.99055 14.586 6.19988C14.6278 6.40922 14.7309 6.60151 14.8824 6.75243C15.0338 6.90336 15.2268 7.00614 15.4368 7.04778C15.6469 7.08942 15.8646 7.06805 16.0625 6.98637C16.2604 6.90469 16.4295 6.76637 16.5485 6.5889C16.6675 6.41143 16.731 6.20279 16.731 5.98935C16.731 5.70314 16.6169 5.42865 16.4138 5.22626C16.2108 5.02388 15.9353 4.91018 15.6481 4.91018ZM19.7993 7.0865C19.7818 6.34035 19.6415 5.60211 19.3842 4.90119C19.1547 4.30147 18.7976 3.75842 18.3374 3.30942C17.8905 2.84846 17.3443 2.49481 16.7401 2.27522C16.0385 2.01096 15.2969 1.86802 14.5471 1.85254C13.5905 1.79858 13.2837 1.79858 10.8291 1.79858C8.37444 1.79858 8.06761 1.79858 7.11103 1.85254C6.36124 1.86802 5.61961 2.01096 4.9181 2.27522C4.31498 2.49703 3.76924 2.85038 3.32079 3.30942C2.85822 3.75473 2.50333 4.29905 2.28298 4.90119C2.01781 5.60026 1.87436 6.33932 1.85883 7.0865C1.80469 8.03977 1.80469 8.34553 1.80469 10.7916C1.80469 13.2378 1.80469 13.5435 1.85883 14.4968C1.87436 15.244 2.01781 15.983 2.28298 16.6821C2.50333 17.2842 2.85822 17.8285 3.32079 18.2739C3.76924 18.7329 4.31498 19.0863 4.9181 19.3081C5.61961 19.5723 6.36124 19.7153 7.11103 19.7307C8.06761 19.7847 8.37444 19.7847 10.8291 19.7847C13.2837 19.7847 13.5905 19.7847 14.5471 19.7307C15.2969 19.7153 16.0385 19.5723 16.7401 19.3081C17.3443 19.0885 17.8905 18.7348 18.3374 18.2739C18.7996 17.8265 19.1571 17.283 19.3842 16.6821C19.6415 15.9812 19.7818 15.2429 19.7993 14.4968C19.7993 13.5435 19.8535 13.2378 19.8535 10.7916C19.8535 8.34553 19.8535 8.03977 19.7993 7.0865ZM18.1749 14.3889C18.1684 14.9597 18.0646 15.5253 17.8681 16.0616C17.724 16.4529 17.4926 16.8066 17.1913 17.0958C16.8986 17.393 16.5444 17.6232 16.1535 17.7703C15.6153 17.9661 15.0478 18.0695 14.4749 18.076C13.5725 18.121 13.2386 18.13 10.8652 18.13C8.49176 18.13 8.15786 18.13 7.25542 18.076C6.66061 18.0871 6.06835 17.9958 5.50469 17.8062C5.13088 17.6516 4.79298 17.422 4.512 17.1317C4.21247 16.8428 3.98394 16.4889 3.8442 16.0975C3.62387 15.5536 3.50167 14.9752 3.48322 14.3889C3.48322 13.4896 3.42908 13.1568 3.42908 10.7916C3.42908 8.42647 3.42908 8.09372 3.48322 7.19442C3.48727 6.61082 3.59418 6.03247 3.79908 5.48574C3.95795 5.10615 4.2018 4.76778 4.512 4.4965C4.78618 4.18729 5.12502 3.94172 5.50469 3.77706C6.05477 3.57925 6.63454 3.47586 7.21932 3.47129C8.12176 3.47129 8.45566 3.41733 10.8291 3.41733C13.2025 3.41733 13.5364 3.41733 14.4388 3.47129C15.0117 3.47784 15.5792 3.58123 16.1174 3.77706C16.5275 3.92873 16.8955 4.17531 17.1913 4.4965C17.487 4.77275 17.7181 5.11049 17.8681 5.48574C18.0687 6.03335 18.1725 6.61147 18.1749 7.19442C18.2201 8.09372 18.2291 8.42647 18.2291 10.7916C18.2291 13.1568 18.2201 13.4896 18.1749 14.3889ZM10.8291 6.1782C9.91383 6.17998 9.01965 6.45206 8.25952 6.96007C7.49939 7.46809 6.90742 8.18923 6.55841 9.03238C6.20939 9.87553 6.119 10.8029 6.29865 11.6972C6.4783 12.5915 6.91992 13.4127 7.56773 14.057C8.21554 14.7013 9.04045 15.1398 9.93824 15.3171C10.836 15.4944 11.7664 15.4025 12.6118 15.053C13.4572 14.7036 14.1797 14.1123 14.688 13.3538C15.1963 12.5953 15.4676 11.7037 15.4676 10.7916C15.4688 10.1847 15.3496 9.58352 15.1168 9.02267C14.884 8.46181 14.5422 7.95236 14.1111 7.52361C13.68 7.09486 13.1682 6.75527 12.6049 6.52437C12.0416 6.29348 11.4381 6.17583 10.8291 6.1782ZM10.8291 13.7863C10.2347 13.7863 9.65371 13.6107 9.15952 13.2816C8.66533 12.9526 8.28016 12.4849 8.05271 11.9377C7.82526 11.3905 7.76574 10.7883 7.8817 10.2074C7.99765 9.62649 8.28386 9.09289 8.70414 8.67408C9.12441 8.25526 9.65987 7.97005 10.2428 7.85449C10.8257 7.73894 11.43 7.79825 11.9791 8.02491C12.5282 8.25157 12.9975 8.63541 13.3277 9.12788C13.658 9.62035 13.8342 10.1993 13.8342 10.7916C13.8342 11.1849 13.7565 11.5743 13.6054 11.9377C13.4544 12.301 13.2331 12.6311 12.954 12.9092C12.675 13.1873 12.3437 13.4079 11.9791 13.5584C11.6145 13.7089 11.2237 13.7863 10.8291 13.7863Z" fill="#665F4B"/>
                      </svg>
                      <span>Instagram</span>
                    </span>
                  </Link>
                </div>
                <div>
                  <Link href="https://www.facebook.com/ManiagoSafarisEastAfrica">
                    <span className="flex space-x-3 cursor-pointer">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.6798 4.78431H15.3763V1.92451C14.5549 1.83939 13.7295 1.79737 12.9037 1.79861C10.449 1.79861 8.77049 3.29146 8.77049 6.02535V8.38153H6V11.5831H8.77049V19.7847H12.0915V11.5831H14.8529L15.268 8.38153H12.0915V6.3401C12.0915 5.39583 12.3441 4.78431 13.6798 4.78431Z" fill="#665F4B"/>
                      </svg>
                      <span>Facebook</span>
                    </span>
                  </Link>
                </div>
                <div>
                  <Link href="https://www.youtube.com/channel/UCVmNdFZ3SvfszacIMCfpPHg">
                    <span className="flex space-x-3 cursor-pointer">
                      <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 17H6C3 17 1 15 1 12V6C1 3 3 1 6 1H16C19 1 21 3 21 6V12C21 15 19 17 16 17Z" stroke="#665F4B" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.4001 6.50006L12.9001 8.0001C13.8001 8.6001 13.8001 9.5001 12.9001 10.1001L10.4001 11.6001C9.4001 12.2001 8.6001 11.7001 8.6001 10.6001V7.6001C8.6001 6.30006 9.4001 5.90006 10.4001 6.50006Z" stroke="#665F4B" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Youtube</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex md:w-1/2 relative pt-8 md:pt-0 md:pl-20 items-center">
              <a
                href="mailto:info@theluigifootprints.org"
                className="donate-button text-lff_800 flex font-sen items-center text-sm py-5 px-8 space-x-2 border-solid border border-lff_800 w-auto justify-center bg-lff_200 hover:bg-lff_400"
              >
                <span className="text-lff_800 lowercase">Send us an email</span>
              </a>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  )
}
```

- [ ] **Step 2: Create app/donate/page.tsx**

Server wrapper that provides metadata. The donate page is a full client component (useState, useEffect, GSAP, PayPal) and cannot export metadata itself — the server wrapper handles that.

```tsx
import type { Metadata } from 'next'
import DonateClient from './donate-client'

export const metadata: Metadata = {
  title: 'Donate 💚',
}

export default function DonatePage() {
  return <DonateClient />
}
```

- [ ] **Step 3: Create app/donate/donate-client.tsx**

Copy `pages/donate/index.js` in full, then make these specific changes at the top of the file:

**Line 1 — add directive:**
```tsx
'use client'
```

**Replace imports block (lines 1–10 of the original):**
```tsx
import Layout from '@/components/Layout'
import { useState, useEffect, useRef } from 'react'
import Alert from '@/components/Alert'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import Logo from '@/components/Logo'
import ThankYou from '@/components/ThankYou'
import gsap from 'gsap'
import { v4 } from 'uuid'
```

Note: `Head` import and `<Head>` JSX block are removed — title comes from `app/donate/page.tsx` metadata.

**Add after the imports, before the first component — Checkout global declaration:**
```tsx
declare const Checkout: {
  configure: (config: {
    session?: { id: string }
    merchant?: string
    order?: Record<string, unknown>
    transaction?: Record<string, unknown>
    interaction?: Record<string, unknown>
  }) => void
}
```

**In the `Index` component, remove the `<Head>` block:**
```tsx
// Remove this:
<Head>
  <title>Donate 💚 | The Luigi Footprints Foundation</title>
</Head>
```

The rest of the 867-line file is unchanged — copy it verbatim from `pages/donate/index.js`.

- [ ] **Step 4: Commit**

```bash
git add app/contact/page.tsx app/donate/page.tsx app/donate/donate-client.tsx
git commit -m "feat: add contact and donate pages (App Router)"
```

---

### Task 11: Convert all components to .tsx

**Files:**
- Rename: all `components/*.js` → `components/*.tsx`
- Modify: add `'use client'` to hook/GSAP-using components
- Modify: fix `next/link` nested `<a>` pattern in `Navbar.tsx`
- Delete: `components/Meta.js` (functionality moved to `app/layout.tsx`)

- [ ] **Step 1: Rename all component .js files to .tsx**

```powershell
Get-ChildItem "components\*.js" | ForEach-Object {
  Rename-Item $_.FullName ($_.FullName -replace '\.js$', '.tsx')
}
```

- [ ] **Step 2: Add 'use client' to all components**

Since this is a static export site (`output: 'export'`), adding `'use client'` to all components is safe — there is no SSR to lose. It prevents build-time errors when components use browser APIs (GSAP, window, IntersectionObserver).

Add `'use client'` as the very first line to every file in `components/`:

```
components/Alert.tsx
components/Categories.tsx
components/Container.tsx
components/CoverImage.tsx
components/CtaSection.tsx
components/Date.tsx
components/FirstHomes.tsx
components/Footer.tsx
components/Header.tsx
components/HeroProject.tsx
components/HeroSection.tsx
components/Intro.tsx
components/LFFLogo.tsx
components/Layout.tsx
components/Logo.tsx
components/Luigi.tsx
components/MoreProjects.tsx
components/Navbar.tsx
components/Navigation.tsx
components/OurStory.tsx
components/Philosophy.tsx
components/ProjectBody.tsx
components/ProjectHeader.tsx
components/ProjectPreview.tsx
components/ProjectTitle.tsx
components/Projects.tsx
components/SectionSeparator.tsx
components/Select.tsx
components/SocialIcons.tsx
components/Tags.tsx
components/TeamMember.tsx
components/TheTeam.tsx
components/ThankYou.tsx
components/countries.tsx
```

To add it efficiently with PowerShell:
```powershell
Get-ChildItem "components\*.tsx" | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  if (-not $content.StartsWith("'use client'")) {
    Set-Content $_.FullName -Value ("'use client'`n`n" + $content)
  }
}
```

- [ ] **Step 3: Fix next/link patterns in Navbar.tsx**

Open `components/Navbar.tsx`. Find every `<Link>...<a>...</a>...</Link>` and remove the inner `<a>`, moving its `className` to the `<Link>`.

**Change 1** — NavBar component, title link:
```tsx
// Before:
<Link scroll={false} href={'/'}>
  <a>The Luigi Footprints Foundation</a>
</Link>

// After:
<Link scroll={false} href="/">
  The Luigi Footprints Foundation
</Link>
```

**Change 2** — DesktopNav menu items:
```tsx
// Before:
<Link scroll={false} href={link.url}>
  <a className="hover:underline">{link.text}</a>
</Link>

// After:
<Link scroll={false} href={link.url} className="hover:underline">
  {link.text}
</Link>
```

**Change 3** — DesktopNav donate button:
```tsx
// Before:
<Link scroll={false} href="/donate">
  <a className="hover:underline w-full">Support</a>
</Link>

// After:
<Link scroll={false} href="/donate" className="hover:underline w-full">
  Support
</Link>
```

Also search the rest of `components/` for any remaining `<Link>...<a>` patterns and remove the `<a>` wrappers. Common files to check: `Footer.tsx`, `Logo.tsx`, `CoverImage.tsx`, `ProjectPreview.tsx`, `CtaSection.tsx`, `HeroSection.tsx`, `HeroProject.tsx`, `OurStory.tsx`, `Projects.tsx`.

Pattern to search for:
```bash
grep -r "<Link" components/ --include="*.tsx" -l
```
Then for each file, remove `<a>` children of `<Link>`, moving any `className` to the `<Link>` element.

- [ ] **Step 4: Remove Meta.js and its import from Layout.tsx**

Delete `components/Meta.tsx` (its functionality is now in `app/layout.tsx`):
```bash
rm components/Meta.tsx
```

Open `components/Layout.tsx` and remove:
```tsx
// Remove this import:
import Meta from './Meta'

// Remove this JSX inside the return:
<Meta />
```

- [ ] **Step 5: Commit**

```bash
git add components/
git commit -m "chore: convert all components to TypeScript, add 'use client'"
```

---

### Task 12: Delete pages/ directory and legacy files

**Files:**
- Delete: `pages/` (entire directory)

- [ ] **Step 1: Delete the pages/ directory**

```powershell
Remove-Item -Recurse -Force pages
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: delete Pages Router (pages/) — replaced by App Router (app/)"
```

---

### Task 13: Verify Phase 1 build

- [ ] **Step 1: Run the build**

```bash
yarn build
```

Expected output:
```
✓ Compiled successfully
Route (app)                              Size     First Load JS
┌ ○ /                                   ...
├ ○ /contact                            ...
├ ○ /donate                             ...
├ ○ /our-story                          ...
├ ○ /projects                           ...
└ ● /projects/[slug]                    ...
○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses generateStaticParams)
```

If TypeScript errors appear, fix them before proceeding. Common errors and fixes:

- `Property 'X' does not exist on type 'Y'` — add the missing field to the relevant interface in `types/index.ts`
- `'useRef' is not a function` — the component file is missing `'use client'`
- `Cannot find module '@/components/Meta'` — remove the import from Layout.tsx (done in Task 11 Step 4)
- `Parameter 'x' implicitly has an 'any' type` — add an explicit type annotation

- [ ] **Step 2: Commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve TypeScript errors from Phase 1 build"
```

---

## PHASE 2: Tailwind v4 migration

---

### Task 14: Update packages for Tailwind v4

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update devDependencies in package.json**

Replace the `devDependencies` block only (leave `dependencies` unchanged):

```json
"devDependencies": {
  "@types/node": "^22",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@types/react-transition-group": "^4.4.4",
  "postcss": "latest",
  "@tailwindcss/postcss": "latest",
  "tailwindcss": "latest",
  "typescript": "^5"
}
```

Removed: `@tailwindcss/custom-forms`, `autoprefixer`, `10.4.5` pinned autoprefixer version. Tailwind v4 handles prefixing internally.

- [ ] **Step 2: Install**

```bash
yarn install
```

- [ ] **Step 3: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: install Tailwind v4 + @tailwindcss/postcss"
```

---

### Task 15: Rewrite globals.css + postcss.config.js + delete tailwind.config.js

**Files:**
- Delete: `tailwind.config.js`
- Modify: `postcss.config.js`
- Modify: `styles/globals.css`

- [ ] **Step 1: Delete tailwind.config.js**

```bash
rm tailwind.config.js
```

- [ ] **Step 2: Overwrite postcss.config.js**

```js
module.exports = {
  plugins: { '@tailwindcss/postcss': {} }
}
```

- [ ] **Step 3: Overwrite styles/globals.css**

All `tailwind.config.js` theme config (colors, fonts, breakpoints, animation) moves into the `@theme` block. The `@layer components` custom CSS from the original `globals.css` is preserved unchanged. The `@utility container` replaces the JS `addComponents` container plugin.

```css
/* Google font */
@import url("https://fonts.googleapis.com/css2?family=Sen:wght@400;700;800&display=swap");

@import "tailwindcss";

/* ─── Custom theme tokens ─── */
@theme {
  /* Fonts */
  --font-itc: "ITC Berkeley Oldstyle Std", Georgia, serif;
  --font-sen: "Sen", sans-serif;
  --font-sorts: "Sen", sans-serif;
  --font-poppins: "poppins";
  --font-verl: "Verlag";
  --font-tenor: "Tenor Sans";

  /* lff scale */
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

  /* Named lff colors */
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

  /* Text-only colors */
  --color-primary: #3F3F3F;
  --color-faded: #292D32;

  /* Custom breakpoint */
  --breakpoint-3xl: 1920px;

  /* Timer animation (SVG stroke) */
  --animate-timer: timer 8s linear forwards;
  @keyframes timer {
    to { stroke-dashoffset: 0; }
  }
}

/* ─── Custom container — replaces addComponents plugin in tailwind.config.js ─── */
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

/* ─── third-child variant — replaces addVariant plugin in tailwind.config.js ─── */
@variant third-child (&:nth-child(3));

/* ─── @font-face (unchanged) ─── */
@layer base {
  @font-face {
    font-family: "Verlag";
    src: url("fonts/Verlag/Verlag-Book.woff2") format("woff2"),
      url("fonts/Verlag/Verlag-Book.woff") format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Verlag";
    src: url("fonts/Verlag/Verlag-Bold.woff2") format("woff2"),
      url("fonts/Verlag/Verlag-Bold.woff") format("woff");
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Verlag";
    src: url("fonts/Verlag/Verlag-Black.woff2") format("woff2"),
      url("fonts/Verlag/Verlag-Black.woff") format("woff");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Verlag";
    src: url("fonts/Verlag/Verlag-BlackItalic.woff2") format("woff2"),
      url("fonts/Verlag/Verlag-BlackItalic.woff") format("woff");
    font-weight: 500;
    font-style: italic;
    font-display: swap;
  }
  @font-face {
    font-family: "Verlag";
    src: url("fonts/Verlag/Verlag-Light.woff2") format("woff2"),
      url("fonts/Verlag/Verlag-Light.woff") format("woff");
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Verlag";
    src: url("fonts/Verlag/Verlag-LightItalic.woff2") format("woff2"),
      url("fonts/Verlag/Verlag-LightItalic.woff") format("woff");
    font-weight: 300;
    font-style: italic;
    font-display: swap;
  }
  @font-face {
    font-family: "ITC Berkeley Oldstyle Std";
    src: url("fonts/ITC-Berkeley/BerkeleyStd-Black.woff2") format("woff2"),
      url("fonts/ITC-Berkeley/BerkeleyStd-Black.woff") format("woff");
    font-weight: 900;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "FITC Berkeley Oldstyle Std";
    src: url("fonts/ITC-Berkeley/BerkeleyStd-BlackItalic.woff2") format("woff2"),
      url("fonts/ITC-Berkeley/BerkeleyStd-BlackItalic.woff") format("woff");
    font-weight: 900;
    font-style: italic;
    font-display: swap;
  }
  @font-face {
    font-family: "ITC Berkeley Oldstyle Std";
    src: url("fonts/ITC-Berkeley/BerkeleyStd-Bold.woff2") format("woff2"),
      url("fonts/ITC-Berkeley/BerkeleyStd-Bold.woff") format("woff");
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "ITC Berkeley Oldstyle Std";
    src: url("fonts/ITC-Berkeley/BerkeleyStd-BoldItalic.woff2") format("woff2"),
      url("fonts/ITC-Berkeley/BerkeleyStd-BoldItalic.woff") format("woff");
    font-weight: bold;
    font-style: italic;
    font-display: swap;
  }
  @font-face {
    font-family: "ITC Berkeley Oldstyle Std";
    src: url("fonts/ITC-Berkeley/BerkeleyStd-Book.woff2") format("woff2"),
      url("fonts/ITC-Berkeley/BerkeleyStd-Book.woff") format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "ITC Berkeley Oldstyle Std";
    src: url("fonts/ITC-Berkeley/BerkeleyStd-BookItalic.woff2") format("woff2"),
      url("fonts/ITC-Berkeley/BerkeleyStd-BookItalic.woff") format("woff");
    font-weight: normal;
    font-style: italic;
    font-display: swap;
  }
  @font-face {
    font-family: "ITC Berkeley Oldstyle Std";
    src: url("fonts/ITC-Berkeley/BerkeleyStd-Medium.woff2") format("woff2"),
      url("fonts/ITC-Berkeley/BerkeleyStd-Medium.woff") format("woff");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "ITC Berkeley Oldstyle Std";
    src: url("fonts/ITC-Berkeley/BerkeleyStd-Italic.woff2") format("woff2"),
      url("fonts/ITC-Berkeley/BerkeleyStd-Italic.woff") format("woff");
    font-weight: 500;
    font-style: italic;
    font-display: swap;
  }
  @font-face {
    font-family: "GoudyOldStyleW01";
    src: url("fonts/GoudyOldstylew01/GoudyOldStyleW01-Regular.woff2") format("woff2"),
      url("fonts/GoudyOldstylew01/GoudyOldStyleW01-Regular.woff") format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "GoudyOldstyleW01";
    src: url("fonts/GoudyOldstylew01/GoudyOldstyleW01-Bold.woff2") format("woff2"),
      url("fonts/GoudyOldstylew01/GoudyOldstyleW01-Bold.woff") format("woff");
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "GoudyOldstyleW01";
    src: url("fonts/GoudyOldstylew01/GoudyOldstyleW01-Italic.woff2") format("woff2"),
      url("fonts/GoudyOldstylew01/GoudyOldstyleW01-Italic.woff") format("woff");
    font-weight: normal;
    font-style: italic;
    font-display: swap;
  }
}

/* ─── Custom component styles (unchanged from original globals.css) ─── */
@layer components {
  html { overflow-x: hidden; }

  body { overflow: hidden; width: 100%; }

  .content-area { width: calc(100% - 8rem); }

  .list__item.is__active { opacity: 1; }

  .list__item:before {
    top: 50%; left: 50%; content: "";
    width: 0.486vw; height: 0.486vw; border-radius: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .list__item.is__active svg circle { animation: timer 8s linear forwards; }

  .list__item svg circle {
    stroke-miterlimit: 10;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
  }

  .list__item.is__active:before { background: #FFFBF2; }

  .list__item:last-of-type { margin-right: 0; }

  .z-100 { z-index: 100; }

  p { margin: 1rem 0; }

  .loading { opacity: 0; transition: all 0.2s ease-in-out 0; }

  .overlay {
    grid-area: 1 / 1 / 2 / 2;
    position: relative; z-index: 30;
    pointer-events: none; width: 100%; height: 100%;
  }

  .main::before {
    animation: noise 1s steps(2) infinite;
    background-image: url(/noise.png);
    content: ""; height: 280%; left: -50%; opacity: 0.4;
    position: fixed; top: -100%; width: 300%; z-index: 30;
  }

  @keyframes grain {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5%, -10%); }
    20% { transform: translate(-15%, 5%); }
    30% { transform: translate(7%, -25%); }
    40% { transform: translate(-5%, 25%); }
    50% { transform: translate(-15%, 10%); }
    60% { transform: translate(15%, 0%); }
    70% { transform: translate(0%, 15%); }
    80% { transform: translate(3%, 35%); }
    90% { transform: translate(-10%, 10%); }
  }

  @keyframes noise {
    0% { transform: translate3d(0, 9rem, 0); }
    10% { transform: translate3d(-1rem, -4rem, 0); }
    20% { transform: translate3d(-8rem, 2rem, 0); }
    30% { transform: translate3d(9rem, -9rem, 0); }
    40% { transform: translate3d(-2rem, 7rem, 0); }
    50% { transform: translate3d(-9rem, -4rem, 0); }
    60% { transform: translate3d(2rem, 6rem, 0); }
    70% { transform: translate3d(7rem, -8rem, 0); }
    80% { transform: translate3d(-9rem, 1rem, 0); }
    90% { transform: translate3d(6rem, -5rem, 0); }
    to { transform: translate3d(-7rem, 0, 0); }
  }

  a, button, form { position: relative; z-index: 50; }

  ::-webkit-scrollbar { width: 8px; height: 16px; }
  ::-webkit-scrollbar-track { background: #ffecbc; }
  ::-webkit-scrollbar-thumb { background: #998e71; border: 2px solid #ffecbc; }
  ::-webkit-scrollbar-thumb:hover { background: #665f4b; }

  .icon-scroll-line {
    width: 1px; position: absolute; bottom: 0; z-index: 10; pointer-events: none;
  }
  .icon-scroll-line::before {
    width: 1px; content: ""; position: absolute; overflow: hidden;
    top: 0; left: 0; pointer-events: none;
    background: #FFFBF2; bottom: 0; opacity: .5; z-index: 15; transition: all .2s ease-out;
  }
  .icon-scroll-line::after {
    width: 1px; content: ""; position: absolute; overflow: hidden;
    top: 0; left: 0; pointer-events: none;
    background: #FFFBF2; height: 100px; z-index: 16;
    animation: iconscroll 2s ease-in-out infinite; opacity: 0;
  }

  @keyframes iconscroll {
    0% { opacity: 0; }
    20% { opacity: 1; }
    45% { opacity: 1; }
    100% { opacity: 0; top: calc(100% - 100px); }
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add styles/globals.css postcss.config.js
git commit -m "feat: migrate to Tailwind v4 CSS-first config"
```

---

### Task 16: Verify Phase 2 build

- [ ] **Step 1: Run the build**

```bash
yarn build
```

Expected: clean build, no Tailwind compilation errors, same routes as Phase 1.

If Tailwind v4 errors appear:

- `Unknown at-rule @theme` → `@import "tailwindcss"` must come after the Google Fonts `@import` but before `@theme`. Check that `@import "tailwindcss"` is present.
- `Unknown utility class` → check that the color/font token name in `@theme` matches exactly what's used in JSX (e.g., `--color-lff_800` generates `text-lff_800`, `bg-lff_800`, `border-lff_800`).
- `@tailwindcss/custom-forms not found` → confirm it was removed from devDependencies and `tailwind.config.js` was deleted.

- [ ] **Step 2: Spot-check in browser**

```bash
yarn dev
```

Open `http://localhost:3000` and verify:
- Colors match the original site (lff tan/gold palette)
- Custom fonts load (Verlag, Sen, ITC Berkeley)
- Nav works, GSAP page transitions fire on route change
- Projects page lists projects
- A project detail page renders

- [ ] **Step 3: Commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve Phase 2 build issues"
```
