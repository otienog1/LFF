'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ProjectBodyProps {
  content: string | null
}

export default function ProjectBody({ content }: ProjectBodyProps) {
  const bodyRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!bodyRef.current) return
    const elements = bodyRef.current.querySelectorAll('p, h2, h3, img')
    if (elements.length === 0) return
    gsap.from(elements, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: bodyRef.current, start: 'top 80%' },
    })
  }, { scope: bodyRef, dependencies: [] })

  if (!content) return null

  return (
    <div
      ref={bodyRef}
      className="
        font-body font-light text-[17px] text-muted leading-[1.8]
        [&_h2]:font-display [&_h2]:italic [&_h2]:text-[32px] [&_h2]:text-cream [&_h2]:leading-tight [&_h2]:mt-12 [&_h2]:mb-4
        [&_h3]:font-display [&_h3]:italic [&_h3]:text-[24px] [&_h3]:text-cream [&_h3]:leading-tight [&_h3]:mt-8 [&_h3]:mb-3
        [&_p]:mb-6
        [&_img]:w-full [&_img]:my-10
        [&_a]:text-gold [&_a]:underline-offset-2 [&_a]:hover:text-gold-light
        [&_strong]:text-cream [&_strong]:font-normal
        [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-6 [&_blockquote]:font-display [&_blockquote]:italic [&_blockquote]:text-[24px] [&_blockquote]:text-cream [&_blockquote]:my-8
      "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
