import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { projectThumbnail } from "@/lib/projects";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";

function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, { month: "long", year: "numeric" }).format(new Date(iso));
}

/**
 * Field projects related to a section: dated rows with their own photographs,
 * linking into the archive. `rule` sets the hairline colour for the tone the
 * list sits on. Renders nothing when there are no projects.
 */
export function FieldProjects({
  projects,
  locale,
  label,
  className,
  rule = "border-ink/15",
}: {
  projects: Project[];
  locale: Locale;
  label: string;
  className?: string;
  rule?: string;
}) {
  if (projects.length === 0) return null;
  return (
    <Reveal className={className}>
      <p className="eyebrow m-0">{label}</p>
      <ol className={cn("m-0 mt-4 list-none border-t p-0", rule)}>
        {projects.map((project) => (
          <li key={project.slug} className={cn("border-b", rule)}>
            <Link
              href={localePath(locale, `/projects/${project.slug}`)}
              className="group flex items-center gap-5 py-4 focus-visible:outline-offset-[-2px]"
            >
              {projectThumbnail(project) && (
                <span className="relative block aspect-3/2 w-24 shrink-0 overflow-hidden sm:w-28">
                  <SmartImage image={projectThumbnail(project)!} sizes="112px" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg leading-snug text-ink transition-colors duration-200 group-hover:text-green">
                  {project.title}
                </span>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                  {formatDate(project.date, locale)}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 shrink-0 text-green opacity-0 -translate-x-1 translate-y-1 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
              />
            </Link>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
