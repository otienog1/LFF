import type { ContentBlock } from "@/types/content";
import type { Project } from "@/lib/projects";
import type { Locale } from "@/i18n/config";
import { ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Photo } from "@/components/home/Photo";
import { FieldProjects } from "@/components/shared/FieldProjects";

/**
 * One programme's text: chapter mark, heading, body and its field projects
 * as dated rows with their own photographs, linking into the archive. On
 * small screens, and on large ones under prefers-reduced-motion, the
 * programme's photograph sits above the text; otherwise it lives in the
 * pinned column beside the texts (see ProgrammeStack).
 */
export function ProgrammeText({
  block,
  number,
  projects,
  locale,
  fieldLabel,
}: {
  block: ContentBlock;
  number: string;
  projects: Project[];
  locale: Locale;
  fieldLabel: string;
}) {
  return (
    <>
      {block.image && (
        <div className="mb-10 lg:hidden motion-reduce:lg:block">
          <Photo image={block.image} sizes="(max-width:1024px) 100vw, 60vw" className="aspect-4/3" />
        </div>
      )}
      <div data-mark>
        <ChapterMark number={number} label={block.title} />
      </div>
      {block.subtitle && <SplitHeading text={block.subtitle} className="display-2 mt-6 max-w-[18ch]" />}
      {block.content && <p data-body className="body-lg mt-8 max-w-[54ch] whitespace-pre-line text-ink-soft">{block.content}</p>}

      <FieldProjects projects={projects} locale={locale} label={fieldLabel} className="mt-12" />
    </>
  );
}
