import type { ImpactBlock as ImpactBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";

export function ImpactBlock({ block }: { block: ImpactBlockType }) {
  return (
    <Section variant="inverse">
      <div className="max-w-2xl">
        {block.title && <Eyebrow className="text-paper/70!">{block.title}</Eyebrow>}
        {block.subtitle && <h2 className="display-2 mt-3 text-paper">{block.subtitle}</h2>}
        {block.content && <p className="body-lg mt-4 text-paper/70">{block.content}</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-14">
        {block.items.map((item) => (
          <div key={item.title}>
            <AnimatedNumber value={item.title} className="block display-1 text-green-light" />
            <p className="mt-3 text-paper/70 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
