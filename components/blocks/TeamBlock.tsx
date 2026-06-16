"use client";
import { useState } from "react";
import type { TeamBlock as TeamBlockType, TeamMember } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SmartImage } from "@/components/ui/SmartImage";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function TeamBlock({ block }: { block: TeamBlockType }) {
  const [active, setActive] = useState<TeamMember | null>(null);
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
            <div className="relative aspect-[3/4] overflow-hidden">
              <SmartImage image={m.image} sizes="(max-width:768px) 100vw, 33vw"
                className="transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="display-3 mt-4">{m.name}</h3>
            <p className="eyebrow mt-1">{m.role}</p>
          </button>
        ))}
      </div>
      <Sheet open={!!active} onOpenChange={(o) => { if (!o) setActive(null); }}>
        <SheetContent side="right" className="bg-paper overflow-y-auto max-w-md">
          {active && (
            <div className="p-6">
              <div className="relative aspect-[3/4] mb-6"><SmartImage image={active.image} sizes="400px" /></div>
              <h3 className="display-2">{active.name}</h3>
              <p className="eyebrow mt-1">{active.role}</p>
              <p className="mt-5 text-ink-soft leading-relaxed">{active.bio}</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Section>
  );
}
