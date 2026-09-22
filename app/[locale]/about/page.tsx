import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import { InteriorHero } from "@/components/shared/InteriorHero";
import { Lede } from "@/components/home/Lede";
import { Legacy } from "@/components/about/Legacy";
import { Words } from "@/components/about/Words";
import { Namesake } from "@/components/about/Namesake";
import { Principles } from "@/components/about/Principles";
import { Trustees } from "@/components/about/Trustees";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import type {
  HeroBlock as HeroBlockType,
  ContentBlock as ContentBlockType,
  CardsBlock as CardsBlockType,
  LuigiPanelBlock as LuigiPanelBlockType,
  TeamBlock as TeamBlockType,
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
  return pageMetadata(getPage("/about", loc), "/about", loc);
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);

  const page = getPage("/about", loc);
  if (!page) return null;
  const [hero, legacy, luigiPanel, namesake, guides, team, cta] = page.blocks as [
    HeroBlockType,
    ContentBlockType,
    LuigiPanelBlockType,
    ContentBlockType,
    CardsBlockType,
    TeamBlockType,
    CtaBlockType,
  ];
  return (
    <>
      <InteriorHero block={hero} />
      {hero.content && <Lede number="01" text={hero.content} />}
      <Legacy block={legacy} />
      <Words block={luigiPanel} />
      <Namesake block={namesake} />
      <Principles block={guides} />
      <Trustees block={team} />
      <CtaBlock block={cta} />
    </>
  );
}
