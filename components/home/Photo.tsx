'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { ImageRef } from '@/types/content';
import { SmartImage } from '@/components/ui/SmartImage';
import { PendingPhoto, isPending } from '@/components/shared/PendingPhoto';
import { cn } from '@/lib/utils';
import { appear, START, unmask } from '@/components/motion/presets';
import { onArrival } from '@/components/motion/arrive';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * An editorial photograph. Arrives once as it scrolls into view, either
 * unmasked top to bottom (`clip`, the default) or as a plain fade (`fade`, for
 * frames whose height must read as fixed from the first moment), then drifts
 * slowly inside its frame while the section passes. The caller sets the aspect
 * ratio, or lets the frame take its size from a grid, through `className`.
 * A photograph the foundation has yet to supply arrives as a plate
 * (PendingPhoto) with the same reveal and no drift; `pendingText` is the line
 * of the entry's own text the plate carries.
 */
export function Photo({
  image,
  sizes,
  className,
  drift = 5,
  scale = 1.12,
  reveal = 'clip',
  pendingText,
}: {
  image: ImageRef;
  sizes?: string;
  className?: string;
  /** Vertical travel while in view, as a percentage of the frame. */
  drift?: number;
  /** Overscan so the drift never shows an edge. */
  scale?: number;
  reveal?: 'clip' | 'fade';
  pendingText?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const pending = isPending(image);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', (context) => {
      const el = root.current;
      if (!el) return;
      if (reveal === 'clip') {
        gsap.set(el, { clipPath: 'inset(0 0 100% 0)' });
        onArrival(el, START.block, (d) => context.add(() => {
          gsap.to(el, unmask({ clipPath: 'inset(0 0 0% 0)', delay: d }));
        }));
      } else {
        gsap.set(el, { opacity: 0 });
        onArrival(el, START.block, (d) => context.add(() => { gsap.to(el, appear({ delay: d })); }));
      }
      if (pending) return;
      gsap.fromTo('[data-photo-img]', { yPercent: -drift, scale }, {
        yPercent: drift, scale, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }, { scope: root });

  return (
    <div ref={root} className={cn('relative overflow-hidden', className)}>
      {pending ? (
        <PendingPhoto image={image} text={pendingText} className="absolute inset-0" />
      ) : (
        <div data-photo-img className="absolute inset-0 will-change-transform">
          <SmartImage image={image} sizes={sizes} />
        </div>
      )}
    </div>
  );
}
