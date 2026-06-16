"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const WORDS = [
  "Wildlife", "Community", "Conservation", "Kenya", "Amboseli",
  "Ecosystem", "Education", "Restoration", "Empowerment", "Coexistence",
];

const SPEED = 80; // px/sec

export function Ticker() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure one copy's width after layout
    const copyWidth = (track.children[0] as HTMLElement).offsetWidth;
    let x = 0;

    // Use GSAP's ticker for lag-smoothed delta time
    const onTick = (_time: number, deltaTime: number) => {
      x -= (deltaTime / 1000) * SPEED;
      // Modulo wrap — no reset jump, ever
      if (x <= -copyWidth) x += copyWidth;
      gsap.set(track, { x });
    };

    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, []);

  return (
    <div className="bg-ink overflow-hidden py-4 select-none border-b border-paper/10">
      {/* 4 copies: guarantees content fills any viewport width during the wrap */}
      <div ref={trackRef} className="flex will-change-transform">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} aria-hidden={i > 0 ? true : undefined} className="flex shrink-0 items-center">
            {WORDS.map((word, j) => (
              <span key={j} className="flex items-center text-paper text-[10px] tracking-[0.28em] uppercase">
                <span className="px-5">{word}</span>
                <span className="text-green-light text-[8px]" aria-hidden="true">●</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
