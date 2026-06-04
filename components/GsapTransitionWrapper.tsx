'use client'

import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { SwitchTransition, Transition } from 'react-transition-group'
import gsap from 'gsap'

interface Props {
  children: React.ReactNode
}

export default function GsapTransitionWrapper({ children }: Props) {
  const overlay = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const resetOverlay = () => {
    gsap.set(overlay.current, { yPercent: 'unset', height: '0%' })
  }

  function enter() {
    window.scrollTo(0, 0)
    gsap.timeline({ defaults: { duration: 1 }, onComplete: () => resetOverlay() })
      .set(overlay.current, { height: '100%' })
      .to(overlay.current, { yPercent: -100, ease: 'power3.inOut' }, 1)
  }

  function exit() {
    gsap.timeline({ defaults: { duration: 1 } })
      .to(overlay.current, { height: '100%', ease: 'power3.inOut' }, 1)
  }

  return (
    <SwitchTransition>
      <Transition
        key={pathname}
        timeout={2200}
        in={true}
        onEnter={enter}
        onExit={exit}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <>
          {children}
          <div ref={overlay} className="z-50 bg-lff_600 fixed w-full bottom-0 h-0" />
        </>
      </Transition>
    </SwitchTransition>
  )
}
