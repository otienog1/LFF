'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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
  const words = text.split(/\s+/);
  const Tag = as as 'h2';

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('[data-word]', { yPercent: 110 }, {
        yPercent: 0, duration: 1.1, stagger: 0.05, delay, ease: 'power4.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      });
    });
  }, { scope: ref });

  return (
    <Tag ref={ref} aria-label={text} className={className}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em] mr-[0.24em]">
          <span data-word className="inline-block will-change-transform">{word}</span>
        </span>
      ))}
    </Tag>
  );
}
