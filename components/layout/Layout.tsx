'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import { NextIntlClientProvider } from 'next-intl'
import Navbar from './Navbar'
import Footer from './Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import en from '@/messages/en.json'
import es from '@/messages/es.json'
import pt from '@/messages/pt.json'

const ALL_MESSAGES = { en, es, pt } as const

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const mainRef = useRef<HTMLElement>(null)

  const pathname = usePathname()

  const locale = useMemo(() => {
    if (pathname.startsWith('/es/') || pathname === '/es') return 'es'
    if (pathname.startsWith('/pt/') || pathname === '/pt') return 'pt'
    return 'en'
  }, [pathname])

  const messages = ALL_MESSAGES[locale]

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

  // Reset scroll to top on every client-side navigation
  useEffect(() => {
    if (!lenis) return
    lenis.scrollTo(0, { immediate: true })
  }, [pathname, lenis])

  useGSAP(() => {
    if (!mainRef.current) return
    gsap.from(mainRef.current, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
    })
  }, { scope: mainRef, dependencies: [] })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LenisContext.Provider value={lenis}>
        <Navbar />
        <main ref={mainRef} className="min-h-screen">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </LenisContext.Provider>
    </NextIntlClientProvider>
  )
}
