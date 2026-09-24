"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLenis } from "@/components/layout/Layout";

/**
 * Back to the top of the page. A square in the site's own language (paper, a hairline, an ink arrow; no
 * shadow, no radius), so it reads on paper and on the ink chapters alike and matches the menu's close button.
 * Shown after the first screen and hidden again once the footer is in view, so it never covers its text.
 */
export function BackToTop() {
  const t = useTranslations("common");
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = (scroll: number, limit: number) => {
      const footer = document.querySelector("footer")?.offsetHeight ?? 0;
      setVisible(scroll > 400 && scroll < limit - footer);
    };
    if (lenis) {
      const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => update(scroll, limit);
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }
    // Lenis is bypassed under prefers-reduced-motion; fall back to native scroll events.
    const onWindowScroll = () =>
      update(window.scrollY, document.documentElement.scrollHeight - window.innerHeight);
    onWindowScroll();
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, [lenis]);

  return (
    <button
      type="button"
      onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0 }))}
      aria-label={t("backToTop")}
      className={`fixed bottom-6 right-6 z-100 flex size-11 items-center justify-center border border-ink/15 bg-paper text-ink transition-[opacity,transform,background-color,color,border-color] duration-300 ease-out hover:border-green hover:bg-green hover:text-paper md:bottom-8 md:right-8 motion-reduce:transition-opacity ${
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4 motion-reduce:translate-y-0"
      }`}
    >
      <ArrowUp aria-hidden="true" size={18} strokeWidth={1.5} />
    </button>
  );
}
