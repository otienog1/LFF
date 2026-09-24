import type { ContentBlock } from "@/types/content";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Photo } from "@/components/home/Photo";

/**
 * Chapter 04, the elephant who carries the name. The mirror of the legacy
 * chapter: the text on the left six columns, the photograph on the right five,
 * square on large screens and bleeding past the grid to the viewport edge. The
 * man's chapter and the elephant's face each other across the quote panel
 * between them. On small screens the text comes first.
 */
export function Namesake({ block }: { block: ContentBlock }) {
  return (
    <Chapter tone="light" id="namesake">
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-6">
          {block.title && <ChapterMark number="04" label={block.title} />}
          {block.subtitle && <SplitHeading text={block.subtitle} className="display-2 mt-6 max-w-[18ch]" />}
          {block.content && (
            <p className="body-lg mt-8 max-w-[54ch] whitespace-pre-line text-ink-soft">{block.content}</p>
          )}
        </div>
        {block.image && (
          <div className="mt-12 lg:col-span-5 lg:col-start-8 lg:mt-0 bleed-right">
            <Photo image={block.image} sizes="(max-width:1024px) 100vw, 45vw" className="aspect-4/3 lg:aspect-auto lg:h-full" />
          </div>
        )}
      </div>
    </Chapter>
  );
}
