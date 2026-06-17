import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProject, getProjects } from "@/lib/projects";
import { getPage } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import type { ProjectsHeroBlock, CommitmentBlock } from "@/types/content";

export function generateStaticParams() {
  const locales: Locale[] = ["es", "pt"];
  // Use en projects to get the slug list (slugs are shared across locales)
  const slugs = getProjects("en").map((p) => p.slug);
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);
  const project = getProject(slug, loc);
  if (!project) return {};
  const t = await getTranslations('projects');
  return {
    title: `${project.title} | The Luigi Footprints Foundation`,
    description:
      project.excerpt?.replace(/<[^>]+>/g, "").trim() ||
      t('fallbackMeta'),
  };
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);

  const project = getProject(slug, loc);
  if (!project) notFound();
  const t = await getTranslations('projects');

  const all = getProjects(loc);
  const idx = all.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;
  const related = all.filter((_, i) => i !== idx).slice(0, 3);

  const categories = project.typesOfProjects ?? [];
  const excerpt = project.excerpt ? stripHtml(project.excerpt) : null;

  const projectsPage = getPage("/projects", loc);
  const [, commitment] = (projectsPage?.blocks ?? []) as [ProjectsHeroBlock, CommitmentBlock];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-end bg-ink">
        {project.featuredImage && (
          <div className="absolute inset-0">
            <Image
              src={project.featuredImage.sourceUrl}
              alt={project.featuredImage.altText || project.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/40 to-ink/10" />
          </div>
        )}
        <div className="relative container pb-16 md:pb-24 pt-32">
          <Link
            href={`/${loc}/projects`}
            className="inline-flex items-center gap-2 text-paper/60 hover:text-paper text-[11px] tracking-[0.15em] uppercase transition-colors mb-8"
          >
            <ArrowLeft size={13} />
            {t('allProjects')}
          </Link>

          {categories.length > 0 && (
            <div className="flex gap-2 mb-4">
              {categories.map((c) => (
                <span
                  key={c.slug}
                  className="text-[10px] tracking-[0.18em] uppercase px-3 py-1 border border-paper/30 text-paper/60 rounded-full"
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="display-1 text-paper max-w-[20ch] capitalize leading-[1.05]">
            {project.title}
          </h1>
          <p className="mt-4 eyebrow text-paper/50">{formatDate(project.date, loc)}</p>
        </div>
      </section>

      {/* ── Body ── */}
      {excerpt && (
        <section className="bg-white border-b border-line py-20 md:py-28">
          <div className="container">
            <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[260px_1fr] gap-12">
              <div>
                <p className="eyebrow">{t('aboutThisProject')}</p>
                <div className="mt-4 w-8 h-px bg-ink/20" />
              </div>
              <div className="md:border-l md:border-line md:pl-12 lg:pl-20">
                <p className="text-ink text-xl md:text-2xl leading-[1.7] font-light tracking-[-0.01em]">
                  {excerpt}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Foundation Context ── */}
      {commitment && (
        <section className="bg-green text-paper border-b border-green-deep py-20 md:py-28">
          <div className="container">
            <div className="max-w-[54ch]">
              <p className="eyebrow text-paper/50 mb-6">{commitment.subtitle}</p>
              <p className="font-display font-light text-2xl md:text-3xl lg:text-[2rem] leading-[1.4] text-paper/90">
                {commitment.content}
              </p>
              <div className="mt-10 flex items-center gap-5">
                <div className="w-8 h-px bg-paper/30" />
                <p className="text-[11px] tracking-[0.2em] uppercase text-paper/40">
                  {commitment.title}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Prev / Next ── */}
      {(prev || next) && (
        <section className="bg-paper-deep border-b border-line py-12">
          <div className="container flex items-center justify-between gap-6">
            {prev ? (
              <Link
                href={`/${loc}/projects/${prev.slug}`}
                className="group flex items-center gap-4 max-w-[40%]"
              >
                <ArrowLeft
                  size={18}
                  className="shrink-0 text-ink/30 group-hover:text-ink transition-colors"
                />
                <span>
                  <p className="eyebrow text-ink/40 mb-1">{t('previous')}</p>
                  <p className="text-sm font-medium text-ink capitalize leading-snug group-hover:text-green transition-colors line-clamp-2">
                    {prev.title}
                  </p>
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link
                href={`/${loc}/projects/${next.slug}`}
                className="group flex items-center gap-4 text-right max-w-[40%] ml-auto"
              >
                <span>
                  <p className="eyebrow text-ink/40 mb-1">{t('next')}</p>
                  <p className="text-sm font-medium text-ink capitalize leading-snug group-hover:text-green transition-colors line-clamp-2">
                    {next.title}
                  </p>
                </span>
                <ArrowRight
                  size={18}
                  className="shrink-0 text-ink/30 group-hover:text-ink transition-colors"
                />
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── Related Projects ── */}
      <section className="bg-paper border-b border-line py-20 md:py-28">
        <div className="container">
          <p className="eyebrow mb-10">{t('moreProjects')}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {related.map((p) => (
              <Link href={`/${loc}/projects/${p.slug}`} key={p.id} className="group flex flex-col">
                {p.featuredImage && (
                  <div className="relative aspect-4/3 overflow-hidden mb-4">
                    <Image
                      src={p.featuredImage.sourceUrl}
                      alt={p.featuredImage.altText || p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <p className="eyebrow text-ink/40 mb-1">{formatDate(p.date, loc)}</p>
                <h3 className="font-display font-medium text-base leading-snug text-ink capitalize group-hover:text-green transition-colors">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
