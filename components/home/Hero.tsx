'use client'

import { useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface SlideImages {
  image1: { sourceUrl: string }
  image2: { sourceUrl: string }
  image3: { sourceUrl: string }
}

interface HeroProps {
  slides: SlideImages
  intro: string
}

export default function Hero({ slides, intro }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null)
  const currentSlide = useRef(0)
  const images = useMemo(
    () => [slides.image1.sourceUrl, slides.image2.sourceUrl, slides.image3.sourceUrl],
    [slides.image1.sourceUrl, slides.image2.sourceUrl, slides.image3.sourceUrl]
  )

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.6, delay: 0.3 })
      .from('.hero-rule', { scaleX: 0, transformOrigin: 'left', duration: 0.5 }, '-=0.2')
      .from('.hero-headline', { opacity: 0, y: 40, duration: 0.9 }, '-=0.3')
      .from('.hero-body', { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
      .from('.hero-ctas', { opacity: 0, y: 16, duration: 0.5 }, '-=0.4')
      .from('.hero-scroll', { opacity: 0, duration: 0.5 }, '-=0.2')
  }, { scope: containerRef, dependencies: [] })

  useEffect(() => {
    const slideEls = containerRef.current?.querySelectorAll('.hero-slide')
    if (!slideEls || slideEls.length < 2) return

    const interval = setInterval(() => {
      const next = (currentSlide.current + 1) % images.length
      gsap.to(slideEls[currentSlide.current], { opacity: 0, duration: 1.2, ease: 'power2.inOut' })
      gsap.to(slideEls[next], { opacity: 1, duration: 1.2, ease: 'power2.inOut' })
      currentSlide.current = next
    }, 6000)

    return () => clearInterval(interval)
  }, [images])

  return (
    <section ref={containerRef} className="relative w-full h-svh overflow-hidden">
      {/* Background image stack */}
      {images.map((src, i) => (
        <div
          key={src}
          aria-hidden="true"
          className={`hero-slide absolute inset-0 bg-cover bg-center ${i === 0 ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      {/* Overlay */}
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(26,21,16,0.55)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full max-w-[1280px] mx-auto px-8 pb-20 md:pb-28">
        <p className="hero-eyebrow font-body text-[10px] uppercase tracking-[0.22em] text-gold mb-4">
          Wildlife · Community · Kenya
        </p>
        <div className="hero-rule w-10 h-px bg-gold mb-6" />
        <h1 className="hero-headline font-display italic text-[clamp(56px,8vw,96px)] leading-[1.0] text-cream mb-6 max-w-2xl">
          Rewild the World
        </h1>
        <p
          className="hero-body font-body font-light text-[16px] text-cream/80 mb-10 max-w-md leading-relaxed"
          dangerouslySetInnerHTML={{ __html: intro }}
        />
        <div className="hero-ctas flex flex-wrap gap-4">
          <Link
            href="/donate"
            className="font-body text-[11px] uppercase tracking-[0.12em] bg-gold text-base px-6 py-3 hover:bg-gold-light transition-colors duration-200"
          >
            Donate →
          </Link>
          <Link
            href="/our-story"
            className="font-body text-[11px] uppercase tracking-[0.12em] border border-cream/60 text-cream px-6 py-3 hover:border-cream transition-colors duration-200"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-body text-[9px] uppercase tracking-[0.2em] text-cream/40">Scroll</span>
        <div className="w-px h-10 bg-cream/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 bg-gold animate-[iconscroll_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  )
}
