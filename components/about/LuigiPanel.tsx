import type { LuigiPanelBlock } from "@/types/content";
import { SmartImage } from "@/components/ui/SmartImage";

export function LuigiPanel({ block }: { block: LuigiPanelBlock }) {
  return (
    <section className="bg-ink text-paper border-b border-paper/10 py-24 md:py-36">
      <div className="container flex flex-col items-center text-center">
        <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden mb-10 ring-1 ring-paper/20">
          <SmartImage image={block.image} sizes="224px" />
        </div>
        <blockquote className="font-display italic text-xl md:text-2xl lg:text-[1.75rem] text-paper/80 max-w-[34ch] leading-[1.45]">
          &ldquo;{block.content}&rdquo;
        </blockquote>
        <div className="mt-8 w-8 h-px bg-paper/20" />
        <p className="mt-5 text-[11px] tracking-[0.2em] uppercase text-paper/40">
          {block.subtitle}
        </p>
      </div>
    </section>
  );
}
