import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { ImpactBlock } from "@/components/blocks/ImpactBlock";
import { ContentBlock } from "@/components/blocks/ContentBlock";
import { CardsBlock } from "@/components/blocks/CardsBlock";
import { TestimonialTicker } from "@/components/impact/TestimonialTicker";
import type {
  HeroBlock as HeroBlockType,
  ImpactBlock as ImpactBlockType,
  TestimonialsBlock as TestimonialsBlockType,
  ContentBlock as ContentBlockType,
  CardsBlock as CardsBlockType,
} from "@/types/content";

export function generateMetadata(): Metadata {
  const page = getPage("/impact");
  return { title: page?.seo.title, description: page?.seo.description };
}

export default function ImpactPage() {
  const page = getPage("/impact");
  if (!page) return null;
  const [hero, stats, testimonials, crisisResponse, summary] = page.blocks as [
    HeroBlockType,
    ImpactBlockType,
    TestimonialsBlockType,
    ContentBlockType,
    CardsBlockType,
  ];
  return (
    <>
      <HeroBlock block={hero} variant="interior-pullquote" />
      <ImpactBlock block={stats} />
      <TestimonialTicker block={testimonials} />
      <ContentBlock block={crisisResponse} index={0} variant="deep" />
      <CardsBlock block={summary} variant="deep" />
    </>
  );
}
