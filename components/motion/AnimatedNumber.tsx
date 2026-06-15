"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Renders the stat string (e.g. "2,553+"); counts up the numeric part. */
export function AnimatedNumber({ value, className }: { value: string; className?: string; }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/[\d,]+/);
  const target = match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
  const prefix = match ? value.slice(0, match.index) : "";
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : value;

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = value; return; }
    const obj = { n: 0 };
    gsap.to(obj, {
      n: target, duration: 1.6, ease: "power1.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
      onUpdate: () => { el.textContent = `${prefix}${Math.round(obj.n).toLocaleString()}${suffix}`; },
    });
  }, { scope: ref });

  return <span ref={ref} className={className}>{value}</span>;
}
