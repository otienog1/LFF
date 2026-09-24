import type { Project } from "@/lib/projects";
import type { Locale } from "@/i18n/config";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";

/** The archive: every other project as a photograph-led entry, newest first, three to a row. */
export function ArchiveGrid({
  projects,
  locale,
  number,
  label,
}: {
  projects: Project[];
  locale: Locale;
  number: string;
  label: string;
}) {
  return (
    <Chapter tone="light" id="archive">
      <ChapterMark number={number} label={label} />
      <ol className="m-0 mt-12 grid list-none gap-x-8 gap-y-14 p-0 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        {projects.map((project, i) => (
          <li key={project.id}>
            <Reveal>
              <ProjectCard project={project} locale={locale} />
            </Reveal>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}
