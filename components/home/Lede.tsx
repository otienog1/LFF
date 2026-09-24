'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Chapter, ChapterMark, type ChapterTone } from '@/components/home/Chapter';
import { cn } from '@/lib/utils';
import { fade, fadeFrom, rise, riseFrom, START, STAGGER } from '@/components/motion/presets';
import { onArrival } from '@/components/motion/arrive';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TYPE = 'm-0 font-display font-light text-ink text-[clamp(1.375rem,2vw,1.875rem)] leading-[1.5] tracking-[-0.005em]';

/**
 * A page's opening, or its closing summary: one or more paragraphs set in
 * the display face. The left columns carry the chapter mark when `number` is
 * given, or an `aside` (a page's contents, say) when it is not; on small
 * screens the aside follows the text. Paragraphs are split on blank lines
 * and rise in one after another as the chapter arrives. `dropCap` is the
 * home page's signature: the initial rises out of its mask first and the
 * paragraph follows. Other pages set the text plain.
 */
export function Lede({
  number,
  label,
  aside,
  text,
  dropCap = false,
  tone = 'light',
}: {
  number?: string;
  label?: string;
  aside?: React.ReactNode;
  text: string;
  dropCap?: boolean;
  tone?: ChapterTone;
}) {
  const root = useRef<HTMLDivElement>(null);
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const firstChar = paragraphs[0]?.[0] ?? '';
  const rest = paragraphs[0]?.slice(1) ?? '';
  // A narrow initial (I, J, 1) carries wide side-bearings at 8.5rem; the usual gutter would set it a word's width
  // away from the rest of its word ("I   n the heart"), so it sits closer.
  const narrowCap = /^[IJlij1]$/.test(firstChar);
  const withAside = Boolean(aside) && !number;
  const placement = cn('mt-8 space-y-6 lg:mt-0 lg:row-start-1', withAside ? 'lg:col-span-7 lg:col-start-6' : 'lg:col-span-8 lg:col-start-4');

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', (context) => {
      const el = root.current;
      if (!el) return;
      const intro = gsap.utils.toArray<HTMLElement>('[data-intro]', el);
      const cap = dropCap ? el.querySelector('[data-cap]') : null;
      gsap.set(intro, fadeFrom());
      if (cap) gsap.set(cap, riseFrom());
      // The block line, not the chapter one: an opening that shows at the foot of the first screen arrives with the
      // page (after the hero) instead of waiting, blank, for the reader to scroll.
      onArrival(el, START.block, (d) => context.add(() => {
        const tl = gsap.timeline({ delay: d });
        if (cap) tl.to(cap, rise(), 0);
        tl.to(intro, fade({ stagger: STAGGER.blocks }), cap ? 0.15 : 0);
      }));
    });
  }, { scope: root });

  return (
    <Chapter tone={tone}>
      <div ref={root} className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
        {number && (
          <div className="lg:col-span-3 lg:col-start-1 lg:row-start-1">
            <ChapterMark number={number} label={label} tone={tone} />
            {aside && <div className="mt-10">{aside}</div>}
          </div>
        )}
        <div className={placement}>
          {paragraphs.map((paragraph, i) =>
            dropCap && i === 0 ? (
              <p key={i} className={TYPE}>
                <span className="sr-only">{paragraph}</span>
                <span aria-hidden="true" className={cn('float-left mt-3', narrowCap ? 'mr-1.5 md:mr-2' : 'mr-5')}>
                  <span className="block overflow-hidden pt-[0.25em] -mt-[0.25em]">
                    <span data-cap className="block font-display font-medium text-[6.5rem] md:text-[8.5rem] leading-[0.8] text-green">
                      {firstChar}
                    </span>
                  </span>
                </span>
                <span data-intro aria-hidden="true">{rest}</span>
              </p>
            ) : (
              <p key={i} data-intro className={TYPE}>{paragraph}</p>
            ),
          )}
        </div>
        {withAside && (
          <div className="mt-14 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0">{aside}</div>
        )}
      </div>
    </Chapter>
  );
}
