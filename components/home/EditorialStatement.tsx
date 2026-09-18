'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { EditorialBlock } from '@/types/content';
import { Chapter, ChapterMark } from '@/components/home/Chapter';

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
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set('[data-line]', { yPercent: 105 });
      gsap.set('[data-fade]', { opacity: 0, y: 12 });
      gsap.set('[data-rule]', { scaleX: 0, transformOrigin: 'left center' });
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } })
        .to('[data-fade="mark"]', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0)
        .to('[data-line]', { yPercent: 0, duration: 1.2, stagger: 0.14, ease: 'power4.out' }, 0.05)
        .to('[data-rule]', { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, 0.7)
        .to('[data-fade="meta"]', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.85);
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
            Luigi Footprints Foundation &nbsp;&middot;&nbsp; Nairobi, Kenya
          </p>
        </div>
      </div>
    </Chapter>
  );
}
