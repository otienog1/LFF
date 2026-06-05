'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import ProjectCard from './ProjectCard'
import ProjectFilter from './ProjectFilter'
import type { MoreProject } from '@/types'

gsap.registerPlugin(ScrollTrigger)

interface FeaturedProject {
  image: { sourceUrl: string }
  title: string
  slug: string
}

interface ProjectsClientProps {
  featuredProjects: FeaturedProject[]
  moreProjects: MoreProject[]
  sectionTitle: string
  introText: string
}

const ALL_TAGS = ['Wildlife', 'Community', 'Youth']

export default function ProjectsClient({
  featuredProjects,
  moreProjects,
  sectionTitle,
  introText,
}: ProjectsClientProps) {
  const [activeTag, setActiveTag] = useState('All')
  const gridRef = useRef<HTMLDivElement>(null)

  const visibleProjects = activeTag === 'All'
    ? moreProjects
    : moreProjects.filter(p =>
        (p as unknown as { typesOfProjects?: Array<{ name: string }> })
          .typesOfProjects?.some(t => t.name === activeTag)
      )

  useGSAP(() => {
    gsap.from('.projects-card', {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: gridRef.current, start: 'top 75%' },
    })
  }, { scope: gridRef, dependencies: [] })

  return (
    <section className="bg-base py-[80px] px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Featured */}
        <div className="mb-20">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-8">{sectionTitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((p, i) => (
              <div key={p.slug} className="projects-card">
                <ProjectCard title={p.title} slug={p.slug} image={p.image} tall={i % 2 === 1} />
              </div>
            ))}
          </div>
        </div>

        {/* All projects with filter */}
        <div className="border-t border-border pt-16">
          <ProjectFilter tags={ALL_TAGS} active={activeTag} onChange={setActiveTag} />
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleProjects.map((p, i) => (
              <div key={p.slug} className="projects-card">
                <ProjectCard
                  title={p.title}
                  slug={p.slug}
                  image={{ sourceUrl: p.image.sourceUrl }}
                  tall={i % 3 === 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
