import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import { getProjectsBySlugs } from "@/lib/projects";
import { pageMetadata } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import { InteriorHero } from "@/components/shared/InteriorHero";
import { Lede } from "@/components/home/Lede";
import { FiguresLedger } from "@/components/impact/FiguresLedger";
import { StorySpread } from "@/components/shared/StorySpread";
import { Meanings } from "@/components/impact/Meanings";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import type {
  HeroBlock as HeroBlockType,
  ImpactBlock as ImpactBlockType,
  ContentBlock as ContentBlockType,
  CardsBlock as CardsBlockType,
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
  return pageMetadata(getPage("/impact", loc), "/impact", loc);
}

export default async function ImpactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);

  const page = getPage("/impact", loc);
  if (!page) return null;
  const tCommon = await getTranslations("common");
  const hero = page.blocks.find((b) => b.type === "hero") as HeroBlockType;
  const stats = page.blocks.find((b) => b.type === "impact") as ImpactBlockType;
  const crisis = page.blocks.find((b) => b.type === "content") as ContentBlockType;
  const meaning = page.blocks.find((b) => b.type === "cards") as CardsBlockType;
  const cta = page.blocks.find((b) => b.type === "cta") as CtaBlockType | undefined;
  return (
    <>
      <InteriorHero block={hero} />
      {hero.content && <Lede number="01" text={hero.content} />}
      <FiguresLedger block={stats} number="02" />
      <StorySpread
        block={crisis}
        number="03"
        side="right"
        projects={getProjectsBySlugs(crisis.projects ?? [], loc)}
        locale={loc}
        fieldLabel={tCommon("fromTheField")}
      />
      <Meanings block={meaning} number="04" locale={loc} />
      {cta && <CtaBlock block={cta} />}
    </>
  );
}
