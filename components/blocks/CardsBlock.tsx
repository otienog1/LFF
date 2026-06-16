import Link from "next/link";
import type { CardsBlock as CardsBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { buttonVariants } from "@/components/ui/button";

export function CardsBlock({ block, variant = "light" }: { block: CardsBlockType; variant?: "light" | "deep"; }) {
  return (
    <Section variant={variant}>
      <div className="max-w-2xl">
        {block.title && <Eyebrow>{block.title}</Eyebrow>}
        {block.subtitle && <h2 className="display-2 mt-3">{block.subtitle}</h2>}
        {block.content && <p className="body-lg mt-4 text-ink-soft">{block.content}</p>}
      </div>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mt-12">
        {block.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08} className="border-t-2 border-green pt-5">
            <span className="text-[13px] text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="display-3 mt-2">{item.title}</h3>
            <p className="mt-3 text-ink-soft">{item.description}</p>
          </Reveal>
        ))}
      </div>
      {block.cta && (
        <div className="mt-10">
          <Link href={block.cta.link} className={buttonVariants({ variant: "link" })}>{block.cta.label}</Link>
        </div>
      )}
    </Section>
  );
}
