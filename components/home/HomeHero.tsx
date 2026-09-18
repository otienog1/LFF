'use client';
import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';
import type { HeroBlock } from '@/types/content';
import { SmartImage } from '@/components/ui/SmartImage';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CtaArrow } from '@/components/ui/CtaArrow';
import { Ticker } from '@/components/home/Ticker';
import { Lede } from '@/components/home/Lede';
import { usePointerDrift } from '@/components/motion/usePointerDrift';
import { whenRevealed } from '@/components/motion/transitionGate';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Photograph overscan at rest, so the pointer drift never shows an edge. */
const REST_SCALE = 1.03;

/**
 * Home hero. The photograph opens from a framed inset to full bleed on load
 * while the headline's words rise out of a mask; the subtitle, button, corner
 * notes and scroll cue follow. On scroll the photograph drifts slower than the
 * page and darkens. With a fine pointer it also leans a few pixels toward the
 * cursor, eased, and returns to rest when the pointer leaves.
 */
export function HomeHero({ block }: { block: HeroBlock }) {
  const t = useTranslations('home');
  const tFooter = useTranslations('footer');
  const root = useRef<HTMLElement>(null);
  const words = block.title.split(/\s+/);

  usePointerDrift(root, '[data-media]');

  useGSAP((_, contextSafe) => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
        const section = root.current!;
        // Arriving under the curtain, the frame opens less and faster so it does not compete with the lift.
        const gatedNow = document.documentElement.dataset.transition === 'covered';

        gsap.set('[data-word]', { yPercent: 110 });
        gsap.set('[data-aside]', { opacity: 0, y: 16 });
        gsap.set('[data-frame], [data-cue]', { opacity: 0 });
        gsap.set('[data-media]', { scale: 1.14, clipPath: gatedNow ? 'inset(10% 6%)' : 'inset(18% 12%)' });

        let cancelled = false;
        whenRevealed().then(contextSafe((gated: boolean) => {
          if (cancelled) return;
          const open = gated ? 1.1 : 1.5;
          gsap.timeline({ delay: gated ? 0.25 : 0.15, defaults: { ease: 'power4.out' } })
            .to('[data-media]', { clipPath: 'inset(0% 0%)', duration: open, ease: 'power3.inOut' }, 0)
            .to('[data-media]', { scale: REST_SCALE, duration: 2.4, ease: 'power2.out' }, 0)
            .to('[data-word]', { yPercent: 0, duration: 1.2, stagger: 0.07 }, open * 0.4)
            .to('[data-aside]', { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, open * 0.75)
            .to('[data-frame], [data-cue]', { opacity: 1, duration: 0.9, ease: 'power2.out' }, open * 0.85);
        }));

        const scroll = { trigger: section, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-media]', { yPercent: 18, ease: 'none', scrollTrigger: scroll });
        gsap.to('[data-shade]', { opacity: 0.6, ease: 'none', scrollTrigger: scroll });
        gsap.to('[data-cue-wrap]', { opacity: 0, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: '25% top', scrub: true } });
        // The scroll cue's line travels down its track, slowly, on repeat.
        gsap.fromTo('[data-cue-line]', { yPercent: -100 }, { yPercent: 100, duration: 2.2, ease: 'power1.inOut', repeat: -1, repeatDelay: 0.6 });

        return () => { cancelled = true; };
    });
  }, { scope: root });

  return (
    <>
      <section ref={root} className="relative min-h-svh flex items-end overflow-hidden bg-ink">
        {block.image && (
          <div data-media className="absolute inset-0 will-change-transform">
            <SmartImage image={block.image} priority sizes="100vw" />
            <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/30 to-ink/10" />
          </div>
        )}
        <div data-shade className="absolute inset-0 bg-ink opacity-0 pointer-events-none" />

        {/* Hairline frame with corner notes: the page grid, drawn on the photograph. Large screens only. */}
        <div data-frame aria-hidden="true" className="hidden xl:block absolute inset-x-8 top-24 bottom-8 border border-paper/25 pointer-events-none" />
        <div data-frame className="hidden xl:flex absolute inset-x-8 top-24 items-start justify-between px-6 pt-5 text-[11px] font-medium uppercase tracking-[0.2em] text-paper/80 pointer-events-none">
          <span>{tFooter('location')}</span>
          <span>{t('meta')}</span>
        </div>

        <div className="relative container pb-16 md:pb-24 pt-32 md:pt-40 text-paper">
          <h1
            aria-label={block.title}
            className="font-display font-medium leading-[1.02] tracking-[-0.015em] max-w-[24ch]"
            style={{ fontSize: 'clamp(2.5rem, 5.6vw, 6rem)' }}
          >
            {words.map((word, i) => (
              <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em] mr-[0.22em]">
                <span data-word className="inline-block will-change-transform">{word}</span>
              </span>
            ))}
          </h1>
          <div data-aside>
            {block.subtitle && (
              <p className="mt-5 text-paper/80 text-sm md:text-base tracking-wide max-w-[44ch]">
                {block.subtitle}
              </p>
            )}
            {block.cta && (
              <Link href={block.cta.link} className={cn(buttonVariants({ size: 'lg' }), 'mt-8 inline-flex text-[13px]')}>
                {block.cta.label}
                <CtaArrow />
              </Link>
            )}
          </div>

          {/* Scroll cue on the container's right edge, level with the button. Fades as the page moves. */}
          <div data-cue-wrap className="hidden md:block absolute right-4 bottom-24">
            <div data-cue className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-paper/70">
              <span className="relative block h-12 w-px overflow-hidden bg-paper/25">
                <span data-cue-line className="absolute inset-0 bg-paper" />
              </span>
              <span>{t('scroll')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 01: the opening. */}
      {block.content && <Lede number="01" text={block.content} dropCap />}
      <Ticker />
    </>
  );
}
