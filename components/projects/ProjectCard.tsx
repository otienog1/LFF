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
    const overlay = cardRef.current.querySelector('.pc-overlay')
    const img = cardRef.current.querySelector('.pc-img')
    const titleEl = cardRef.current.querySelector('.pc-title')
    if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.35 })
    if (img) gsap.to(img, { scale: 1.05, duration: 0.45 })
    if (titleEl) gsap.from(titleEl, { y: 16, opacity: 0, duration: 0.3 })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    const overlay = cardRef.current.querySelector('.pc-overlay')
    const img = cardRef.current.querySelector('.pc-img')
    if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 })
    if (img) gsap.to(img, { scale: 1, duration: 0.4 })
  }

  return (
    <Link href={projectPathBySlug(slug)}>
      <div
        ref={cardRef}
        className={`relative overflow-hidden cursor-pointer ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={image.sourceUrl}
          alt={title}
          className="pc-img w-full h-full object-cover"
        />
        <div className="pc-overlay absolute inset-0 bg-[rgba(26,21,16,0.65)] opacity-0 flex flex-col justify-end p-6">
          {tag && (
            <span className="font-body text-[9px] uppercase tracking-[0.15em] text-gold border border-green px-2 py-0.5 w-fit mb-3 bg-green/20">
              {tag}
            </span>
          )}
          <h3 className="pc-title font-display italic text-[24px] text-cream leading-tight">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
