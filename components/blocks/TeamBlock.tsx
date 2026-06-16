"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { TeamBlock as TeamBlockType, TeamMember } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SmartImage } from "@/components/ui/SmartImage";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function TeamBlock({ block }: { block: TeamBlockType }) {
  const [active, setActive] = useState<TeamMember | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [navbarH, setNavbarH] = useState(0);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 640);
      const header = document.querySelector("header") as HTMLElement | null;
      setNavbarH(header?.offsetHeight ?? 0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const drawerStyle = {
    top: navbarH,
    bottom: 0,
    height: "auto",
    ...(isMobile ? {} : { width: "66.666vw", maxWidth: "66.666vw" }),
  };

  return (
    <Section variant="light">
      <div className="max-w-2xl">
        {block.title && <Eyebrow>{block.title}</Eyebrow>}
        {block.subtitle && <h2 className="display-2 mt-3">{block.subtitle}</h2>}
        {block.content && <p className="body-lg mt-4 text-ink-soft">{block.content}</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {block.items.map((m) => (
          <button key={m.name} onClick={() => setActive(m)} className="text-left group">
            <div className="relative aspect-3/4 overflow-hidden">
              <SmartImage image={m.image} sizes="(max-width:768px) 100vw, 33vw"
                className="transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="display-3 mt-4">{m.name}</h3>
            <p className="eyebrow mt-1">{m.role}</p>
          </button>
        ))}
      </div>

      <Sheet open={!!active} onOpenChange={(o) => { if (!o) setActive(null); }}>
        <SheetContent
          side="right"
          showCloseButton={false}
          style={drawerStyle}
          className="bg-ink text-paper p-0 border-l border-paper/10 flex flex-col"
        >
          {active && (
            <div className="flex flex-col sm:flex-row h-full overflow-hidden">

              {/* Image */}
              <div className="relative shrink-0 h-56 sm:h-full sm:w-1/2 overflow-hidden">
                <SmartImage image={active.image} sizes="33vw" />
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 rounded-full bg-ink/50 hover:bg-ink/80 text-paper backdrop-blur-sm transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Bio */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-8 pt-12 pb-16 flex flex-col">
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
        </SheetContent>
      </Sheet>
    </Section>
  );
}
