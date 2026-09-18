"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";

const SPEED = 60; // px/sec

/**
 * Word marquee beneath the opening, set small in the display face. Constant linear
 * motion driven by GSAP's ticker; it only runs while on screen and the tab is
 * visible, and it stays still under prefers-reduced-motion. Decorative, so it
 * is hidden from assistive technology.
 */
export function Ticker() {
  const t = useTranslations("home");
  const words = t("ticker").split(" · ");
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const first = track.children[0] as HTMLElement;
    let copyWidth = first.offsetWidth;
    let x = 0;
    let onScreen = false;

    const onTick = (_time: number, deltaTime: number) => {
      x -= (deltaTime / 1000) * SPEED;
      if (x <= -copyWidth) x += copyWidth; // modulo wrap, no reset jump
      gsap.set(track, { x });
    };

    const sync = () => {
      gsap.ticker.remove(onTick);
      if (onScreen && document.visibilityState === "visible") gsap.ticker.add(onTick);
    };

    const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); });
    io.observe(root);
    const ro = new ResizeObserver(() => { copyWidth = first.offsetWidth; });
    ro.observe(first);
    document.addEventListener("visibilitychange", sync);

    return () => {
      gsap.ticker.remove(onTick);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={rootRef} className="select-none overflow-hidden border-b border-paper/10 bg-ink py-3.5 md:py-4" aria-hidden="true">
      {/* 4 copies: guarantees content fills any viewport width during the wrap */}
      <div ref={trackRef} className="flex will-change-transform">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex shrink-0 items-center">
            {words.map((word, j) => (
              <span key={j} className="flex items-center font-display font-light leading-none tracking-[-0.01em] text-paper/90 text-[clamp(0.9375rem,1.3vw,1.25rem)]">
                <span className="px-5 md:px-6">{word}</span>
                <span className="text-[0.4em] text-green-light">●</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
