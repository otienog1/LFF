import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CardsBlock, CardItem } from "@/types/content";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/site";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Photo } from "@/components/home/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const ROW =
  "group grid grid-cols-[5.5rem_1fr] gap-x-5 gap-y-3 py-8 md:grid-cols-12 md:items-center md:gap-x-8 md:py-10 md:-mx-4 md:px-4 transition-colors duration-200 hover:bg-paper-deep";

/**
 * One way to help as an index row: a square photograph, numeral, title,
 * description and, at the far right, the action it leads to. The whole row
 * is the link; on hover and keyboard focus the title turns green and the
 * arrow slides.
 */
function Row({ item, index, action, locale }: { item: CardItem; index: number; action: string; locale: Locale }) {
  const number = String(index + 1).padStart(2, "0");
  const inner = (
    <>
      {item.image ? (
        <Photo image={item.image} sizes="(max-width:768px) 88px, 20vw" className="aspect-square md:col-span-2" drift={3} scale={1.08} />
      ) : (
        <span className="aspect-square md:col-span-2" aria-hidden="true" />
      )}
      <span className="min-w-0 md:col-span-7 md:col-start-4">
        <span className="flex items-baseline gap-4">
          <span className="font-display text-base leading-none tabular-nums text-ink-soft transition-colors duration-200 group-hover:text-green group-focus-visible:text-green">
            {number}
          </span>
          <span className="font-display font-medium text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.08] tracking-[-0.01em] transition-colors duration-200 group-hover:text-green">
            {item.title}
          </span>
        </span>
        <span className="mt-3 block max-w-[52ch] text-[15px] leading-relaxed text-ink-soft">{item.description}</span>
      </span>
      {item.link && (
        <span className="col-start-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-green md:col-span-2 md:col-start-11 md:justify-self-end">
          {action}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
          />
        </span>
      )}
    </>
  );
  if (!item.link) return <div className={ROW}>{inner}</div>;
  return (
    <Link href={localePath(locale, item.link)} className={cn(ROW, "focus-visible:outline-offset-[-2px]")}>
      {inner}
    </Link>
  );
}

/**
 * Chapter of ways to help: the four as an index of actions. `actions` maps a
 * destination path to the label shown at the row's end ("Donate", "Write to
 * us"); a destination not in the map shows no label.
 */
export function WaysIndex({
  block,
  number,
  locale,
  actions,
}: {
  block: CardsBlock;
  number: string;
  locale: Locale;
  actions: Record<string, string>;
}) {
  return (
    <Chapter tone="light" id={block.id}>
      <ChapterMark number={number} label={block.title} />
      {block.subtitle && <SplitHeading text={block.subtitle} className="display-2 mt-6 max-w-[22ch]" />}
      {block.content && <p className="body-lg mt-6 max-w-[58ch] text-ink-soft">{block.content}</p>}
      <ol className="m-0 mt-12 list-none border-t border-line p-0 md:mt-16">
        {block.items.map((item, i) => (
          <li key={item.title} className="border-b border-line">
            <Reveal>
              <Row item={item} index={i} action={item.link ? actions[item.link] ?? "" : ""} locale={locale} />
            </Reveal>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}
