import Link from 'next/link'

interface CtaStripProps {
  title: string
  content: string
}

export default function CtaStrip({ title, content }: CtaStripProps) {
  return (
    <section className="bg-cream py-[120px] px-8 text-center">
      <div className="max-w-[640px] mx-auto">
        <h2 className="font-display italic text-[clamp(22px,2.5vw,36px)] text-base leading-[1.1] mb-6">
          {title}
        </h2>
        <p className="font-body font-light text-[16px] text-[#665f4b] leading-relaxed mb-10"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <Link
          href="/donate"
          className="inline-block font-body text-[11px] uppercase tracking-[0.15em] bg-gold text-base px-8 py-3 hover:bg-gold-light transition-colors duration-200"
        >
          Donate
        </Link>
      </div>
    </section>
  )
}
