import type { CardsBlock as CardsBlockType } from "@/types/content";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Chapter 05, what guides us. Mission, vision and philosophy as three
 * statements in the display face, each under its numeral and label.
 */
export function Principles({ block }: { block: CardsBlockType }) {
  return (
    <Chapter tone="deep">
      {block.title && <ChapterMark number="05" label={block.title} />}
      {block.subtitle && <SplitHeading text={block.subtitle} className="display-2 mt-6 max-w-[22ch]" />}
      <ol className="m-0 mt-14 grid list-none gap-x-8 gap-y-12 p-0 md:grid-cols-3">
        {block.items.map((item, i) => (
          <li key={item.title} className="border-t border-ink/15 pt-6">
            <Reveal>
              <p className="m-0 flex items-baseline gap-4">
                <span className="font-display text-lg leading-none tabular-nums text-green">{String(i + 1).padStart(2, "0")}</span>
                <span className="eyebrow">{item.title}</span>
              </p>
              <p className="m-0 mt-6 font-display font-light text-ink text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.4]">
                {item.description}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}
