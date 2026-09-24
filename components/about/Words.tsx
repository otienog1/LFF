'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';
import type { LuigiPanelBlock } from '@/types/content';
import { Chapter, ChapterMark } from '@/components/home/Chapter';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils';
import { draw, fade, fadeFrom, rise, riseFrom, settle, START, STAGGER, unmask } from '@/components/motion/presets';
import { onArrival } from '@/components/motion/arrive';

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
    mm.add('(prefers-reduced-motion: no-preference)', (context) => {
      const el = root.current;
      if (!el) return;
      gsap.set(q('[data-line]'), riseFrom());
      gsap.set(q('[data-fade]'), fadeFrom());
      gsap.set(q('[data-rule]'), { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(portrait.current, { clipPath: 'inset(0 0 0 100%)' });
      gsap.set(portraitImg.current, { scale: 1.1 });
      onArrival(el, START.chapter, (d) => context.add(() => {
        gsap.timeline({ delay: d })
          .to(q('[data-fade="mark"]'), fade(), 0)
          .to(portrait.current, unmask({ clipPath: 'inset(0 0 0 0%)' }), 0)
          .to(portraitImg.current, settle({ scale: 1.04 }), 0)
          .to(q('[data-line]'), rise({ stagger: STAGGER.lines }), 0.5)
          .to(q('[data-rule]'), draw({ scaleX: 1 }), 1.2)
          .to(q('[data-fade="cite"]'), fade(), 1.35);
      }));
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
              {/* The opening quotation mark hangs in the margin, so the first word lines up with the lines below it.
                  The mask is widened into the margin by the same amount, or it would clip the hanging mark. */}
              {lead && (
                <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em] -ml-[0.42em] pl-[0.42em]">
                  <span data-line className="block font-light text-paper/80 -indent-[0.42em] text-balance">{'“'}{lead}</span>
                </span>
              )}
              <span className={cn('block overflow-hidden pb-[0.12em] -mb-[0.12em]', !lead && '-ml-[0.42em] pl-[0.42em]')}>
                <span data-line className={cn('block font-medium text-paper text-balance', !lead && '-indent-[0.42em]')}>{lead ? '' : '“'}{last}{'”'}</span>
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
