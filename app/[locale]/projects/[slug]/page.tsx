import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProject, getProjects } from "@/lib/projects";
import { getPage } from "@/lib/content";
import { ProjectArticle } from "@/components/projects/ProjectArticle";
import type { ImpactBlock } from "@/types/content";
import type { Locale } from "@/i18n/config";

/** Only the params listed below are built; anything else is the exported 404 page. (The dev server still answers such URLs with its own export-mode error.) */
export const dynamicParams = false;

export function generateStaticParams() {
  const locales: Locale[] = ["es", "pt"];
  // Slugs are shared across locales, so the English list names every page.
  const slugs = getProjects("en").map((p) => p.slug);
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
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
  const t = await getTranslations("projects");
  return {
    title: `${project.title} | The Luigi Footprints Foundation`,
    description: project.excerpt?.replace(/<[^>]+>/g, "").trim() || t("fallbackMeta"),
  };
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

  const t = await getTranslations("projects");
  const all = getProjects(loc);
  const stats = getPage("/impact", loc)?.blocks.find((b) => b.type === "impact") as ImpactBlock | undefined;
  const figure = stats?.items.find((i) => i.title.includes("25")) ?? null;
  return (
    <ProjectArticle
      project={project}
      all={all}
      locale={loc}
      figure={figure}
      labels={{
        allProjects: t("allProjects"),
        aboutThisProject: t("aboutThisProject"),
        previous: t("previous"),
        next: t("next"),
        moreProjects: t("moreProjects"),
        sponsor: { title: t("sponsorTitle"), body: t("sponsorBody"), cta: t("sponsorCta"), contact: t("sponsorContact") },
      }}
    />
  );
}
