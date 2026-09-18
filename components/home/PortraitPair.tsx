'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { ImageRef } from '@/types/content';
import { SmartImage } from '@/components/ui/SmartImage';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Two staggered portrait photographs. Each is unmasked once as the pair
 * arrives, then they drift at different rates while the section passes so
 * there is depth between them.
 */
export function PortraitPair({ images }: { images: [ImageRef, ImageRef] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const frames = gsap.utils.toArray<HTMLElement>('[data-frame]');
      gsap.fromTo(frames, { clipPath: 'inset(0 0 100% 0)' }, {
        clipPath: 'inset(0 0 0% 0)', duration: 1.2, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      });
      const drift = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true };
      gsap.fromTo(frames[0], { y: 20 }, { y: -20, ease: 'none', scrollTrigger: drift });
      gsap.fromTo(frames[1], { y: 44 }, { y: -44, ease: 'none', scrollTrigger: drift });
    });
  }, { scope: root });

  return (
    <div ref={root} className="grid grid-cols-2 gap-4 items-end">
      <div data-frame className="relative aspect-3/4 overflow-hidden will-change-transform">
        <SmartImage image={images[0]} sizes="(max-width:768px) 50vw, 25vw" />
      </div>
      <div data-frame className="relative aspect-3/4 overflow-hidden mt-14 will-change-transform">
        <SmartImage image={images[1]} sizes="(max-width:768px) 50vw, 25vw" />
      </div>
    </div>
  );
}
