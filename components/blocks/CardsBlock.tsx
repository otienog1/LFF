import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CardsBlock as CardsBlockType, CardItem } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Numbered card. When the item carries a link the whole card is the link:
 * the title turns green and an arrow slides in at the top right on hover
 * and on keyboard focus. Without a link it is plain text.
 */
function Card({ item, index }: { item: CardItem; index: number }) {
  const number = String(index + 1).padStart(2, "0");
  const body = (
    <>
      <span className="flex items-start justify-between">
        <span className="text-[13px] text-ink-soft">{number}</span>
        {item.link && (
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 text-green opacity-0 -translate-x-1 translate-y-1 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
          />
        )}
      </span>
      <h3 className="display-3 mt-2 transition-colors duration-200 group-hover:text-green">{item.title}</h3>
      <p className="mt-3 text-ink-soft">{item.description}</p>
    </>
  );
  if (!item.link) return <div className="pt-5">{body}</div>;
  return (
    <Link href={item.link} className="group block h-full pt-5 focus-visible:outline-offset-4">
      {body}
    </Link>
  );
}

export function CardsBlock({ block, variant = "light" }: { block: CardsBlockType; variant?: "light" | "deep"; }) {
  return (
    <Section variant={variant}>
      <div className="max-w-2xl">
        {block.title && <Eyebrow>{block.title}</Eyebrow>}
        {block.subtitle && <h2 className="display-2 mt-3">{block.subtitle}</h2>}
        {block.content && <p className="body-lg mt-4 text-ink-soft">{block.content}</p>}
      </div>
      <div className={`grid md:grid-cols-3 gap-8 lg:gap-10 mt-12 ${block.items.length === 4 ? "sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4" : ""}`}>
        {block.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08} className="border-t-2 border-green">
            <Card item={item} index={i} />
          </Reveal>
        ))}
      </div>
      {block.cta && (
        <div className="mt-10">
          <Link href={block.cta.link} className={cn(buttonVariants({ variant: "link" }))}>{block.cta.label}</Link>
        </div>
      )}
    </Section>
  );
}
