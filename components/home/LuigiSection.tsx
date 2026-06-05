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
    <section ref={sectionRef} className="relative h-svh overflow-hidden flex items-center justify-center">
      {/* Parallax background */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-[130%] bg-cover bg-center"
        style={{ backgroundImage: `url(${images.image1.sourceUrl})` }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(26,21,16,0.60)]" />

      {/* Content */}
      <div className="luigi-content relative z-10 max-w-180 mx-auto px-8 text-center flex flex-col items-center">
        <p className="font-body text-[10px] uppercase tracking-[0.25em] text-gold mb-8">Who was Luigi</p>
        <div className="w-8 h-px bg-gold/60 mb-8" />
        <h2 className="font-display italic text-[clamp(40px,6vw,80px)] text-cream leading-[1.05] mb-8">
          Luigi Francescon
        </h2>
        <p className="font-body font-light text-[16px] text-cream/70 leading-[1.9] mb-6 max-w-lg">
          {text.replace(/<[^>]*>/g, '')}
        </p>
        <p className="font-body font-light text-[16px] text-cream/70 leading-[1.9] max-w-lg">
          {text1.replace(/<[^>]*>/g, '')}
        </p>
      </div>
    </section>
  )
}
