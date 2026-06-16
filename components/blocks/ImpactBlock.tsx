import type { ImpactBlock as ImpactBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";

export function ImpactBlock({ block, variant = "inverse" }: { block: ImpactBlockType; variant?: "inverse" | "deep" }) {
  const dark = variant === "inverse";
  return (
    <Section variant={variant}>
      <div className="max-w-2xl">
        {block.title && <Eyebrow className={dark ? "text-paper/70!" : undefined}>{block.title}</Eyebrow>}
        {block.subtitle && <h2 className={`display-2 mt-3 ${dark ? "text-paper" : "text-ink"}`}>{block.subtitle}</h2>}
        {block.content && <p className={`body-lg mt-4 ${dark ? "text-paper/70" : "text-ink-soft"}`}>{block.content}</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-14">
        {block.items.map((item) => (
          <div key={item.title}>
            <AnimatedNumber value={item.title} className={`block display-1 ${dark ? "text-green-light" : "text-green"}`} />
            <p className={`mt-3 text-sm ${dark ? "text-paper/70" : "text-ink-soft"}`}>{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
