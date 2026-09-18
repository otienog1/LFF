import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
import { InteriorHero } from "@/components/shared/InteriorHero";
import { Lede } from "@/components/home/Lede";
import { Legacy } from "@/components/about/Legacy";
import { Words } from "@/components/about/Words";
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

export function generateMetadata(): Metadata {
  return pageMetadata(getPage("/about"), "/about", "en");
}

export default function AboutPage() {
  const page = getPage("/about");
  if (!page) return null;
  const [hero, legacy, luigiPanel, guides, team, cta] = page.blocks as [
    HeroBlockType,
    ContentBlockType,
    LuigiPanelBlockType,
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
      <Principles block={guides} />
      <Trustees block={team} />
      <CtaBlock block={cta} />
    </>
  );
}
