import type { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import ContactForm from '@/components/contact/ContactForm'

export const metadata: Metadata = { title: 'Contact' }

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  )
}

export default function ContactPage() {
  return (
    <Layout>
      <section className="bg-base min-h-svh grid grid-cols-1 lg:grid-cols-2">

        {/* Left: editorial panel */}
        <div className="bg-surface flex flex-col px-10 py-20 lg:sticky lg:top-0 lg:h-svh">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-6">Get in touch</p>
          <h1 className="font-display italic text-7xl text-cream leading-tight mb-8">
            We&apos;d love to hear from you.
          </h1>
          <div className="w-8 h-px bg-gold mb-10" />

          <div className="space-y-8">
            <div>
              <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted mb-3">Email</p>
              <a
                href="mailto:info@theluigifootprints.org"
                className="font-body font-light text-[15px] text-muted hover:text-cream transition-colors duration-200"
              >
                info@theluigifootprints.org
              </a>
            </div>

            <div>
              <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted mb-4">Follow</p>
              <div className="flex gap-5">
                <a
                  href="https://www.instagram.com/maniagosafaris/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="text-muted hover:text-gold transition-colors duration-200"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.facebook.com/ManiagoSafarisEastAfrica"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="text-muted hover:text-gold transition-colors duration-200"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCVmNdFZ3SvfszacIMCfpPHg"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="text-muted hover:text-gold transition-colors duration-200"
                >
                  <YoutubeIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form panel */}
        <div className="flex flex-col justify-center px-10 pt-16 lg:pt-0 pb-16 min-h-svh">
          <ContactForm />
        </div>

      </section>
    </Layout>
  )
}
