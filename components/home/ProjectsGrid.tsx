'use client'

import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface ProjectEntry {
  image: { sourceUrl: string }
  text: string
}

interface ProjectsGridProps {
  projects: Record<string, ProjectEntry>
  title: string
  text: string
}

export default function ProjectsGrid({ projects, title, text }: ProjectsGridProps) {
  const sectionRef = useRef<HTMLElement>(null)
  // Runtime data shape: Array<Record<string, ProjectEntry>> — flatten before slicing
  const rawGroups = projects as unknown as Array<Record<string, ProjectEntry>>
  const entries = rawGroups.flatMap(group => Object.values(group)).slice(0, 3)

  useGSAP(() => {
    gsap.from('.home-project-card', {
      opacity: 0,
      y: 60,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
    })
  }, { scope: sectionRef, dependencies: [] })

  return (
    <section ref={sectionRef} className="bg-surface py-[120px] px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-4">Selected Work</p>
            <h2 className="font-display italic text-[clamp(32px,4vw,52px)] text-cream leading-[1.1]">
              {title}
            </h2>
          </div>
          <p className="font-body font-light text-[14px] text-muted max-w-xs" dangerouslySetInnerHTML={{ __html: text }} />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {entries.map((entry, i) => (
            <HomeProjectCard key={i} entry={entry} />
          ))}
        </div>

        {/* Link */}
        <div className="text-center">
          <Link
            href="/projects"
            className="font-body text-[11px] uppercase tracking-[0.15em] text-gold border-b border-gold pb-0.5 hover:text-gold-light hover:border-gold-light transition-colors duration-200"
          >
            View all projects →
          </Link>
        </div>
      </div>
    </section>
  )
}

function HomeProjectCard({ entry }: { entry: ProjectEntry }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (!cardRef.current) return
    const overlay = cardRef.current.querySelector('.card-overlay')
    const img = cardRef.current.querySelector('.card-img')
    if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.3 })
    if (img) gsap.to(img, { scale: 1.05, duration: 0.4 })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    const overlay = cardRef.current.querySelector('.card-overlay')
    const img = cardRef.current.querySelector('.card-img')
    if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 })
    if (img) gsap.to(img, { scale: 1, duration: 0.4 })
  }

  return (
    <div
      ref={cardRef}
      className="home-project-card relative overflow-hidden aspect-[3/4] cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={entry.image.sourceUrl}
        alt=""
        aria-hidden="true"
        className="card-img w-full h-full object-cover"
      />
      <div className="card-overlay absolute inset-0 bg-[rgba(26,21,16,0.6)] opacity-0 flex items-end p-6">
        <p className="font-display italic text-[22px] text-cream leading-tight">{entry.text}</p>
      </div>
    </div>
  )
}
