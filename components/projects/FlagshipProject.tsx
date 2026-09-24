import Link from "next/link";
import type { Project } from "@/lib/projects";
import { projectImage } from "@/lib/projects";
import type { ImageRef } from "@/types/content";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/site";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Photo } from "@/components/home/Photo";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { Reveal } from "@/components/motion/Reveal";
import { START } from "@/components/motion/presets";
import { buttonVariants } from "@/components/ui/button";
import { PhotoGrid } from "@/components/projects/PhotoGrid";
import { SponsorPanel, type SponsorLabels } from "@/components/projects/SponsorPanel";
import { formatMonth } from "@/components/projects/ProjectCard";
import { cn } from "@/lib/utils";

/**
 * The flagship project as its own chapter on ink: the photograph across the
 * full width, then the title and the opening of the write-up on the left
 * seven columns, the housed-camps figure and the sponsorship panel on the
 * right four, and the field photographs from the write-up in a row beneath.
 */
export function FlagshipProject({
  project,
  paragraphs,
  photos,
  figure,
  locale,
  number,
  labels,
}: {
  project: Project;
  /** The write-up's first paragraphs, plain text. */
  paragraphs: string[];
  photos: ImageRef[];
  figure: { title: string; description: string } | null;
  locale: Locale;
  number: string;
  labels: { flagship: string; readWriteup: string; sponsor: SponsorLabels };
}) {
  const image = projectImage(project);
  return (
    <Chapter tone="inverse" id="flagship">
      <ChapterMark number={number} label={labels.flagship} tone="inverse" />

      {image && (
        <div className="mt-10 md:mt-14">
          <Photo image={image} sizes="100vw" className="aspect-16/9 lg:aspect-[2.2/1]" drift={4} scale={1.1} />
        </div>
      )}

      <div className="mt-12 md:mt-16 lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <SplitHeading text={project.title} className="display-2 max-w-[18ch] text-paper" />
          <p className="m-0 mt-4 text-[11px] uppercase tracking-[0.2em] text-paper/70">{formatMonth(project.date, locale)}</p>
          {paragraphs.map((paragraph, i) => (
            <Reveal key={i}>
              <p className="body-lg m-0 mt-6 max-w-[58ch] text-paper/70">{paragraph}</p>
            </Reveal>
          ))}
          <Reveal className="mt-10">
            <Link
              href={localePath(locale, `/projects/${project.slug}`)}
              className={cn(buttonVariants({ variant: "link" }), "text-paper hover:text-green-light")}
            >
              {labels.readWriteup}
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 lg:col-span-4 lg:col-start-9 lg:mt-0">
          {figure && (
            <div className="border-t border-paper/20 pt-6">
              <AnimatedNumber value={figure.title} className="display-1 block text-green-light" />
              <Reveal delay={0.2} start={START.follow}>
                <p className="m-0 mt-3 max-w-[30ch] text-sm leading-relaxed text-paper/70">{figure.description}</p>
              </Reveal>
            </div>
          )}
          <Reveal className={figure ? "mt-12" : undefined}>
            <SponsorPanel locale={locale} labels={labels.sponsor} dark />
          </Reveal>
        </div>
      </div>

      <PhotoGrid images={photos} className="mt-14 md:mt-20" />
    </Chapter>
  );
}
