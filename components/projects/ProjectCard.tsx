'use client'

import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { projectPathBySlug } from '@/lib/projects'

interface ProjectCardProps {
  title: string
  slug: string
  image: { sourceUrl: string }
  tag?: string
  tall?: boolean
}

export default function ProjectCard({ title, slug, image, tag, tall }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (!cardRef.current) return
    const img = cardRef.current.querySelector('.pc-img')
    const hover = cardRef.current.querySelector('.pc-hover')
    if (img) gsap.to(img, { scale: 1.06, duration: 0.6, ease: 'power2.out' })
    if (hover) gsap.to(hover, { opacity: 1, duration: 0.4 })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    const img = cardRef.current.querySelector('.pc-img')
    const hover = cardRef.current.querySelector('.pc-hover')
    if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' })
    if (hover) gsap.to(hover, { opacity: 0, duration: 0.4 })
  }

  return (
    <Link href={projectPathBySlug(slug)} className="block group">
      <div
        ref={cardRef}
        className={`relative overflow-hidden ${tall ? 'aspect-3/4' : 'aspect-4/3'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={image.sourceUrl}
          alt={title}
          className="pc-img w-full h-full object-cover"
        />
        {/* Permanent bottom gradient for title readability */}
        <div className="absolute inset-0 bg-linear-to-t from-base/90 via-base/20 to-transparent" />
        {/* Hover darkening */}
        <div className="pc-hover absolute inset-0 bg-base/20 opacity-0" />
        {/* Title — always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {tag && (
            <p className="font-body text-[9px] uppercase tracking-[0.2em] text-gold mb-2">{tag}</p>
          )}
          <h3 className="font-display italic text-[22px] text-cream leading-tight">
            {title}
          </h3>
          <span className="inline-block mt-3 font-body text-[9px] uppercase tracking-[0.2em] text-gold/0 group-hover:text-gold transition-colors duration-300">
            View project →
          </span>
        </div>
      </div>
    </Link>
  )
}
