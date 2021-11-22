import Head from 'next/head'
import HeroSection from '../components/HeroSection'
import Layout from '../components/Layout'
import { getHomePage } from '../lib/pages'
import { getAllProjectsForHome } from '../lib/api'
import Philosophy from '../components/Philosophy'
import OurStory from '../components/OurStory'
import HeroProject from '../components/HeroProject'
import CtaSection from '../components/CtaSection'
import Container from '../components/Container'
import { useEffect, useRef } from 'react'
import Luigi from '../components/Luigi'

export default function Home({ page, allProjects: { edges } }) {
    const heroProject = edges[0]?.node

    const elem = useRef()

    useEffect(() => {
        elem.current.style.paddingLeft = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
    }, [])

    return (
        <>
            <Layout>
                <Head>
                    <title>Home | Luigi Footprints Foundation</title>
                </Head>

                <HeroSection intro={page.heroText} slides={page.heroSlider[0]} thumbs={page.heroSliderThumbnails[0]} />
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

                {heroProject && (
                    <section className="bg-lff_200 md:min-h-screen text-lff_800 py-32" >
                        <h2 className="text-7xl text-center font-bold mb-20">{page.projectsTitle}</h2>
                        <div className="md:w-full flex justify-center mb-48 leading-loose text-xl text-center">
                            <Container>
                                <div ref={elem}>
                                    <p dangerouslySetInnerHTML={{ __html: page.projectText }}></p>
                                </div>
                            </Container>
                        </div>
                        <HeroProject
                            title={heroProject.title}
                            coverImage={heroProject.featuredImage?.node}
                            date={heroProject.date}
                            author={heroProject.author?.node}
                            slug={heroProject.slug}
                            excerpt={heroProject.excerpt}
                        />
                    </section>
                )}

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
    const allProjects = await getAllProjectsForHome()

    return {
        props: {
            page: page.page,
            allProjects
        }
    }
}