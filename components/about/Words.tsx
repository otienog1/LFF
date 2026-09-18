'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';
import type { LuigiPanelBlock } from '@/types/content';
import { Chapter, ChapterMark } from '@/components/home/Chapter';
import { SmartImage } from '@/components/ui/SmartImage';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Chapter 03, in his words. On large screens Luigi's portrait is a panel the
 * full height of the chapter, from its top edge to its bottom edge, filling
 * the right half of the viewport; the sentence he left the foundation runs
 * over its shaded left side, the opening sentence light and the closing one
 * carrying the weight. On small screens the photograph sits above the quote,
 * which overlaps its lower edge. The panel is unmasked from the left and
 * settles from a slight zoom; the lines rise out of their masks; the rule
 * draws; the attribution follows.
 *
 * The container is made static on large screens so the panel positions
 * against the section itself, which is what lets it span the padding too.
 */
export function Words({ block }: { block: LuigiPanelBlock }) {
  const t = useTranslations('about');
  const root = useRef<HTMLDivElement>(null);
  const portrait = useRef<HTMLDivElement>(null);
  const portraitImg = useRef<HTMLDivElement>(null);
  const sentences = block.content.split(/(?<=[.!?])\s+/).filter(Boolean);
  const lead = sentences.slice(0, -1).join(' ');
  const last = sentences[sentences.length - 1] ?? '';

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(q('[data-line]'), { yPercent: 105 });
      gsap.set(q('[data-fade]'), { opacity: 0, y: 12 });
      gsap.set(q('[data-rule]'), { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(portrait.current, { clipPath: 'inset(0 0 0 100%)' });
      gsap.set(portraitImg.current, { scale: 1.1 });
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
        .to(q('[data-fade="mark"]'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0)
        .to(portrait.current, { clipPath: 'inset(0 0 0 0%)', duration: 1.4, ease: 'power3.inOut' }, 0)
        .to(portraitImg.current, { scale: 1.04, duration: 2.2, ease: 'power2.out' }, 0)
        .to(q('[data-line]'), { yPercent: 0, duration: 1.2, stagger: 0.14, ease: 'power4.out' }, 0.5)
        .to(q('[data-rule]'), { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, 1.2)
        .to(q('[data-fade="cite"]'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.35);
      // A slow drift inside the frame while the chapter passes.
      gsap.fromTo(portraitImg.current, { yPercent: -4 }, {
        yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: portrait.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }, { scope: root });

  return (
    <Chapter tone="inverse" className="lg:static">
      <div ref={root}>
        <div data-fade="mark">
          <ChapterMark number="03" label={t('inHisWords')} tone="inverse" />
        </div>

        <div className="mt-10 md:mt-14 lg:mt-0">
          {/* Portrait panel: in flow on small screens, the full height of the chapter on large ones. */}
          <div ref={portrait} className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="relative aspect-4/5 overflow-hidden sm:aspect-square lg:absolute lg:inset-0 lg:aspect-auto">
              <div ref={portraitImg} className="absolute inset-0 will-change-transform">
                <SmartImage image={block.image} sizes="(max-width:1024px) 100vw, 50vw" className="object-[50%_25%]" />
              </div>
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink via-ink/25 to-transparent lg:hidden" />
              <div aria-hidden="true" className="absolute inset-0 hidden bg-linear-to-r from-ink from-5% via-ink/40 via-45% to-transparent lg:block" />
            </div>
          </div>

          {/* The quote, over the panel. */}
          <div className="relative z-10 -mt-20 sm:-mt-28 lg:mt-14 lg:flex lg:min-h-[30rem] lg:w-3/4 lg:flex-col lg:justify-center">
            <blockquote className="m-0 max-w-[30ch] font-display leading-[1.1] tracking-[-0.02em] text-[clamp(2rem,3.9vw,3.75rem)]">
              {lead && (
                <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                  <span data-line className="block font-light text-paper/80">{'“'}{lead}</span>
                </span>
              )}
              <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <span data-line className="block font-medium text-paper">{lead ? '' : '“'}{last}{'”'}</span>
              </span>
            </blockquote>
            <p className="m-0 mt-10 flex items-center gap-5">
              <span data-rule aria-hidden="true" className="h-px w-8 bg-paper/40" />
              <span data-fade="cite" className="text-[11px] uppercase tracking-[0.2em] text-paper/70">{block.subtitle}</span>
            </p>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
