import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects, FLAGSHIP_SLUG } from "@/lib/projects";
import { parseWpContent, stripHtml } from "@/lib/wp";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
import { InteriorHero } from "@/components/shared/InteriorHero";
import { Lede } from "@/components/home/Lede";
import { FlagshipProject } from "@/components/projects/FlagshipProject";
import { ArchiveGrid } from "@/components/projects/ArchiveGrid";
import type { ProjectsHeroBlock, ImpactBlock } from "@/types/content";

export function generateMetadata(): Metadata {
  return pageMetadata(getPage("/projects"), "/projects", "en");
}

export default async function ProjectsPage() {
  // Static rendering: every page that reads translations must set the locale itself.
  setRequestLocale("en");
  const t = await getTranslations("projects");
  const tCommon = await getTranslations("common");

  const projects = getProjects("en");
  const flagship = projects.find((p) => p.slug === FLAGSHIP_SLUG);
  const others = projects.filter((p) => p.slug !== FLAGSHIP_SLUG);
  const page = getPage("/projects", "en");
  const [hero] = (page?.blocks ?? []) as [ProjectsHeroBlock];
  // The housed-camps figure lives with the other figures on the Impact page, so it is written once.
  const stats = getPage("/impact", "en")?.blocks.find((b) => b.type === "impact") as ImpactBlock | undefined;
  const figure = stats?.items.find((i) => i.title.includes("25")) ?? null;

  const nodes = flagship ? parseWpContent(flagship.content) : [];
  const paragraphs = nodes
    .filter((n): n is Extract<typeof n, { kind: "p" }> => n.kind === "p")
    .map((n) => stripHtml(n.html))
    .filter(Boolean)
    .slice(0, 2);
  const photos = nodes
    .filter((n): n is Extract<typeof n, { kind: "img" }> => n.kind === "img")
    .map((n) => ({ url: n.src, alt: n.alt || flagship?.title || "" }));

  const sponsor = { title: t("sponsorTitle"), body: t("sponsorBody"), cta: t("sponsorCta"), contact: t("sponsorContact") };
  return (
    <>
      <InteriorHero block={{ title: hero?.title ?? "Projects", subtitle: hero?.subtitle, image: hero?.image }} />
      {hero?.content && <Lede number="01" text={hero.content} />}
      {flagship && (
        <FlagshipProject
          project={flagship}
          paragraphs={paragraphs}
          photos={photos}
          figure={figure}
          locale={"en"}
          number="02"
          labels={{ flagship: t("flagship"), readWriteup: tCommon("readWriteup"), sponsor }}
        />
      )}
      <ArchiveGrid projects={others} locale={"en"} number={flagship ? "03" : "02"} label={t("allProjects")} />
    </>
  );
}
