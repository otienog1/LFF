import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProject, getProjects } from "@/lib/projects";
import { getPage } from "@/lib/content";
import { ProjectArticle } from "@/components/projects/ProjectArticle";
import type { ImpactBlock } from "@/types/content";

/** Only the params listed below are built; anything else is the exported 404 page. (The dev server still answers such URLs with its own export-mode error.) */
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  setRequestLocale("en");
  const { slug } = await params;
  const project = getProject(slug);
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
  params: Promise<{ slug: string }>;
}) {
  setRequestLocale("en");
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations("projects");
  const all = getProjects("en");
  const stats = getPage("/impact", "en")?.blocks.find((b) => b.type === "impact") as ImpactBlock | undefined;
  const figure = stats?.items.find((i) => i.title.includes("25")) ?? null;
  return (
    <ProjectArticle
      project={project}
      all={all}
      locale={"en"}
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
