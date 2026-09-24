"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { rise, riseFrom, START } from "@/components/motion/presets";
import { onArrival } from "@/components/motion/arrive";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A statistic (e.g. "2,553+") that rises out of a mask when it scrolls into view, the same `rise` as every heading.
 * Figures arriving together cascade; `delay` is a fixed offset on top.
 */
export function AnimatedNumber({ value, className, delay = 0 }: { value: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", (context) => {
      const el = ref.current;
      const figure = el?.querySelector("[data-figure]");
      if (!el || !figure) return;
      gsap.set(figure, riseFrom());
      onArrival(el, START.block, (d) => context.add(() => { gsap.to(figure, rise({ delay: delay + d })); }));
    });
  }, { scope: ref });

  return (
    <span ref={ref} className={cn("inline-block overflow-hidden align-top pb-[0.12em] -mb-[0.12em]", className)}>
      <span data-figure className="inline-block">{value}</span>
    </span>
  );
}
