import type { ContentBlock } from "@/types/content";
import type { Project } from "@/lib/projects";
import type { Locale } from "@/i18n/config";
import { Chapter, ChapterMark, type ChapterTone } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Photo } from "@/components/home/Photo";
import { FieldProjects } from "@/components/shared/FieldProjects";
import { cn } from "@/lib/utils";

/**
 * A story as a spread: the photograph on five columns, running to the
 * viewport edge on wide screens on the side given and standing exactly as
 * tall as the text beside it; the chapter mark, heading, body and any related
 * field projects on the other six. On small screens the photograph opens the
 * chapter at 4:3.
 */
export function StorySpread({
  block,
  number,
  side = "right",
  tone = "light",
  projects = [],
  locale,
  fieldLabel,
}: {
  block: ContentBlock;
  number: string;
  side?: "left" | "right";
  tone?: ChapterTone;
  projects?: Project[];
  locale: Locale;
  fieldLabel: string;
}) {
  const imageLeft = side === "left";
  return (
    <Chapter tone={tone} id={block.id}>
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-x-8">
        {block.image && (
          <div
            className={cn(
              "order-1 lg:order-none lg:col-span-5 lg:row-start-1 lg:self-stretch",
              imageLeft ? "lg:col-start-1 bleed-left" : "lg:col-start-8 bleed-right",
            )}
          >
            <Photo image={block.image} sizes="(max-width:1024px) 100vw, 45vw" className="aspect-4/3 lg:aspect-auto lg:h-full lg:min-h-[24rem]" />
          </div>
        )}
        <div className={cn("order-2 mt-10 lg:order-none lg:col-span-6 lg:row-start-1 lg:mt-0", imageLeft ? "lg:col-start-7" : "lg:col-start-1")}>
          <ChapterMark number={number} label={block.title} tone={tone} />
          {block.subtitle && <SplitHeading text={block.subtitle} className="display-2 mt-6 max-w-[18ch]" />}
          {block.content && <p className="body-lg mt-8 max-w-[54ch] whitespace-pre-line text-ink-soft">{block.content}</p>}
          <FieldProjects projects={projects} locale={locale} label={fieldLabel} className="mt-12" />
        </div>
      </div>
    </Chapter>
  );
}
