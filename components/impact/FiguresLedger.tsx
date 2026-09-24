'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { ImpactBlock } from '@/types/content';
import { Chapter, ChapterMark } from '@/components/home/Chapter';
import { SplitHeading } from '@/components/home/SplitHeading';
import { AnimatedNumber } from '@/components/motion/AnimatedNumber';
import { Reveal } from '@/components/motion/Reveal';
import { draw, START } from '@/components/motion/presets';
import { onArrival } from '@/components/motion/arrive';

/**
 * The figures as a ledger on ink: one row per figure, the numeral large on
 * the left five columns and its description on the right six, a hairline
 * between rows. Each numeral rises out of its mask as its row arrives, the
 * description follows, and the hairline above draws in from the left.
 */
export function FiguresLedger({ block, number }: { block: ImpactBlock; number: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', (context) => {
      gsap.utils.toArray<HTMLElement>('[data-rule]', root.current).forEach((rule) => {
        gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
        onArrival(rule, START.detail, (d) => context.add(() => { gsap.to(rule, draw({ scaleX: 1, delay: d })); }));
      });
    });
  }, { scope: root });

  return (
    <Chapter tone="inverse" id={block.id}>
      <ChapterMark number={number} label={block.title} tone="inverse" />
      {block.subtitle && <SplitHeading text={block.subtitle} className="display-2 mt-6 max-w-[20ch] text-paper" />}
      {block.content && <p className="body-lg mt-6 max-w-[58ch] text-paper/70">{block.content}</p>}

      <div ref={root} className="mt-14 md:mt-20">
        <ol className="m-0 list-none p-0">
          {block.items.map((item, i) => (
            <li key={item.title} className="relative py-8 md:py-10 lg:grid lg:grid-cols-12 lg:items-baseline lg:gap-x-8">
              <span data-rule aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-paper/20" />
              <AnimatedNumber
                value={item.title}
                className="block font-display font-medium leading-none tracking-[-0.02em] text-green-light tabular-nums text-[clamp(3rem,7vw,6rem)] lg:col-span-5"
              />
              {/* The description follows its figure by a fixed beat; rows arriving together cascade on their own. */}
              <Reveal delay={0.2} className="mt-4 lg:col-span-6 lg:col-start-7 lg:mt-0">
                <p className="body-lg m-0 max-w-[40ch] text-paper/70">{item.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="relative h-px">
          <span data-rule aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-paper/20" />
        </div>
      </div>
    </Chapter>
  );
}
