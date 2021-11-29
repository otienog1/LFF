import Head from 'next/head'
import MoreProjects from '../../components/MoreProjects'
import HeroProject from '../../components/HeroProject'
import Intro from '../../components/Intro'
import Layout from '../../components/Layout'
import { getAllProjectsForHome } from '../../lib/api'

const Index = ({ allProjects: { edges }, preview }) => {
    const heroProject = edges[0]?.node
    const moreProjects = edges.slice(1)

    return (
        <>
            <Layout preview={preview}>
                <Head>
                    <title>Our Projects | Luigi Footprints Foundation</title>
                </Head>

                <Intro />
                <section className="flex items-center py-28 min-h-screen bg-lff_100">
                    {heroProject && (
                        <HeroProject
                            title={heroProject.title}
                            coverImage={heroProject.featuredImage?.node}
                            date={heroProject.date}
                            author={heroProject.author?.node}
                            slug={heroProject.slug}
                            excerpt={heroProject.excerpt}
                        />
                    )}
                </section>
                {moreProjects.length > 0 && <MoreProjects projects={moreProjects} />}
            </Layout>
        </>
    )
}

export async function getStaticProps({ preview = false }) {
    const allProjects = await getAllProjectsForHome(preview)
    return {
        props: { allProjects, preview },
    }
}

export default Index