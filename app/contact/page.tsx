import type { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import ContactForm from '@/components/contact/ContactForm'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <Layout>
      <section className="bg-base min-h-svh pt-40 pb-20 px-8">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* Left: info */}
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-6">Get in touch</p>
            <h1 className="font-display italic text-[clamp(40px,5vw,64px)] text-cream leading-[1.05] mb-12">
              We&apos;d love to<br />hear from you
            </h1>
            <div className="space-y-6">
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.15em] text-gold mb-2">Email</p>
                <a
                  href="mailto:info@theluigifootprints.org"
                  className="font-body font-light text-[15px] text-muted hover:text-cream transition-colors duration-200"
                >
                  info@theluigifootprints.org
                </a>
              </div>
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.15em] text-gold mb-3">Follow</p>
                <div className="flex gap-6">
                  <a href="https://www.instagram.com/maniagosafaris/" target="_blank" rel="noreferrer"
                    className="font-body text-[12px] text-muted hover:text-cream transition-colors duration-200">Instagram</a>
                  <a href="https://www.facebook.com/ManiagoSafarisEastAfrica" target="_blank" rel="noreferrer"
                    className="font-body text-[12px] text-muted hover:text-cream transition-colors duration-200">Facebook</a>
                  <a href="https://www.youtube.com/channel/UCVmNdFZ3SvfszacIMCfpPHg" target="_blank" rel="noreferrer"
                    className="font-body text-[12px] text-muted hover:text-cream transition-colors duration-200">YouTube</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </Layout>
  )
}
