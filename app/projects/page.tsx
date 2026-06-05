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
      {/* Page header */}
      <section className="bg-base pt-40 pb-16 px-8">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-4">
              {page.pageTitle}
            </p>
            <h1 className="font-display italic text-[clamp(40px,5vw,68px)] text-cream leading-tight">
              Conservation<br />in Action
            </h1>
          </div>
          <div>
            <p className="font-body font-light text-[15px] text-muted leading-[1.8]">
              {page.projectsText.replace(/<[^>]*>/g, '')}
            </p>
          </div>
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
