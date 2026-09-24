import Link from "next/link";
import type { ImpactBlock as ImpactBlockType } from "@/types/content";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Photo } from "@/components/home/Photo";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { Reveal } from "@/components/motion/Reveal";
import { START } from "@/components/motion/presets";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Chapter 04. The verified figures rise out of their masks as they arrive,
 * one after another, beside one photograph that grounds them.
 */
export function NumbersPanel({ block }: { block: ImpactBlockType }) {
  return (
    <Chapter tone="deep">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <ChapterMark number="04" label={block.title} />
          {block.subtitle && <SplitHeading text={block.subtitle} className="display-2 mt-6 max-w-[20ch]" />}
          {block.content && <p className="body-lg mt-6 max-w-[58ch] text-ink-soft">{block.content}</p>}

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            {block.items.map((item, i) => (
              <div key={item.title} className="border-t border-ink/15 pt-6">
                <AnimatedNumber value={item.title} className="display-1 block text-green" />
                <Reveal delay={0.2} start={START.follow}>
                  <p className="m-0 mt-3 max-w-[30ch] text-sm leading-relaxed text-ink-soft">{item.description}</p>
                </Reveal>
              </div>
            ))}
          </div>

          {block.cta && (
            <Reveal className="mt-14">
              <Link href={block.cta.link} className={cn(buttonVariants({ variant: "link" }))}>{block.cta.label}</Link>
            </Reveal>
          )}
        </div>

        {block.image && (
          // On large screens the photograph takes the grid row's height, standing as tall as the figures beside it.
          <div className="mt-14 lg:col-span-5 lg:col-start-8 lg:mt-0">
            <Photo image={block.image} sizes="(max-width:1024px) 100vw, 40vw" className="aspect-4/3 lg:aspect-auto lg:h-full" />
          </div>
        )}
      </div>
    </Chapter>
  );
}
