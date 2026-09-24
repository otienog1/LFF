'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { ContentBlock } from '@/types/content';
import { Chapter, ChapterMark } from '@/components/home/Chapter';
import { Photo } from '@/components/home/Photo';
import { typeset } from '@/lib/typeset';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Chapter 02, the belief. Text on the left six columns, the photograph on the
 * right five, tall, bleeding past the grid to the viewport edge on wide
 * screens. The statement is read word by word at the reader's scrolling pace.
 */
export function Belief({ block }: { block: ContentBlock }) {
  const root = useRef<HTMLDivElement>(null);
  const statement = typeset(block.subtitle ?? '');
  const words = statement.split(/\s+/);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('[data-word]', { opacity: 0.22 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: '[data-statement]', start: 'top 82%', end: 'bottom 55%', scrub: 0.5 },
      });
    });
  }, { scope: root });

  return (
    <Chapter tone="light">
      <div ref={root} className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-6">
          {block.title && <ChapterMark number="02" label={block.title} />}
          {block.subtitle && (
            <h2 data-statement aria-label={statement} className="display-2 mt-6 max-w-[18ch]">
              {words.map((word, i) => (
                <span key={i} data-word aria-hidden="true" className="inline-block mr-[0.24em]">{word}</span>
              ))}
            </h2>
          )}
          {block.content && (
            <p className="body-lg mt-8 max-w-[54ch] whitespace-pre-line text-ink-soft">{block.content}</p>
          )}
        </div>
        {block.image && (
          <div className="mt-12 lg:col-span-5 lg:col-start-8 lg:mt-0 bleed-right">
            {/* On large screens the frame is the grid row's height, so the photograph stands exactly as tall as the text. */}
            <Photo image={block.image} sizes="(max-width:1024px) 100vw, 50vw" className="aspect-4/3 lg:aspect-auto lg:h-full" />
          </div>
        )}
      </div>
    </Chapter>
  );
}
