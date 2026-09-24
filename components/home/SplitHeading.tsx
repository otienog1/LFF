'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { typeset } from '@/lib/typeset';
import { cn } from '@/lib/utils';
import { rise, riseFrom, START, STAGGER } from '@/components/motion/presets';
import { onArrival } from '@/components/motion/arrive';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A heading whose words rise out of masks, once, as it scrolls into view.
 * The element keeps its full text as its accessible name; the split words are
 * decorative. Without JavaScript, or under reduced motion, it simply shows.
 */
export function SplitHeading({
  as = 'h2',
  text,
  className,
  delay = 0,
}: {
  as?: 'h1' | 'h2' | 'h3' | 'p';
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const set = typeset(text);
  const words = set.split(/\s+/);
  const Tag = as as 'h2';

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', (context) => {
      const el = ref.current;
      if (!el) return;
      const parts = gsap.utils.toArray<HTMLElement>('[data-word]', el);
      gsap.set(parts, riseFrom());
      onArrival(el, START.block, (d) => context.add(() => {
        gsap.to(parts, rise({ stagger: STAGGER.words, delay: delay + d }));
      }));
    });
  }, { scope: ref });

  // No standing will-change on the words: GSAP promotes each one only while it moves, so a page of headings does not
  // hold a compositor layer per word.
  return (
    <Tag ref={ref} aria-label={set} className={cn('text-balance', className)}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em] mr-[0.24em]">
          <span data-word className="inline-block">{word}</span>
        </span>
      ))}
    </Tag>
  );
}
