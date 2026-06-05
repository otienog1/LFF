'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface LuigiSectionProps {
  images: { image1: { sourceUrl: string }; image2: { sourceUrl: string } }
  title: string
  text: string
  text1: string
  text2: string
}

export default function LuigiSection({ images, title, text, text1, text2 }: LuigiSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Parallax background
    gsap.to(bgRef.current, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    // Text reveal
    gsap.from('.luigi-content', {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
    })
  }, { scope: sectionRef, dependencies: [] })

  return (
    <section ref={sectionRef} className="relative h-[70vh] overflow-hidden flex items-center justify-center">
      {/* Parallax background */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-[130%] bg-cover bg-center"
        style={{ backgroundImage: `url(${images.image1.sourceUrl})` }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(26,21,16,0.60)]" />

      {/* Content */}
      <div className="luigi-content relative z-10 max-w-[800px] mx-auto px-8 text-center">
        <h2 className="font-display italic text-[clamp(28px,4vw,52px)] text-cream leading-[1.15] mb-6"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="font-body font-light text-[15px] text-cream/70 leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: text }}
        />
        <p className="font-body font-light text-[13px] text-gold uppercase tracking-[0.15em]"
          dangerouslySetInnerHTML={{ __html: text1 }}
        />
      </div>
    </section>
  )
}
