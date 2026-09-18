import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import { getProjectsBySlugs } from "@/lib/projects";
import { pageMetadata } from "@/lib/site";
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

export function generateMetadata(): Metadata {
  return pageMetadata(getPage("/get-involved"), "/get-involved", "en");
}

export default async function GetInvolvedPage() {
  // Static rendering: every page that reads translations must set the locale itself.
  setRequestLocale("en");
  const page = getPage("/get-involved");
  if (!page) return null;
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const [hero, ways, tourism, cta] = page.blocks as [HeroBlockType, CardsBlockType, ContentBlockType, CtaBlockType];
  return (
    <>
      <InteriorHero block={hero} />
      {hero.content && <Lede number="01" text={hero.content} />}
      <WaysIndex block={ways} number="02" locale="en" actions={{ "/donate": tNav("donate"), "/contact": tCommon("writeToUs") }} />
      <StorySpread
        block={tourism}
        number="03"
        side="left"
        tone="deep"
        projects={getProjectsBySlugs(tourism.projects ?? [], "en")}
        locale="en"
        fieldLabel={tCommon("fromTheField")}
      />
      <CtaBlock block={cta} />
    </>
  );
}
