"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A statistic (e.g. "2,553+") that rises out of a mask when it scrolls into
 * view, the same treatment as the hero headline. `delay` staggers a row.
 */
export function AnimatedNumber({ value, className, delay = 0 }: { value: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-figure]",
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, delay, ease: "power4.out", scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } },
      );
    });
  }, { scope: ref });

  return (
    <span ref={ref} className={cn("inline-block overflow-hidden align-top pb-[0.12em] -mb-[0.12em]", className)}>
      <span data-figure className="inline-block will-change-transform">{value}</span>
    </span>
  );
}
