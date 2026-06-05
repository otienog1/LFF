import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
  { href: '/donate', label: 'Donate' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0f0d09] pt-16 pb-8">
      {/* Top gold rule */}
      <div className="flex justify-center mb-16">
        <div className="w-10 h-px bg-gold" />
      </div>

      <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Col 1: Identity */}
        <div>
          <p className="font-display not-italic text-[11px] uppercase tracking-[0.2em] text-cream mb-3">
            Luigi Footprints Foundation
          </p>
          <p className="font-body text-[12px] text-muted leading-relaxed">
            Conserving wildlife and empowering communities across East Africa.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.15em] text-gold mb-4">Navigation</p>
          <ul className="space-y-2">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-body text-[12px] text-muted hover:text-cream transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Contact */}
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.15em] text-gold mb-4">Contact</p>
          <a
            href="mailto:info@theluigifootprints.org"
            className="font-body text-[12px] text-muted hover:text-cream transition-colors duration-200 block mb-4"
          >
            info@theluigifootprints.org
          </a>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/maniagosafaris/" target="_blank" rel="noreferrer" className="font-body text-[11px] uppercase tracking-[0.1em] text-muted hover:text-gold transition-colors duration-200">Instagram</a>
            <a href="https://www.facebook.com/ManiagoSafarisEastAfrica" target="_blank" rel="noreferrer" className="font-body text-[11px] uppercase tracking-[0.1em] text-muted hover:text-gold transition-colors duration-200">Facebook</a>
            <a href="https://www.youtube.com/channel/UCVmNdFZ3SvfszacIMCfpPHg" target="_blank" rel="noreferrer" className="font-body text-[11px] uppercase tracking-[0.1em] text-muted hover:text-gold transition-colors duration-200">YouTube</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1280px] mx-auto px-8 border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="font-body text-[11px] text-muted">
          © {new Date().getFullYear()} Luigi Footprints Foundation
        </p>
        <p className="font-body text-[11px] text-muted">
          In partnership with <span className="text-gold">·</span> Maniago Safaris
        </p>
      </div>
    </footer>
  )
}
