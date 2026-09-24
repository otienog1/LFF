import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { projectThumbnail } from "@/lib/projects";
import { stripHtml } from "@/lib/wp";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/site";
import { Photo } from "@/components/home/Photo";

export function formatMonth(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, { month: "long", year: "numeric" }).format(new Date(iso));
}

export function formatDay(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

/**
 * A project's date at the precision the record supports. Most entries are known to the month (a day stored as
 * the 1st, or a day the research marks as a guess), so the month and year are shown; work dated only to a year
 * (`datePrecision: "year"`) shows the year alone rather than an invented January.
 */
export function formatProjectDate(project: Pick<Project, "date" | "datePrecision">, locale: Locale) {
  if (project.datePrecision === "year") {
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, { year: "numeric" }).format(new Date(project.date));
  }
  return formatMonth(project.date, locale);
}

/**
 * An archive entry: the photograph, the month, the title. The card is the
 * link; on hover and keyboard focus the title turns green and an arrow slides
 * in at the end of the date rule.
 */
export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const image = projectThumbnail(project);
  return (
    <Link href={localePath(locale, `/projects/${project.slug}`)} className="group block focus-visible:outline-offset-4">
      {image && (
        <Photo
          image={image}
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="aspect-4/3"
          drift={3}
          scale={1.08}
          pendingText={project.excerpt ? stripHtml(project.excerpt) : undefined}
        />
      )}
      <span className="mt-5 flex items-center gap-4">
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink-soft">{formatProjectDate(project, locale)}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-ink/15" />
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 shrink-0 text-green opacity-0 -translate-x-1 translate-y-1 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
        />
      </span>
      <h3 className="display-3 mt-3 transition-colors duration-200 group-hover:text-green">{project.title}</h3>
    </Link>
  );
}
