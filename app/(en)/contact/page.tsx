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
    <section className="grid grid-cols-1 lg:grid-cols-2">

      {/* Left: editorial panel */}
      <div className="bg-ink text-paper flex flex-col px-8 md:px-16 pt-32 pb-16
                      lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)] lg:justify-between lg:pt-16">
        <div>
          <p className="eyebrow text-paper/50 mb-6">{hero?.subtitle ?? 'Get in touch'}</p>
          <h1 className="display-1 text-paper leading-[1.05] max-w-[14ch]">
            {(hero?.title ?? "We'd love to\nhear from you.").split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h1>
          <div className="mt-8 w-8 h-px bg-green" />
        </div>

        <div className="mt-16 lg:mt-0 space-y-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-paper/40 mb-3">{t('emailLabel')}</p>
            <a
              href="mailto:info@theluigifootprints.org"
              className="text-sm text-paper/70 hover:text-paper transition-colors duration-200"
            >
              info@theluigifootprints.org
            </a>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-paper/40 mb-4">{t('followLabel')}</p>
            <div className="flex gap-6 text-sm text-paper/60">
              <a href="https://www.instagram.com/maniagosafaris/" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors duration-200">Instagram</a>
              <a href="https://www.facebook.com/ManiagoSafarisEastAfrica" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors duration-200">Facebook</a>
              <a href="https://www.youtube.com/channel/UCVmNdFZ3SvfszacIMCfpPHg" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors duration-200">YouTube</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="bg-paper text-ink flex flex-col justify-center px-8 md:px-16
                      py-16 lg:py-24 lg:min-h-[calc(100svh-4rem)]">
        <div className="max-w-md w-full mx-auto">
          <p className="eyebrow text-ink/40 mb-10">{hero?.subtitle ?? 'Get in touch'}</p>
          <ContactForm />
        </div>
      </div>

    </section>
  )
}
