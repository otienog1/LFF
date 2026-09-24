'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { EditorialBlock } from '@/types/content';
import { Chapter, ChapterMark } from '@/components/home/Chapter';
import { WORDMARK } from '@/lib/site';
import { draw, fade, fadeFrom, rise, riseFrom, START, STAGGER } from '@/components/motion/presets';
import { onArrival } from '@/components/motion/arrive';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Chapter 05, the green statement band. The two lines rise out of their masks
 * once, the light line first and the bold line a beat behind, then the
 * hairline rule draws in.
 */
export function EditorialStatement({ block }: { block: EditorialBlock }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', (context) => {
      const el = root.current;
      if (!el) return;
      gsap.set('[data-line]', riseFrom());
      gsap.set('[data-fade]', fadeFrom());
      gsap.set('[data-rule]', { scaleX: 0, transformOrigin: 'left center' });
      onArrival(el, START.chapter, (d) => context.add(() => {
        gsap.timeline({ delay: d })
          .to('[data-fade="mark"]', fade(), 0)
          .to('[data-line]', rise({ stagger: STAGGER.lines }), 0.05)
          .to('[data-rule]', draw({ scaleX: 1 }), 0.7)
          .to('[data-fade="meta"]', fade(), 0.85);
      }));
    });
  }, { scope: root });

  return (
    <Chapter tone="green">
      <div ref={root}>
        <div data-fade="mark">
          <ChapterMark number="05" label={block.subtitle} tone="green" />
        </div>
        <p className="m-0 mt-10 font-display leading-none tracking-[-0.03em] text-[clamp(2.5rem,7vw,6rem)]">
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <span data-line className="block font-light text-paper/70">{block.content}</span>
          </span>
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <span data-line className="block font-medium text-paper">{block.title}</span>
          </span>
        </p>
        <div className="mt-10 flex items-center gap-5">
          <div data-rule className="h-px w-8 bg-paper/40" />
          <p data-fade="meta" className="m-0 text-[11px] uppercase tracking-[0.2em] text-paper/70">
            {WORDMARK} &nbsp;&middot;&nbsp; Nairobi, Kenya
          </p>
        </div>
      </div>
    </Chapter>
  );
}
