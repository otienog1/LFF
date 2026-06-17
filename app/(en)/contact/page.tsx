import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import ContactForm from '@/components/contact/ContactForm'
import { getPage } from '@/lib/content'
import type { ContactBlock as ContactBlockType } from '@/types/content'

export function generateMetadata(): Metadata {
  const page = getPage('/contact')
  return { title: page?.seo.title, description: page?.seo.description }
}

export default async function ContactPage() {
  setRequestLocale('en')
  const t = await getTranslations('contact')
  const page = getPage('/contact')
  const [hero] = (page?.blocks ?? []) as [ContactBlockType]

  return (
    <>
      <section className="bg-paper min-h-svh grid grid-cols-1 lg:grid-cols-2">

        {/* Left: editorial panel */}
        <div className="bg-ink text-paper flex flex-col px-10 py-20 lg:sticky lg:top-0 lg:h-svh">
          <p className="eyebrow text-paper/70! mb-6">{hero?.subtitle ?? 'Get in touch'}</p>
          <h1 className="display-1 text-paper leading-tight mb-8">
            {(hero?.title ?? "We'd love to\nhear from you.").split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h1>
          <div className="w-8 h-px bg-green mb-10" />

          <div className="space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-3">{t('emailLabel')}</p>
              <a
                href="mailto:info@theluigifootprints.org"
                className="text-sm text-paper/70 hover:text-paper transition-colors duration-200"
              >
                info@theluigifootprints.org
              </a>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-4">{t('followLabel')}</p>
              <div className="flex gap-5 text-sm text-paper/70">
                <a href="https://www.instagram.com/maniagosafaris/" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors duration-200">Instagram</a>
                <a href="https://www.facebook.com/ManiagoSafarisEastAfrica" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors duration-200">Facebook</a>
                <a href="https://www.youtube.com/channel/UCVmNdFZ3SvfszacIMCfpPHg" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors duration-200">YouTube</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form panel */}
        <div className="bg-paper text-ink flex flex-col justify-center px-10 pt-16 lg:pt-0 pb-16 min-h-svh">
          <ContactForm />
        </div>

      </section>
    </>
  )
}
