'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { ImageRef } from '@/types/content';
import { SmartImage } from '@/components/ui/SmartImage';
import { usePointerDrift } from '@/components/motion/usePointerDrift';
import { whenRevealed } from '@/components/motion/transitionGate';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
  const title = block.title ?? '';
  const words = title.split(/\s+/).filter(Boolean);

  usePointerDrift(root, '[data-media]');

  useGSAP((_, contextSafe) => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set('[data-word]', { yPercent: 110 });
      gsap.set('[data-aside]', { opacity: 0, y: 16 });
      gsap.set('[data-media]', { scale: 1.08 });

      let cancelled = false;
      whenRevealed().then(contextSafe((gated: boolean) => {
        if (cancelled) return;
        gsap.timeline({ delay: gated ? 0.2 : 0.1, defaults: { ease: 'power4.out' } })
          .to('[data-media]', { scale: 1.03, duration: 2.2, ease: 'power2.out' }, 0)
          .to('[data-word]', { yPercent: 0, duration: 1.1, stagger: 0.07 }, 0.1)
          .to('[data-aside]', { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.6);
      }));

      const scroll = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('[data-media]', { yPercent: 16, ease: 'none', scrollTrigger: scroll });
      gsap.to('[data-shade]', { opacity: 0.5, ease: 'none', scrollTrigger: scroll });

      return () => { cancelled = true; };
    });
  }, { scope: root });

  return (
    <section ref={root} className="relative flex min-h-[82svh] items-end overflow-hidden bg-ink">
      {block.image && (
        <div data-media className="absolute inset-0 will-change-transform">
          <SmartImage image={block.image} priority sizes="100vw" />
          <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/30 to-ink/10" />
        </div>
      )}
      <div data-shade className="absolute inset-0 bg-ink opacity-0 pointer-events-none" />

      <div className="relative container pb-14 pt-40 text-paper md:pb-20">
        {lead && <div data-aside className="mb-6">{lead}</div>}
        <h1
          aria-label={title}
          className="font-display font-medium leading-[1.02] tracking-[-0.015em] max-w-[16ch]"
          style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}
        >
          {words.map((word, i) => (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em] mr-[0.22em]">
              <span data-word className="inline-block will-change-transform">{word}</span>
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
