import Link from "next/link";
import type { HeroBlock as HeroBlockType } from "@/types/content";
import { SmartImage } from "@/components/ui/SmartImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buttonVariants } from "@/components/ui/button";

export function HeroBlock({ block, variant = "home" }: { block: HeroBlockType; variant?: "home" | "interior"; }) {
  const tall = variant === "home";
  return (
    <section className={`relative flex items-center ${tall ? "min-h-[88vh]" : "min-h-[60vh] pt-24"}`}>
      {block.image && (
        <div className="absolute inset-0 -z-10">
          <SmartImage image={block.image} priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/75 to-ink/15" />
        </div>
      )}
      <div className="container text-paper">
        <Eyebrow className="text-paper/80!">Luigi Footprints Foundation</Eyebrow>
        <h1 className="display-1 max-w-[16ch] mt-4">{block.title}</h1>
        {block.subtitle && <p className="body-lg mt-5 max-w-[44ch] text-paper/85">{block.subtitle}</p>}
        {block.content && <p className="mt-4 max-w-[52ch] text-paper/75">{block.content}</p>}
        {block.cta && (
          <Link href={block.cta.link} className={`${buttonVariants()} mt-7`}>{block.cta.label}</Link>
        )}
      </div>
    </section>
  );
}
