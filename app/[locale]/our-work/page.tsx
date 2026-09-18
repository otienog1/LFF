import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import { getProjectsBySlugs } from "@/lib/projects";
import { pageMetadata } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import { InteriorHero } from "@/components/shared/InteriorHero";
import { Lede } from "@/components/home/Lede";
import { ProgrammeStack } from "@/components/our-work/ProgrammeStack";
import { ProgrammeText } from "@/components/our-work/ProgrammeText";
import { Chapter } from "@/components/home/Chapter";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import type {
  HeroBlock as HeroBlockType,
  ContentBlock as ContentBlockType,
  StatementBlock as StatementBlockType,
  CtaBlock as CtaBlockType,
} from "@/types/content";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "pt" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return pageMetadata(getPage("/our-work", loc), "/our-work", loc);
}

export default async function OurWorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);

  const page = getPage("/our-work", loc);
  if (!page) return null;
  const t = await getTranslations("ourWork");
  const tCommon = await getTranslations("common");
  const hero = page.blocks.find((b) => b.type === "hero") as HeroBlockType;
  const programmes = page.blocks.filter((b) => b.type === "content") as ContentBlockType[];
  const summary = page.blocks.find((b) => b.type === "statement") as StatementBlockType | undefined;
  const cta = page.blocks.find((b) => b.type === "cta") as CtaBlockType | undefined;
  return (
    <>
      <InteriorHero block={hero} />
      {hero.content && <Lede text={hero.content} />}
      <Chapter tone="light" id="programmes">
        <ProgrammeStack
          navLabel={t("contents")}
          images={programmes.map((block) => block.image ?? null)}
          blocks={programmes.map((block, i) => ({
            id: block.id,
            title: block.title ?? "",
            content: (
              <ProgrammeText
                block={block}
                number={String(i + 1).padStart(2, "0")}
                projects={getProjectsBySlugs(block.projects ?? [], loc)}
                locale={loc}
                fieldLabel={tCommon("fromTheField")}
              />
            ),
          }))}
        />
      </Chapter>
      {summary && <Lede tone="deep" number="05" label={summary.subtitle} text={summary.content} />}
      {cta && <CtaBlock block={cta} />}
    </>
  );
}
