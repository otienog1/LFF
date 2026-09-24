'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import { NextIntlClientProvider } from 'next-intl'
import Navbar from './Navbar'
import Footer from './Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { PageTransition } from './PageTransition'
import { LenisContext } from './LenisContext'
import en from '@/messages/en.json'
import es from '@/messages/es.json'
import pt from '@/messages/pt.json'

const ALL_MESSAGES = { en, es, pt } as const

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { LenisContext, useLenis } from './LenisContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  const pathname = usePathname()

  const locale = useMemo(() => {
    if (pathname.startsWith('/es/') || pathname === '/es') return 'es'
    if (pathname.startsWith('/pt/') || pathname === '/pt') return 'pt'
    return 'en'
  }, [pathname])

  const messages = ALL_MESSAGES[locale]

  useEffect(() => {
    // Webfont swap changes heights after ScrollTrigger has measured; re-measure once fonts are in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    // Smooth scrolling is bypassed entirely under prefers-reduced-motion: native scroll, no Lenis.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenisInstance = new Lenis({ autoRaf: false })
    setLenis(lenisInstance)

    const ticker = (time: number) => lenisInstance.raf(time * 1000)
    lenisInstance.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      lenisInstance.destroy()
      setLenis(null)
    }
  }, [])

  // Scroll on navigation (top, anchor, or the kept position on back/forward and reload) belongs to PageTransition,
  // which places each page before it measures and before its first frame is shown.

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Nairobi">
      <LenisContext.Provider value={lenis}>
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <BackToTop />
      </LenisContext.Provider>
    </NextIntlClientProvider>
  )
}
