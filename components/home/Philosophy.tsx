'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface PhilosophyProps {
  title: string
  content: string
}

export default function Philosophy({ title, content }: PhilosophyProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('.philosophy-content', {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    })
  }, { scope: sectionRef, dependencies: [] })

  return (
    <section
      ref={sectionRef}
      className="bg-cream py-[120px] px-8 flex justify-center"
    >
      <div className="philosophy-content max-w-[800px] text-center">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-8">{title}</p>
        <blockquote
          className="font-display italic text-[clamp(20px,2.5vw,36px)] text-base leading-[1.2]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  )
}
