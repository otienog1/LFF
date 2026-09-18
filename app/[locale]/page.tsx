import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import { HomeHero } from "@/components/home/HomeHero";
import { Belief } from "@/components/home/Belief";
import { ProgrammeIndex } from "@/components/home/ProgrammeIndex";
import { NumbersPanel } from "@/components/home/NumbersPanel";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { EditorialStatement } from "@/components/home/EditorialStatement";
import type {
  HeroBlock as HeroBlockType,
  ContentBlock as ContentBlockType,
  CardsBlock as CardsBlockType,
  ImpactBlock as ImpactBlockType,
  EditorialBlock as EditorialBlockType,
  CtaBlock as CtaBlockType,
} from "@/types/content";

/** Only the params listed below are built; anything else is the exported 404 page. (The dev server still answers such URLs with its own export-mode error.) */
export const dynamicParams = false;

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
  return pageMetadata(getPage("/", loc), "/", loc);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);

  const page = getPage("/", loc);
  if (!page) return null;
  const [hero, philosophy, focusAreas, impactHighlight, belief, cta] = page.blocks as [
    HeroBlockType,
    ContentBlockType,
    CardsBlockType,
    ImpactBlockType,
    EditorialBlockType,
    CtaBlockType,
  ];
  return (
    <>
      <HomeHero block={hero} />
      <Belief block={philosophy} />
      <ProgrammeIndex block={focusAreas} />
      <NumbersPanel block={impactHighlight} />
      <EditorialStatement block={belief} />
      <CtaBlock block={cta} />
    </>
  );
}
