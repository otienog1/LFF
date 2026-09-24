import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { FLAGSHIP_SLUG, projectImage } from "@/lib/projects";
import { inlineHtml, parseWpContent, stripHtml } from "@/lib/wp";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/site";
import { InteriorHero } from "@/components/shared/InteriorHero";
import { Lede } from "@/components/home/Lede";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { Reveal } from "@/components/motion/Reveal";
import { START } from "@/components/motion/presets";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { PhotoGrid } from "@/components/projects/PhotoGrid";
import { ProjectCard, formatProjectDate } from "@/components/projects/ProjectCard";
import { SponsorPanel, type SponsorLabels } from "@/components/projects/SponsorPanel";

export interface ArticleLabels {
  allProjects: string;
  aboutThisProject: string;
  previous: string;
  next: string;
  moreProjects: string;
  sponsor: SponsorLabels;
}

/**
 * A project's page. The hero carries the photograph, the title and the date,
 * with a way back to the archive; the excerpt, where there is one, opens as
 * the lede; the write-up follows as paragraphs and a row of its photographs;
 * the flagship adds the housed-camps figure and the sponsorship panel; and
 * the page closes with three more projects and the previous and next entries.
 * Projects without a write-up go from the hero straight to the archive links.
 */
export function ProjectArticle({
  project,
  all,
  locale,
  labels,
  figure,
}: {
  project: Project;
  /** Every project, newest first. */
  all: Project[];
  locale: Locale;
  labels: ArticleLabels;
  figure: { title: string; description: string } | null;
}) {
  const image = projectImage(project);
  const excerpt = project.excerpt ? stripHtml(project.excerpt) : "";
  const nodes = parseWpContent(project.content);
  // Each paragraph keeps its emphasis (inlineHtml); the plain text is only used to drop a paragraph that repeats the excerpt.
  const paragraphs = nodes
    .filter((n): n is Extract<typeof n, { kind: "p" }> => n.kind === "p")
    .map((n) => ({ text: stripHtml(n.html), html: inlineHtml(n.html) }))
    .filter((p) => p.text && p.text !== excerpt);
  const photos = nodes
    .filter((n): n is Extract<typeof n, { kind: "img" }> => n.kind === "img")
    .map((n) => ({ url: n.src, alt: n.alt || project.title }));
  const isFlagship = project.slug === FLAGSHIP_SLUG;

  const idx = all.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const more = all.filter((p) => p.slug !== project.slug).slice(0, 3);

  let chapter = 0;
  const nextNumber = () => String(++chapter).padStart(2, "0");

  return (
    <>
      <InteriorHero
        block={{ title: project.title, subtitle: formatProjectDate(project, locale), image }}
        lead={
          <Link
            href={localePath(locale, "/projects")}
            className="link-draw inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-paper/80 hover:text-paper"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            {labels.allProjects}
          </Link>
        }
      />

      {excerpt && <Lede number={nextNumber()} text={excerpt} />}

      {(paragraphs.length > 0 || photos.length > 0) && (
        <Chapter tone="deep" id="write-up">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-3">
              <ChapterMark number={nextNumber()} label={labels.aboutThisProject} />
            </div>
            <div className="mt-8 space-y-6 lg:col-span-8 lg:col-start-4 lg:mt-0">
              {paragraphs.map((paragraph, i) => (
                <Reveal key={i}>
                  <p className="body-lg m-0 max-w-[62ch] text-ink-soft [&_b]:font-medium [&_b]:text-ink [&_strong]:font-medium [&_strong]:text-ink" dangerouslySetInnerHTML={{ __html: paragraph.html }} />
                </Reveal>
              ))}
            </div>
          </div>
          <PhotoGrid images={photos} className="mt-14 md:mt-20" />
        </Chapter>
      )}

      {isFlagship && (
        <Chapter tone="inverse" id="sponsor">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5">
              <ChapterMark number={nextNumber()} label={labels.sponsor.title} tone="inverse" />
              {figure && (
                <div className="mt-10">
                  <AnimatedNumber value={figure.title} className="display-1 block text-green-light" />
                  <Reveal delay={0.2} start={START.follow}>
                    <p className="m-0 mt-3 max-w-[30ch] text-sm leading-relaxed text-paper/70">{figure.description}</p>
                  </Reveal>
                </div>
              )}
            </div>
            <div className="mt-12 lg:col-span-6 lg:col-start-7 lg:mt-0">
              <Reveal>
                <SponsorPanel locale={locale} labels={labels.sponsor} dark />
              </Reveal>
            </div>
          </div>
        </Chapter>
      )}

      <Chapter tone="light" id="more">
        <ChapterMark number={nextNumber()} label={labels.moreProjects} />
        <ol className="m-0 mt-12 grid list-none gap-x-8 gap-y-14 p-0 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {more.map((p, i) => (
            <li key={p.id}>
              <Reveal>
                <ProjectCard project={p} locale={locale} />
              </Reveal>
            </li>
          ))}
        </ol>

        {(prev || next) && (
          <nav aria-label={`${labels.previous} / ${labels.next}`} className="mt-16 grid gap-6 border-t border-line pt-8 sm:grid-cols-2 md:mt-20">
            {prev ? (
              <Link href={localePath(locale, `/projects/${prev.slug}`)} className="group flex items-start gap-4 focus-visible:outline-offset-4">
                <ArrowLeft aria-hidden="true" className="mt-1 size-4 shrink-0 text-ink-soft transition-[color,transform] duration-200 ease-out group-hover:-translate-x-1 group-hover:text-green motion-reduce:transition-none" />
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-ink-soft">{labels.previous}</span>
                  <span className="mt-1 block font-display text-lg leading-snug text-ink transition-colors duration-200 group-hover:text-green">{prev.title}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={localePath(locale, `/projects/${next.slug}`)} className="group flex items-start justify-end gap-4 text-right focus-visible:outline-offset-4">
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-ink-soft">{labels.next}</span>
                  <span className="mt-1 block font-display text-lg leading-snug text-ink transition-colors duration-200 group-hover:text-green">{next.title}</span>
                </span>
                <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-ink-soft transition-[color,transform] duration-200 ease-out group-hover:translate-x-1 group-hover:text-green motion-reduce:transition-none" />
              </Link>
            )}
          </nav>
        )}
      </Chapter>
    </>
  );
}
