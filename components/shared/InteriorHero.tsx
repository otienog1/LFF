'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { ImageRef } from '@/types/content';
import { SmartImage } from '@/components/ui/SmartImage';
import { isPending } from '@/components/shared/PendingPhoto';
import { usePointerDrift } from '@/components/motion/usePointerDrift';
import { whenRevealed } from '@/components/motion/transitionGate';
import { fade, fadeFrom, rise, riseFrom, settle, STAGGER } from '@/components/motion/presets';
import { typeset } from '@/lib/typeset';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Distance from the viewport edge to the container edge, as in Chapter: where the page grid's column rules sit. */
const EDGE = 'calc((100% - min(var(--container-w), 100%)) / 2)';

/**
 * Interior page hero. A full-bleed photograph at interior height, without the
 * home page's frame and corner notes: the words rise out of a mask after the
 * curtain lifts while the photograph settles from a slight zoom, and the
 * subtitle follows. On scroll it drifts slower than the page and darkens; a
 * fine pointer leans it a few pixels. `lead` is an optional line above the
 * title, a way back to a parent page, say. The page renders its own opening
 * paragraph beneath.
 */
export function InteriorHero({
  block,
  lead,
}: {
  block: { title?: string; subtitle?: string; image?: ImageRef | null };
  lead?: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const title = typeset(block.title ?? '');
  const words = title.split(/\s+/).filter(Boolean);
  // A photograph the foundation has yet to supply is not shown at hero scale: the hero opens on ink instead.
  const image = block.image && !isPending(block.image) ? block.image : null;

  usePointerDrift(root, '[data-media]');

  useGSAP((_, contextSafe) => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const hasMedia = Boolean(root.current?.querySelector('[data-media]'));
      gsap.set('[data-word]', riseFrom());
      gsap.set('[data-aside]', fadeFrom());
      if (hasMedia) gsap.set('[data-media]', { scale: 1.08 });

      let cancelled = false;
      // Photograph first (settling from the zoom), then the title, then the line above it and the subtitle.
      whenRevealed().then(contextSafe((gated: boolean) => {
        if (cancelled) return;
        const tl = gsap.timeline({ delay: gated ? 0.2 : 0.1 });
        if (hasMedia) tl.to('[data-media]', settle({ scale: 1.03 }), 0);
        tl.to('[data-word]', rise({ stagger: STAGGER.words }), 0.1)
          .to('[data-aside]', fade(), 0.6);
      }));

      const scroll = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      if (hasMedia) gsap.to('[data-media]', { yPercent: 16, ease: 'none', scrollTrigger: scroll });
      gsap.to('[data-shade]', { opacity: 0.5, ease: 'none', scrollTrigger: scroll });

      return () => { cancelled = true; };
    });
  }, { scope: root });

  return (
    <section ref={root} className={cn('relative flex items-end overflow-hidden bg-ink', image ? 'min-h-[82svh]' : 'min-h-[64svh]')}>
      {image ? (
        <>
          <div data-media className="absolute inset-0 will-change-transform">
            <SmartImage image={image} priority sizes="100vw" />
            <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/30 to-ink/10" />
          </div>
          {/* The header is transparent over this hero: a shade from the top keeps its links legible on any photograph. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-ink/55 to-transparent md:h-48" />
        </>
      ) : (
        <>
          {/* No photograph: the chapter grid's column rules carry up into the hero, so it reads as the first chapter. */}
          {/* They start below the header's band (64px, 96px from xl) so they never cross the wordmark. */}
          <span aria-hidden="true" className="absolute top-16 bottom-0 hidden w-px bg-paper/10 lg:block xl:top-24" style={{ left: EDGE }} />
          <span aria-hidden="true" className="absolute top-16 bottom-0 hidden w-px bg-paper/10 lg:block xl:top-24" style={{ right: EDGE }} />
        </>
      )}
      <div data-shade className="absolute inset-0 bg-ink opacity-0 pointer-events-none" />

      <div className="relative container pb-14 pt-40 text-paper md:pb-20">
        {lead && <div data-aside className="mb-6">{lead}</div>}
        <h1
          aria-label={title}
          className="font-display font-medium leading-[1.02] tracking-[-0.015em] max-w-[16ch] text-balance"
          style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}
        >
          {words.map((word, i) => (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em] mr-[0.22em]">
              <span data-word className="inline-block">{word}</span>
            </span>
          ))}
        </h1>
        {block.subtitle && (
          <div data-aside>
            <p className="mt-5 max-w-[48ch] text-sm tracking-wide text-paper/80 md:text-base">{block.subtitle}</p>
          </div>
        )}
      </div>
    </section>
  );
}
