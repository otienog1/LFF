import Head from 'next/head'
import MoreProjects from '../../components/MoreProjects'
import HeroProject from '../../components/HeroProject'
import Intro from '../../components/Intro'
import Layout from '../../components/Layout'
import { getOurProjects } from '../../lib/pages'

const Index = ({ page }) => {
    return (
        <>
            <Layout>
                <Head>
                    <title>Our Projects | Luigi Footprints Foundation</title>
                </Head>

                <Intro title={page.pageTitle} text={page.projectsText} />
                <section
                    className="py-28 min-h-screen bg-lff_600 border-t border-lff_500"
                >

                    {page.projects && (
                        <HeroProject
                            projects={page.projects}
                            title={page.projectsSectionTitle}
                        />
                    )}
                </section>
                {/* {moreProjects.length > 0 && <MoreProjects projects={moreProjects} />} */}
            </Layout>
        </>
    )
}

export async function getStaticProps() {
    const page = await getOurProjects()

    return {
        props: {
            page: page.page
        }
    }
}

export default Index