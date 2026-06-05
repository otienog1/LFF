'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import TeamSheet, { type TrusteeData } from './TeamSheet'

gsap.registerPlugin(ScrollTrigger)

interface TeamGridProps {
  title: [string, string]
  members: TrusteeData[]
}

export default function TeamGrid({ title, members }: TeamGridProps) {
  const [selected, setSelected] = useState<TrusteeData | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('.team-member', {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
    })
  }, { scope: sectionRef, dependencies: [] })

  return (
    <>
      <section ref={sectionRef} className="bg-base py-[120px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-16">
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-4">The Team</p>
            <h2 className="font-display italic text-[clamp(32px,4vw,52px)] text-cream leading-[1.1]">
              {title[0]}{' '}{title[1]}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {members.map(member => (
              <button
                key={member.name}
                onClick={() => setSelected(member)}
                className="team-member text-left group"
              >
                <div className="overflow-hidden aspect-square mb-4">
                  <img
                    src={member.thumb.sourceUrl}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[400ms]"
                  />
                </div>
                <h4 className="font-display italic text-[18px] text-cream leading-tight mb-1">
                  {member.name}
                </h4>
                <p className="font-body text-[11px] uppercase tracking-[0.1em] text-gold">
                  {member.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>
      <TeamSheet member={selected} onClose={() => setSelected(null)} />
    </>
  )
}
