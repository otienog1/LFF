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
      y: 40,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
    })
  }, { scope: gridRef, dependencies: [activeTag] })

  const [hero, ...rest] = featuredProjects

  return (
    <section className="bg-base pb-24 px-8">
      <div className="max-w-[1280px] mx-auto">

        {/* Featured — hero + supporting */}
        {hero && (
          <div className="mb-6">
            {/* Hero card — full width */}
            <div className="projects-card mb-6">
              <div className="relative overflow-hidden aspect-video group">
                <img
                  src={hero.image.sourceUrl}
                  alt={hero.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-base/90 via-base/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-10">
                  <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-3">{sectionTitle}</p>
                  <h2 className="font-display italic text-[clamp(28px,4vw,52px)] text-cream leading-tight">
                    {hero.title}
                  </h2>
                  <span className="inline-block mt-4 font-body text-[10px] uppercase tracking-[0.2em] text-gold/0 group-hover:text-gold transition-colors duration-300">
                    View project →
                  </span>
                </div>
              </div>
            </div>

            {/* Supporting cards */}
            {rest.length > 0 && (
              <div className={`grid gap-6 ${rest.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                {rest.map(p => (
                  <div key={p.slug} className="projects-card">
                    <ProjectCard title={p.title} slug={p.slug} image={p.image} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Divider + filter */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 border-t border-border pt-12 mb-10">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted shrink-0">All projects</p>
          <div className="flex-1 h-px bg-border hidden md:block" />
          <ProjectFilter tags={ALL_TAGS} active={activeTag} onChange={setActiveTag} />
        </div>

        {/* All projects — uniform 3-col grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.map(p => (
            <div key={p.slug} className="projects-card">
              <ProjectCard
                title={p.title}
                slug={p.slug}
                image={{ sourceUrl: p.image.sourceUrl }}
              />
            </div>
          ))}
        </div>

        {visibleProjects.length === 0 && (
          <p className="font-body font-light text-[14px] text-muted py-16 text-center">
            No projects found.
          </p>
        )}

      </div>
    </section>
  )
}
