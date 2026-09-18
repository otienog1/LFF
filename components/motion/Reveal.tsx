"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Fades and rises a block once as it scrolls into view. Static under
 * prefers-reduced-motion. `start` is the ScrollTrigger start position; pass a
 * later line (e.g. "top 95%") for small labels that should arrive with the
 * element above them rather than a beat after it.
 */
export function Reveal({ children, className, delay = 0, start = "top 85%" }: { children: React.ReactNode; className?: string; delay?: number; start?: string; }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(ref.current, {
        opacity: 0, y: 20, duration: 0.8, delay, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start, once: true },
      });
    });
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}
