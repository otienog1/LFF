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
