import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CardsBlock } from "@/types/content";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/site";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Photo } from "@/components/home/Photo";
import { Reveal } from "@/components/motion/Reveal";

/**
 * What the numbers mean: four statements, each led by a square photograph of
 * the programme it comes from and linking to that programme. Photographs are
 * unmasked as they arrive; the statements rise in after them.
 */
export function Meanings({ block, number, locale }: { block: CardsBlock; number: string; locale: Locale }) {
  return (
    <Chapter tone="deep" id={block.id}>
      <ChapterMark number={number} label={block.title} />
      {block.subtitle && <SplitHeading text={block.subtitle} className="display-2 mt-6 max-w-[22ch]" />}
      {block.content && <p className="body-lg mt-6 max-w-[58ch] text-ink-soft">{block.content}</p>}

      <ol className="m-0 mt-14 grid list-none gap-x-8 gap-y-14 p-0 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
        {block.items.map((item, i) => {
          const body = (
            <>
              {item.image && (
                <Photo image={item.image} sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="aspect-square" drift={3} scale={1.08} />
              )}
              <span className="mt-6 flex items-center gap-4">
                <span className="font-display text-lg leading-none tabular-nums text-green">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" className="h-px flex-1 bg-ink/15" />
                {item.link && (
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-green opacity-0 -translate-x-1 translate-y-1 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
                  />
                )}
              </span>
              <h3 className="display-3 mt-4 transition-colors duration-200 group-hover:text-green">{item.title}</h3>
              <p className="m-0 mt-3 text-ink-soft">{item.description}</p>
            </>
          );
          return (
            <li key={item.title}>
              <Reveal delay={i * 0.08}>
                {item.link ? (
                  <Link href={localePath(locale, item.link)} className="group block focus-visible:outline-offset-4">
                    {body}
                  </Link>
                ) : (
                  <div>{body}</div>
                )}
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Chapter>
  );
}
