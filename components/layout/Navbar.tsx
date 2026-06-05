'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const links = [
  { href: '/our-story', label: 'Story' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuLinksRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useGSAP(() => {
    if (!menuRef.current || !menuLinksRef.current) return
    if (menuOpen) {
      gsap.set(menuRef.current, { display: 'flex' })
      gsap.to(menuRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.from(menuLinksRef.current.children, {
        opacity: 0, y: 24, stagger: 0.08, duration: 0.4, ease: 'power2.out',
      })
    } else {
      gsap.to(menuRef.current, {
        opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => gsap.set(menuRef.current, { display: 'none' }),
      })
    }
  }, { dependencies: [menuOpen] })

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between',
          'px-8 md:px-12 h-16 transition-all duration-300',
          scrolled
            ? 'bg-[rgba(26,21,16,0.92)] backdrop-blur-[12px]'
            : 'bg-transparent',
        ].join(' ')}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-display not-italic text-[11px] tracking-[0.25em] uppercase text-cream"
        >
          Luigi Footprints Foundation
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="group relative font-body text-[11px] uppercase tracking-[0.12em] text-cream/70 hover:text-cream transition-colors duration-200"
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 w-full h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left" />
            </Link>
          ))}
          <Link
            href="/donate"
            className="font-body text-[11px] uppercase tracking-[0.12em] text-gold border border-gold px-4 py-1.5 hover:bg-gold hover:text-base transition-all duration-200"
          >
            Donate →
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-cream transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-cream transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-cream transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 bg-base hidden opacity-0 flex-col items-center justify-center"
      >
        <ul ref={menuLinksRef} className="flex flex-col items-center gap-10">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className="font-display italic text-5xl text-cream hover:text-gold transition-colors duration-200"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/donate"
              onClick={() => setMenuOpen(false)}
              className="font-display italic text-5xl text-gold"
            >
              Donate →
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
