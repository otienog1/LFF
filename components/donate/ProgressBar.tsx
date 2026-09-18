'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Progress in units the foundation has reported (homes built of homes
 * planned, say). The fill draws from the left once as it arrives; under
 * reduced motion it is simply there.
 */
export function ProgressBar({ done, total, label, dark = false, className }: { done: number; total: number; label: string; dark?: boolean; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const ratio = total > 0 ? Math.min(1, done / total) : 0;

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('[data-fill]', { scaleX: 0 }, {
        scaleX: ratio, transformOrigin: 'left center', duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 90%', once: true },
      });
    });
  }, { scope: root, dependencies: [ratio] });

  return (
    <div ref={root} className={className}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label={label}
        className={cn('h-1 w-full overflow-hidden', dark ? 'bg-paper/20' : 'bg-ink/10')}
      >
        <div data-fill className={cn('h-full w-full origin-left', dark ? 'bg-green-light' : 'bg-green')} style={{ transform: `scaleX(${ratio})` }} />
      </div>
      <p className={cn('m-0 mt-3 text-[11px] uppercase tracking-[0.2em]', dark ? 'text-paper/70' : 'text-ink-soft')}>{label}</p>
    </div>
  );
}
