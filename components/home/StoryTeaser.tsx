'use client'

import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface StoryTeaserProps {
  title: string
  intro: string
  content: string
  image: string
}

export default function StoryTeaser({ title, intro, content, image }: StoryTeaserProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Text reveal
    gsap.from('.teaser-text', {
      opacity: 0,
      x: -40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
    })
    // Parallax on image
    gsap.to(imageRef.current, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, { scope: sectionRef, dependencies: [] })

  return (
    <section
      ref={sectionRef}
      className="bg-base py-[120px] px-8"
    >
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div className="teaser-text">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-6">Our Story</p>
          <h2 className="font-display italic text-[clamp(32px,4vw,48px)] text-cream leading-[1.1] mb-6">
            {title}
          </h2>
          <p
            className="font-body font-light text-[16px] text-muted leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: intro }}
          />
          <p
            className="font-body font-light text-[16px] text-muted leading-relaxed mb-8"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <Link
            href="/our-story"
            className="font-body text-[11px] uppercase tracking-[0.15em] text-gold border-b border-gold pb-0.5 hover:text-gold-light hover:border-gold-light transition-colors duration-200"
          >
            Read more →
          </Link>
        </div>

        {/* Right: parallax image */}
        <div className="relative h-[500px] overflow-hidden">
          <div
            ref={imageRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-[120%] bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
      </div>
    </section>
  )
}
