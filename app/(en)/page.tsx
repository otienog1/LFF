import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
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

export function generateMetadata(): Metadata {
  return pageMetadata(getPage("/"), "/", "en");
}

export default function HomePage() {
  const page = getPage("/");
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
