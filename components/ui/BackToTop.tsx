"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLenis } from "@/components/layout/Layout";

export function BackToTop() {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Shown after the first screen, hidden again once the footer is in view so it never covers its text.
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
      onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0 }))}
      aria-label="Back to top"
      className={`fixed bottom-8 right-8 z-100 flex items-center justify-center w-11 h-11 rounded-full bg-ink text-paper shadow-lg transition-[opacity,transform,background-color] duration-300 ease-out hover:bg-green ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 motion-reduce:translate-y-0 pointer-events-none"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
