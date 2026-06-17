"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "@/components/layout/Layout";

const PROGRAM_IDS = [
  { id: "education-program",    key: "education" },
  { id: "environmental-program", key: "restoration" },
  { id: "community-program",    key: "empowerment" },
  { id: "coexistence-program",  key: "coexistence" },
] as const;

export function ProgramNav() {
  const t         = useTranslations("ourWork");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navRef    = useRef<HTMLDivElement>(null);
  const lenis     = useLenis();

  const [pinned,   setPinned]   = useState(false);
  const [navbarH,  setNavbarH]  = useState(64);
  const [pillH,    setPillH]    = useState(44);
  const triggerY = useRef(0);

  // Measure heights + trigger point once after first paint
  useEffect(() => {
    const navbar  = document.querySelector("header") as HTMLElement | null;
    const nH      = navbar?.offsetHeight ?? 64;
    const pH      = navRef.current?.offsetHeight ?? 44;
    const wrapper = wrapperRef.current;
    // getBoundingClientRect at scroll=0 equals the element's document-top offset
    const tY      = wrapper ? wrapper.getBoundingClientRect().top - nH : 0;

    setNavbarH(nH);
    setPillH(pH);
    triggerY.current = tY;
  }, []);

  // Toggle pinned state by listening to Lenis scroll
  useEffect(() => {
    if (!lenis) return;
    const onScroll = ({ scroll }: { scroll: number }) => {
      setPinned(scroll >= triggerY.current);
    };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target || !lenis) return;
    lenis.scrollTo(target, { offset: -(navbarH + pillH) });
  };

  return (
    /* Wrapper reserves the pill bar's height in the document flow when pinned */
    <div ref={wrapperRef} style={{ height: pinned ? pillH : undefined }}>
      <div
        ref={navRef}
        className="z-40 bg-paper/95 backdrop-blur border-b border-line"
        style={pinned ? { position: "fixed", top: navbarH, left: 0, right: 0 } : undefined}
      >
        <div className="container py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {PROGRAM_IDS.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              onClick={(e) => handleClick(e, p.id)}
              className="shrink-0 text-[11px] tracking-[0.15em] uppercase font-medium px-4 py-2 rounded-full border border-line text-ink-soft hover:bg-ink hover:text-paper hover:border-ink transition-colors"
            >
              {t(p.key)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
