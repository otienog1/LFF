import type { ContentBlock } from "@/types/content";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Photo } from "@/components/home/Photo";

/**
 * Chapter 02, the legacy. The photograph on the left five columns, square,
 * bleeding past the grid to the viewport edge on wide screens; the text on the
 * right six. On small screens the text comes first.
 */
export function Legacy({ block }: { block: ContentBlock }) {
  return (
    <Chapter tone="light">
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-8">
        {block.image && (
          // On large screens the frame is the grid row's height: the photograph stands exactly as tall as the text.
          <div className="order-2 mt-12 lg:order-1 lg:col-span-5 lg:mt-0 bleed-left">
            <Photo image={block.image} sizes="(max-width:1024px) 100vw, 45vw" className="aspect-4/3 lg:aspect-auto lg:h-full" />
          </div>
        )}
        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          {block.title && <ChapterMark number="02" label={block.title} />}
          {block.subtitle && <SplitHeading text={block.subtitle} className="display-2 mt-6 max-w-[18ch]" />}
          {block.content && (
            <p className="body-lg mt-8 max-w-[54ch] whitespace-pre-line text-ink-soft">{block.content}</p>
          )}
        </div>
      </div>
    </Chapter>
  );
}
