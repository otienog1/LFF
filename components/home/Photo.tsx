'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { ImageRef } from '@/types/content';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * An editorial photograph. Arrives once as it scrolls into view, either
 * unmasked top to bottom (`clip`, the default) or as a plain fade (`fade`, for
 * frames whose height must read as fixed from the first moment), then drifts
 * slowly inside its frame while the section passes. The caller sets the aspect
 * ratio, or lets the frame take its size from a grid, through `className`.
 */
export function Photo({
  image,
  sizes,
  className,
  drift = 5,
  scale = 1.12,
  reveal = 'clip',
}: {
  image: ImageRef;
  sizes?: string;
  className?: string;
  /** Vertical travel while in view, as a percentage of the frame. */
  drift?: number;
  /** Overscan so the drift never shows an edge. */
  scale?: number;
  reveal?: 'clip' | 'fade';
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (reveal === 'clip') {
        gsap.fromTo(root.current, { clipPath: 'inset(0 0 100% 0)' }, {
          clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 82%', once: true },
        });
      } else {
        gsap.fromTo(root.current, { opacity: 0 }, {
          opacity: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: root.current, start: 'top 90%', once: true },
        });
      }
      gsap.fromTo('[data-photo-img]', { yPercent: -drift, scale }, {
        yPercent: drift, scale, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }, { scope: root });

  return (
    <div ref={root} className={cn('relative overflow-hidden', className)}>
      <div data-photo-img className="absolute inset-0 will-change-transform">
        <SmartImage image={image} sizes={sizes} />
      </div>
    </div>
  );
}
