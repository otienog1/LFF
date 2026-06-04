import type { Metadata } from 'next'
import Link from 'next/link'
import Layout from '@/components/Layout'
import ProjectBody from '@/components/ProjectBody'
import ProjectHeader from '@/components/ProjectHeader'
import SectionSeparator from '@/components/SectionSeparator'
import Logo from '@/components/Logo'
import FirstHomes from '@/components/FirstHomes'
import { getProjectBySlug, getAllProjects, getRelatedProjects, projectPathBySlug } from '@/lib/projects'
import { categoryPathBySlug } from '@/lib/catogories'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { projects } = await getAllProjects()
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { project } = await getProjectBySlug(slug)
  return {
    title: project?.title ?? 'Project',
    openGraph: { images: [project?.featuredImage?.sourceUrl ?? ''] },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const { project } = await getProjectBySlug(slug)

  if (!project) return null

  const { typesOfProjects, databaseId: projectId } = project
  const category = typesOfProjects.length ? typesOfProjects[0] : null
  const categoryName = category?.name ?? null
  const categorySlug = category?.slug ?? null

  const relatedProjectsList = await getRelatedProjects(category ?? null, projectId)
  const relatedProjectsTitle = {
    name: categoryName,
    link: categorySlug ? categoryPathBySlug(categorySlug) : null,
  }

  return (
    <Layout>
      <article>
        <Logo />
        <ProjectHeader
          title={project.title}
          coverImage={project.featuredImage}
          date={project.date}
          categories={project.typesOfProjects}
        />
        <ProjectBody content={project.content} />
        {project.slug === 'dignity-housing-for-wildife-rangers' && <FirstHomes />}
      </article>
      <SectionSeparator />
      {relatedProjectsList.length > 0 && (
        <div>
          {relatedProjectsTitle.name ? (
            <span>
              More from{' '}
              <Link href={relatedProjectsTitle.link ?? ''}>
                {relatedProjectsTitle.name}
              </Link>
            </span>
          ) : (
            <span>More Projects</span>
          )}
          <ul>
            {relatedProjectsList.map(p => (
              <li key={p.title}>
                <Link href={projectPathBySlug(p.slug)}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  )
}
