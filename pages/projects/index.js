import Head from 'next/head'
import MoreProjects from '../../components/MoreProjects'
import HeroProject from '../../components/HeroProject'
import Intro from '../../components/Intro'
import Layout from '../../components/Layout'
import { getOurProjects } from '../../lib/pages'
import { getMoreProjects } from '../../lib/projects'

const Index = ({ page, more_projects }) => {
    return (
        <>
            <Layout>
                <Head>
                    <title>Our Projects | Luigi Footprints Foundation</title>
                </Head>

                <Intro title={page.pageTitle} text={page.projectsText} />
                <section
                    className="py-28 md:min-h-screen bg-lff_600 border-t border-lff_500"
                >

                    {page.projects && (
                        <HeroProject
                            projects={page.projects}
                            title={page.projectsSectionTitle}
                        />
                    )}
                </section>
                <section className='py-28 min-h-screen flex justify-center bg-lff_600 border-t border-lff_500'>
                    {more_projects.length > 0 && <MoreProjects projects={more_projects} />}
                </section>
            </Layout>
        </>
    )
}

export async function getStaticProps() {
    const page = await getOurProjects()
    const moreProjects = await getMoreProjects(5)

    return {
        props: {
            page: page.page,
            more_projects: moreProjects
        }
    }
}

export default Index