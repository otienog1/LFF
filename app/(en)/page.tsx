import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { ContentBlock } from "@/components/blocks/ContentBlock";
import { CardsBlock } from "@/components/blocks/CardsBlock";
import { ImpactBlock } from "@/components/blocks/ImpactBlock";
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
  const page = getPage("/");
  return { title: page?.seo.title, description: page?.seo.description };
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
      <HeroBlock block={hero} variant="home" />
      <ContentBlock block={philosophy} index={0} />
      <CardsBlock block={focusAreas} />
      <ImpactBlock block={impactHighlight} variant="deep" />
      <EditorialStatement block={belief} />
      <CtaBlock block={cta} />
    </>
  );
}
