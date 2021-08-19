import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/Container'
import ProjectBody from '../../components/ProjectBody'
import MoreProjects from '../../components/MoreProjects'
import ProjectHeader from '../../components/ProjectHeader'
import Layout from '../../components/Layout'
import ProjectTitle from '../../components/ProjectTitle'
import Head from 'next/head'
import Tags from '../../components/Tags'
import SectionSeparator from '../../components/SectionSeparator'
import { getAllProjectsWithSlug, getProjectAndMoreProjects } from '../../lib/api'

export default function Project({ project, projects, preview }) {
    const router = useRouter()
    const moreProjects = projects?.edges

    if (!router.isFallback && !project?.slug) {
        return <ErrorPage statusCode={404} />
    }

    return (
        <Layout preview={preview}>
            <Container>
                {router.isFallback ? (
                    <ProjectTitle>Loading...</ProjectTitle>
                ) : (
                    <>
                        <article>
                            <Head>
                                <title>{project.title} | Luigi Footprints Foundation</title>
                                <meta
                                    property="og:image"
                                    content={project.featuredImage?.node?.sourceUrl}
                                />
                            </Head>
                            <ProjectHeader
                                title={project.title}
                                coverImage={project.featuredImage?.node}
                                date={project.date}
                                categories={project.typesOfProjects}
                            />
                            <ProjectBody content={project.content} />
                            <footer>
                                {project.tags.edges.length > 0 && <Tags tags={project.tags} />}
                            </footer>
                        </article>
                        <SectionSeparator />
                        {moreProjects.length > 0 && <MoreProjects projects={moreProjects} />}
                    </>
                )}
            </Container>
        </Layout>
    )
}

export async function getStaticProps({ params, preview = false, previewData }) {
    const data = await getProjectAndMoreProjects(params.slug, preview, previewData)

    return {
        props: {
            preview,
            project: data.project,
            projects: data.projects,
        }
    }
}

export async function getStaticPaths() {
    const allprojects = await getAllProjectsWithSlug()

    return {
        paths: allprojects.edges.map(({ node }) => `/projects/${node.slug}`) || [],
        fallback: true,
    }
}