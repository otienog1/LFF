"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLenis } from "@/components/layout/Layout";

export function BackToTop() {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lenis) return;
    const onScroll = ({ scroll }: { scroll: number }) => setVisible(scroll > 400);
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  return (
    <button
      onClick={() => lenis?.scrollTo(0)}
      aria-label="Back to top"
      className={`fixed bottom-8 right-8 z-100 flex items-center justify-center w-11 h-11 rounded-full bg-ink text-paper shadow-lg transition-all duration-300 hover:bg-green ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
