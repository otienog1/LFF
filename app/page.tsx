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
  // Runtime data shape differs from TypeScript types for these CMS fields
  const luigiImages = (page.luigiImages as unknown as Array<typeof page.luigiImages>)[0]

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
        images={luigiImages}
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
