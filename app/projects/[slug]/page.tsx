import type { Metadata } from 'next'
import Link from 'next/link'
import ProjectBody from '@/components/ProjectBody'
import { getProjectBySlug, getAllProjects, getRelatedProjects, projectPathBySlug } from '@/lib/projects'

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

  const relatedProjectsList = await getRelatedProjects(category ?? null, projectId)

  return (
    <>
      {/* Hero */}
      <section className="relative h-svh overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${project.featuredImage?.sourceUrl})` }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[rgba(26,21,16,0.5)]" />
        <div className="absolute bottom-16 left-0 right-0 max-w-[1280px] mx-auto px-8 z-10">
          {categoryName && (
            <span className="font-body text-[9px] uppercase tracking-[0.15em] text-gold border border-green px-2 py-0.5 bg-green/20 inline-block mb-4">
              {categoryName}
            </span>
          )}
          <h1 className="font-display italic text-[clamp(40px,5vw,64px)] text-cream leading-[1.05] max-w-2xl mb-3">
            {project.title}
          </h1>
          <p className="font-body text-[12px] uppercase tracking-[0.12em] text-cream/50">
            {new Date(project.date).getFullYear()}
          </p>
        </div>
      </section>

      {/* Back link */}
      <div className="max-w-[720px] mx-auto px-8 pt-16">
        <Link
          href="/projects"
          className="font-body text-[11px] uppercase tracking-[0.15em] text-gold hover:text-gold-light transition-colors duration-200"
        >
          ← All Projects
        </Link>
      </div>

      {/* Content */}
      <article className="max-w-[720px] mx-auto px-8 py-12">
        <ProjectBody content={project.content} />
      </article>

      {/* Related projects */}
      {relatedProjectsList.length > 0 && (
        <section className="bg-surface py-16 px-8">
          <div className="max-w-[1280px] mx-auto">
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-6">
              {categoryName ? `More from ${categoryName}` : 'More Projects'}
            </p>
            <ul className="flex flex-wrap gap-4">
              {relatedProjectsList.map(p => (
                <li key={p.title}>
                  <Link
                    href={projectPathBySlug(p.slug)}
                    className="font-body text-[12px] uppercase tracking-[0.1em] text-muted hover:text-cream border border-border px-4 py-2 hover:border-gold transition-all duration-200 block"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
