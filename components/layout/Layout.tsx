'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import Navbar from './Navbar'
import Footer from './Footer'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const lenisInstance = new Lenis({ autoRaf: false })
    setLenis(lenisInstance)

    const ticker = (time: number) => lenisInstance.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      lenisInstance.destroy()
    }
  }, [])

  useGSAP(() => {
    if (!mainRef.current) return
    gsap.from(mainRef.current, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all',
    })
  }, { scope: mainRef, dependencies: [] })

  return (
    <LenisContext.Provider value={lenis}>
      <Navbar />
      <main ref={mainRef}>
        {children}
      </main>
      <Footer />
    </LenisContext.Provider>
  )
}
