import type { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import TeamGrid from '@/components/team/TeamGrid'
import type { TrusteeData } from '@/components/team/TeamSheet'
import { getOurStory } from '@/lib/pages'

export const metadata: Metadata = { title: 'Our Story' }

export default async function OurStoryPage() {
  const { page } = await getOurStory()

  // Runtime data shape: Array<Record<string, TrusteeData[]>>
  // TypeScript type is Record<string, TrusteeData> — cast to flatten safely
  const trusteeGroups = page.trustees as unknown as Array<Record<string, TrusteeData[]>>
  const members: TrusteeData[] = trusteeGroups.flatMap(group =>
    Object.values(group).flatMap(arr => arr)
  )

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-svh overflow-hidden flex items-end">
        <div
          aria-hidden="true"
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${page.heroImage.sourceUrl})` }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[rgba(26,21,16,0.5)]" />
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

      {/* Editorial text */}
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
      <TeamGrid title={[page.title1, page.title2]} members={members} />
    </Layout>
  )
}
