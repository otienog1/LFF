import type { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import ProjectsClient from '@/components/projects/ProjectsClient'
import { getOurProjects } from '@/lib/pages'
import { getMoreProjects } from '@/lib/projects'

export const metadata: Metadata = { title: 'Our Projects' }

export default async function ProjectsPage() {
  const { page } = await getOurProjects()
  const moreProjects = await getMoreProjects(20)

  return (
    <Layout>
      {/* Minimal hero */}
      <section className="bg-base pt-40 pb-20 px-8">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-6">
            {page.pageTitle}
          </p>
          <h1 className="font-display italic text-[clamp(48px,6vw,72px)] text-cream leading-[1.0] max-w-xl">
            Conservation in Action
          </h1>
        </div>
      </section>

      <ProjectsClient
        featuredProjects={page.projects}
        moreProjects={moreProjects}
        sectionTitle={page.projectsSectionTitle}
        introText={page.projectsText}
      />
    </Layout>
  )
}
