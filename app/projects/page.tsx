import type { Metadata } from 'next'
import Layout from '@/components/Layout'
import MoreProjects from '@/components/MoreProjects'
import HeroProject from '@/components/HeroProject'
import Intro from '@/components/Intro'
import { getOurProjects } from '@/lib/pages'
import { getMoreProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Our Projects',
}

export default async function ProjectsPage() {
  const { page } = await getOurProjects()
  const moreProjects = await getMoreProjects(5)

  return (
    <Layout>
      <Intro title={page.pageTitle} text={page.projectsText} />
      <section className="py-28 md:min-h-screen bg-lff_600 border-t border-lff_500">
        {page.projects && (
          <HeroProject
            projects={page.projects}
            title={page.projectsSectionTitle}
          />
        )}
      </section>
      <section className="py-28 min-h-screen flex justify-center bg-lff_600 border-t border-lff_500">
        {moreProjects.length > 0 && <MoreProjects projects={moreProjects} />}
      </section>
    </Layout>
  )
}
