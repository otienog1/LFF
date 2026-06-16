"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const TESTIMONIALS = [
  { quote: "LFF changed how my children see their future.", attribution: "Community mother, Amboseli" },
  { quote: "The tree nursery gave us income and pride.", attribution: "Youth group member, Olchani" },
  { quote: "We now know how to live peacefully with elephants.", attribution: "Community ranger, Amboseli" },
  { quote: "Our daughters can go to school because of this foundation.", attribution: "Local elder, Kajiado" },
  { quote: "I plant trees knowing my grandchildren will sit in their shade.", attribution: "Community elder, Amboseli" },
];

const SPEED = 60; // px/sec

export function TestimonialTicker() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const copyWidth = (track.children[0] as HTMLElement).offsetWidth;
    let x = 0;

    const onTick = (_time: number, deltaTime: number) => {
      x -= (deltaTime / 1000) * SPEED;
      if (x <= -copyWidth) x += copyWidth;
      gsap.set(track, { x });
    };

    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, []);

  return (
    <div className="bg-white border-b border-line overflow-hidden py-12 select-none">
      <div ref={trackRef} className="flex will-change-transform">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} aria-hidden={i > 0 ? true : undefined} className="flex shrink-0 gap-10 pr-10">
            {TESTIMONIALS.map((t, j) => (
              <div key={j} className="shrink-0 w-64 border-l-2 border-green/30 pl-5">
                <p className="font-display italic text-[15px] text-ink leading-[1.55]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-2 text-[10px] tracking-[0.15em] uppercase text-ink/40">
                  {t.attribution}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
