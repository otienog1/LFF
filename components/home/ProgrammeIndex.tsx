import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CardsBlock as CardsBlockType, CardItem } from "@/types/content";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const row =
  "group grid gap-y-3 md:grid-cols-12 md:gap-x-8 md:items-baseline py-8 md:py-10 md:-mx-4 md:px-4 transition-colors duration-200 hover:bg-paper-deep";

/**
 * One programme as an index row: numeral, title, description, arrow. The whole
 * row is the link. On hover and keyboard focus the numeral turns green, the
 * title steps right and the arrow slides in.
 */
function Row({ item, index }: { item: CardItem; index: number }) {
  const number = String(index + 1).padStart(2, "0");
  const inner = (
    <>
      <span className="md:col-span-1 font-display text-lg leading-none tabular-nums text-ink-soft transition-colors duration-200 group-hover:text-green group-focus-visible:text-green">
        {number}
      </span>
      <span className="md:col-span-5 font-display font-medium text-[clamp(1.625rem,2.6vw,2.5rem)] leading-[1.08] tracking-[-0.01em] transition-transform duration-300 ease-out group-hover:translate-x-2 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
        {item.title}
      </span>
      <span className="md:col-span-5 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">
        {item.description}
      </span>
      <span className="md:col-span-1 md:justify-self-end">
        {item.link && (
          <ArrowUpRight
            aria-hidden="true"
            className="size-5 text-green opacity-0 -translate-x-1 translate-y-1 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
          />
        )}
      </span>
    </>
  );
  if (!item.link) return <div className={row}>{inner}</div>;
  return (
    <Link href={item.link} className={cn(row, "focus-visible:outline-offset-[-2px]")}>
      {inner}
    </Link>
  );
}

/** Chapter 03. The programmes as a numbered index, not a card grid. */
export function ProgrammeIndex({ block }: { block: CardsBlockType }) {
  return (
    <Chapter tone="light">
      <ChapterMark number="03" label={block.title} />
      {block.subtitle && <SplitHeading text={block.subtitle} className="display-2 mt-6 max-w-[22ch]" />}
      {block.content && <p className="body-lg mt-6 max-w-[58ch] text-ink-soft">{block.content}</p>}
      <ol className="m-0 mt-14 list-none border-t border-line p-0 md:mt-20">
        {block.items.map((item, i) => (
          <li key={item.title} className="border-b border-line">
            <Reveal delay={i * 0.06}>
              <Row item={item} index={i} />
            </Reveal>
          </li>
        ))}
      </ol>
      {block.cta && (
        <div className="mt-10">
          <Link href={block.cta.link} className={cn(buttonVariants({ variant: "link" }))}>{block.cta.label}</Link>
        </div>
      )}
    </Chapter>
  );
}
