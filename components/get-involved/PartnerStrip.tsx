"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";

const PARTNERS = [
  "Maniago Safaris Ltd",
  "Kenya Wildlife Service",
  "Amboseli Ecosystem Trust",
  "African Wildlife Foundation",
  "Wildlife Works",
  "WWF Kenya",
  "USAID Kenya",
  "UNEP",
];

const SPEED = 60; // px/sec

export function PartnerStrip() {
  const t = useTranslations('getInvolved');
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
    <div className="bg-white border-b border-line py-10 overflow-hidden select-none">
      <p className="container eyebrow mb-6 text-ink/40">{t('partnersTitle')}</p>
      <div ref={trackRef} className="flex will-change-transform">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} aria-hidden={i > 0 ? true : undefined} className="flex shrink-0 items-center">
            {PARTNERS.map((name, j) => (
              <span key={j} className="flex items-center">
                <span className="px-8 font-display font-medium text-xl md:text-2xl text-ink/30 whitespace-nowrap tracking-wide">
                  {name}
                </span>
                <span className="text-ink/20 text-sm" aria-hidden="true">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
