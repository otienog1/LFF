// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import Container from '../../components/Container'
import ProjectBody from '../../components/ProjectBody'
// import MoreProjects from '../../components/MoreProjects'
import ProjectHeader from '../../components/ProjectHeader'
import Layout from '../../components/Layout'
// import ProjectTitle from '../../components/ProjectTitle'
import Head from 'next/head'
// import Tags from '../../components/Tags'
import SectionSeparator from '../../components/SectionSeparator'
// import { getAllProjectsWithSlug, getProjectAndMoreProjects } from '../../lib/api'
import Image from 'next/image'
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
                    <FirstHomes />
                    {/* <footer>
                        {tags.length > 0 && <Tags tags={tags} />}
                    </footer> */}
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

export function FirstHomes() {
    const images = Array(36).fill('https://maniagosafaris.com/images/lff/dignity_housing/')
    return (
        <>
            <div className="flex justify-center px-4 md:px-0">

                <div className="w-full md:w-1/2 mx-auto">
                    <h3 className="text-3xl text-lff text-lff_800 my-20 font-bold text-center">
                        The making of the first Homes
                    </h3>
                    <div className="flex flex-wrap w-full">
                        {images.map((_, i) => (
                            <div key={i} className="flex w-1/2 md:w-1/3 p-1.5">
                                <Image
                                    src={`${_}${i + 1}.jpg`}
                                    width={388}
                                    height={295}
                                    loading="eager"
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    )
}