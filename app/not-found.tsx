import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className="relative min-h-screen bg-ink text-paper flex items-center">

      {/* Faint background numeral */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-0 bottom-0 font-display text-paper/8 leading-none"
        style={{ fontSize: 'clamp(180px, 30vw, 360px)', lineHeight: 1 }}
      >
        404
      </span>

      <div className="container relative z-10 py-40">

        {/* Eyebrow */}
        <p className="eyebrow text-green mb-8">Error 404</p>

        {/* Heading */}
        <h1 className="display-1 text-paper max-w-[16ch] leading-[1.05] mb-6">
          This path leads<br />nowhere.
        </h1>

        {/* Divider */}
        <div className="w-10 h-px bg-green mb-8" />

        {/* Body */}
        <p className="text-paper/50 text-sm leading-relaxed max-w-sm mb-12">
          The page you were looking for has wandered off. Let&apos;s get you back on track.
        </p>

        {/* CTA */}
        <Link href="/" className={buttonVariants({ variant: 'ghost' })}>
          Return Home
        </Link>

      </div>
    </section>
  )
}
