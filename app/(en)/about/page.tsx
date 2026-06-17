import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { ContentBlock } from "@/components/blocks/ContentBlock";
import { CardsBlock } from "@/components/blocks/CardsBlock";
import { TeamBlock } from "@/components/blocks/TeamBlock";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { LuigiPanel } from "@/components/about/LuigiPanel";
import type {
  HeroBlock as HeroBlockType,
  ContentBlock as ContentBlockType,
  CardsBlock as CardsBlockType,
  LuigiPanelBlock as LuigiPanelBlockType,
  TeamBlock as TeamBlockType,
  CtaBlock as CtaBlockType,
} from "@/types/content";

export function generateMetadata(): Metadata {
  const page = getPage("/about");
  return { title: page?.seo.title, description: page?.seo.description };
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
      <HeroBlock block={hero} variant="interior-split" />
      <ContentBlock block={legacy} index={0} />
      <LuigiPanel block={luigiPanel} />
      <CardsBlock block={guides} />
      <TeamBlock block={team} />
      <CtaBlock block={cta} />
    </>
  );
}
