import Head from 'next/head'
import HeroSection from '../components/HeroSection'
import Layout from '../components/Layout'
import { getHomePage } from '../lib/pages'
import Philosophy from '../components/Philosophy'
import OurStory from '../components/OurStory'
import CtaSection from '../components/CtaSection'
import Projects from '../components/Projects'
import Luigi from '../components/Luigi'

export default function Home({ page }) {

    return (
        <>
            <Layout>
                <Head>
                    <title>Home | Luigi Footprints Foundation</title>
                </Head>

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
        </>
    )
}


export async function getStaticProps() {
    const page = await getHomePage()

    return {
        props: {
            page: page.page,
        }
    }
}