import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import { getProjectsBySlugs } from "@/lib/projects";
import { pageMetadata } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import { InteriorHero } from "@/components/shared/InteriorHero";
import { Lede } from "@/components/home/Lede";
import { WaysIndex } from "@/components/get-involved/WaysIndex";
import { StorySpread } from "@/components/shared/StorySpread";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import type {
  HeroBlock as HeroBlockType,
  CardsBlock as CardsBlockType,
  ContentBlock as ContentBlockType,
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
  return pageMetadata(getPage("/get-involved", loc), "/get-involved", loc);
}

export default async function GetInvolvedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);

  const page = getPage("/get-involved", loc);
  if (!page) return null;
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const [hero, ways, tourism, cta] = page.blocks as [HeroBlockType, CardsBlockType, ContentBlockType, CtaBlockType];
  return (
    <>
      <InteriorHero block={hero} />
      {hero.content && <Lede number="01" text={hero.content} />}
      <WaysIndex block={ways} number="02" locale={loc} actions={{ "/donate": tNav("donate"), "/contact": tCommon("writeToUs") }} />
      <StorySpread
        block={tourism}
        number="03"
        side="left"
        tone="deep"
        projects={getProjectsBySlugs(tourism.projects ?? [], loc)}
        locale={loc}
        fieldLabel={tCommon("fromTheField")}
      />
      <CtaBlock block={cta} />
    </>
  );
}
