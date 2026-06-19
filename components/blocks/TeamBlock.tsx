"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import gsap from "gsap";
import type { TeamBlock as TeamBlockType, TeamMember } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SmartImage } from "@/components/ui/SmartImage";
import { useLenis } from "@/components/layout/Layout";

export function TeamBlock({ block }: { block: TeamBlockType }) {
  const [active, setActive]     = useState<TeamMember | null>(null);
  const [rendered, setRendered] = useState(false);
  const lenis = useLenis();

  const drawerRef   = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const animateIn = useCallback(() => {
    const drawer   = drawerRef.current;
    const backdrop = backdropRef.current;
    if (!drawer || !backdrop) return;
    lenis?.stop();
    gsap.fromTo(drawer,   { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" });
  }, [lenis]);

  const animateOut = useCallback((onComplete: () => void) => {
    const drawer   = drawerRef.current;
    const backdrop = backdropRef.current;
    if (!drawer || !backdrop) { onComplete(); return; }
    gsap.to(drawer,   { opacity: 0, duration: 0.35, ease: "power2.in", onComplete });
    gsap.to(backdrop, { opacity: 0, duration: 0.3,  ease: "none" });
    lenis?.start();
  }, [lenis]);

  const open = useCallback((member: TeamMember) => {
    setActive(member);
    setRendered(true);
  }, []);

  const close = useCallback(() => {
    animateOut(() => {
      setRendered(false);
      setActive(null);
    });
  }, [animateOut]);

  // Trigger enter animation after portal mounts
  useEffect(() => {
    if (rendered) requestAnimationFrame(() => requestAnimationFrame(animateIn));
  }, [rendered, animateIn]);

  // Escape key
  useEffect(() => {
    if (!rendered) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [rendered, close]);

  // Restore scroll if unmounted while open
  useEffect(() => () => { lenis?.start(); }, [lenis]);

  const grid = (
    <Section variant="light">
      <div className="max-w-2xl">
        {block.title    && <Eyebrow>{block.title}</Eyebrow>}
        {block.subtitle && <h2 className="display-2 mt-3">{block.subtitle}</h2>}
        {block.content  && <p className="body-lg mt-4 text-ink-soft">{block.content}</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {block.items.map((m) => (
          <button key={m.name} onClick={() => open(m)} className="text-left group">
            <div className="relative aspect-3/4 overflow-hidden">
              <SmartImage
                image={m.image}
                sizes="(max-width:768px) 100vw, 33vw"
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="display-3 mt-4">{m.name}</h3>
            <p className="eyebrow mt-1">{m.role}</p>
          </button>
        ))}
      </div>
    </Section>
  );

  if (!rendered) return grid;

  return (
    <>
      {grid}
      {createPortal(
        <div
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200 }}
        >
          {/* Backdrop */}
          <div
            ref={backdropRef}
            onClick={close}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            style={{ opacity: 0 }}
          />

          {/* Drawer */}
          <div
            ref={drawerRef}
            className="absolute right-0 top-0 bottom-0 w-full bg-ink text-paper border-l border-paper/10 flex flex-col overflow-hidden"
            style={{ opacity: 0 }}
          >
            {active && (
              <div className="flex flex-col sm:flex-row h-full overflow-hidden">

                {/* Image */}
                <div className="shrink-0 h-56 sm:h-full sm:w-1/2 px-16 py-6 md:px-28 md:py-10 lg:px-36 lg:py-14">
                  <div className="relative h-full overflow-hidden">
                    <SmartImage image={active.image} sizes="50vw" />
                    <button
                      onClick={close}
                      aria-label="Close"
                      className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 rounded-full bg-ink/50 hover:bg-ink/80 text-paper backdrop-blur-sm transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex-1 overflow-y-auto flex items-center">
                  <div className="px-10 md:px-14 lg:px-16 py-16 flex flex-col w-full">
                    <p className="eyebrow text-paper/40 mb-5">Trustee</p>
                    <h3 className="font-display text-2xl md:text-3xl lg:text-4xl text-paper leading-[1.1]">
                      {active.name}
                    </h3>
                    <p className="eyebrow text-green-light mt-2">{active.role}</p>
                    <div className="mt-7 w-8 h-px bg-paper/20" />
                    <p className="mt-7 text-paper/70 leading-[1.8] text-[14px] md:text-[15px]">
                      {active.bio}
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
