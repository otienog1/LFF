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
