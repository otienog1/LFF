"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { fade, fadeFrom, START } from "@/components/motion/presets";
import { onArrival } from "@/components/motion/arrive";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Fades and rises a block once as it scrolls into view (the site's `fade`), in the page's entrance order: blocks
 * arriving together cascade, one arriving alone starts at once wherever it sits in its list, and one in the first
 * screen of a new page follows the hero (see `onArrival`). `delay` is a fixed offset on top, for a caption that
 * should follow the figure above it. Static under prefers-reduced-motion. `start` is the ScrollTrigger start line;
 * pass a later one (e.g. START.detail) for small labels low on the screen.
 */
export function Reveal({ children, className, delay = 0, start = START.block }: { children: React.ReactNode; className?: string; delay?: number; start?: string; }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", (context) => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, fadeFrom());
      onArrival(el, start, (d) => context.add(() => { gsap.to(el, fade({ delay: delay + d })); }));
    });
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}
