// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import Container from '../../components/Container'
import ProjectBody from '../../components/ProjectBody'
import MoreProjects from '../../components/MoreProjects'
import ProjectHeader from '../../components/ProjectHeader'
import Layout from '../../components/Layout'
import ProjectTitle from '../../components/ProjectTitle'
import Head from 'next/head'
import Tags from '../../components/Tags'
import SectionSeparator from '../../components/SectionSeparator'
// import { getAllProjectsWithSlug, getProjectAndMoreProjects } from '../../lib/api'
import { getProjectBySlug, getAllProjects, getRelatedProjects, projectPathBySlug } from '../../lib/projects'
import { categoryPathBySlug } from '../../lib/catogories'

export default function Project({ project, relatedProjects }) {
    const {
        title,
        content,
        date,
        modified,
        featuredImage,
        typesOfProjects,
        tags,
    } = project,

        { projects: relatedProjectsList, title: relatedProjectsTitle } = relatedProjects

    return (
        <Layout>
            <Container>
                <>
                    <article>
                        <Head>
                            <title>{title} | Luigi Footprints Foundation</title>
                            <meta
                                property="og:image"
                                content={featuredImage?.sourceUrl}
                            />
                        </Head>
                        <ProjectHeader
                            title={title}
                            coverImage={featuredImage}
                            date={date}
                            categories={typesOfProjects}
                        />
                        <ProjectBody content={content} />
                        <footer>
                            {tags.length > 0 && <Tags tags={tags} />}
                        </footer>
                    </article>
                    <SectionSeparator />
                    {!!relatedProjectsList.length && (
                        <div>
                            {relatedProjectsTitle.name ? (
                                <span>
                                    More from{' '}
                                    <Link href={relatedProjectsTitle.link}>
                                        <a>{relatedProjectsTitle.name}</a>
                                    </Link>
                                </span>
                            ) : (
                                <span>More Projects</span>
                            )}
                            <ul>
                                {relatedPostsList.map((project) => (
                                    <li key={project.title}>
                                        <Link href={projectPathBySlug(project.slug)}>
                                            <a>{project.title}</a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* {moreProjects.length > 0 && <MoreProjects projects={moreProjects} />} */}
                </>
            </Container>
        </Layout>
    )
}

export async function getStaticProps({ params = {} } = {}) {
    const { project } = await getProjectBySlug(params?.slug),

        { typesOfProjects, databaseId: projectId } = project,
        category = typesOfProjects.length && typesOfProjects[0]

    let { name, slug } = category

    return {
        props: {
            project,
            relatedProjects: {
                projects: await getRelatedProjects(category, projectId),
                title: {
                    name: name || null,
                    link: categoryPathBySlug(slug)
                },
            },
        },
    }
}

export async function getStaticPaths() {
    const { projects } = await getAllProjects()

    const paths = projects.map(project => {
        const { slug } = project
        return {
            params: {
                slug,
            },
        }
    })

    return {
        paths,
        fallback: false,
    }
}