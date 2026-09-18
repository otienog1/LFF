'use client';
import '../styles/globals.css';

/**
 * The last resort: shown only when the root layout itself fails, so nothing
 * of the site (fonts, navigation, translations) can be relied on. Plain
 * English, the site's colours from the stylesheet, system fallbacks for
 * the type, a way to try again and a way home.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-ink text-paper" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <main className="container flex min-h-svh flex-col justify-center py-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-paper/70">500 · Something went wrong</p>
          <h1 className="mt-8 max-w-[14ch] text-[clamp(2.25rem,5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.01em]" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
            Something went wrong on our side.
          </h1>
          <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-paper/70">
            An error stopped this page from loading. Try again, or go back to the homepage. If it keeps happening, write to us at info@theluigifootprints.org.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <button type="button" onClick={reset} className="h-12 bg-green px-8 text-[13px] font-medium uppercase tracking-[0.14em] text-paper">
              Try again
            </button>
            <a href="/" className="border-b border-paper/40 pb-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-paper/80 hover:text-paper">
              Back to the homepage
            </a>
          </div>
          {error?.digest && <p className="mt-8 text-xs text-paper/50">Reference: <span className="font-mono">{error.digest}</span></p>}
        </main>
      </body>
    </html>
  );
}
