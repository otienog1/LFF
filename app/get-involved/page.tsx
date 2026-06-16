import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { CardsBlock } from "@/components/blocks/CardsBlock";
import { ContentBlock } from "@/components/blocks/ContentBlock";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { DonationTiers } from "@/components/get-involved/DonationTiers";
import { PartnerStrip } from "@/components/get-involved/PartnerStrip";
import type {
  HeroBlock as HeroBlockType,
  CardsBlock as CardsBlockType,
  ContentBlock as ContentBlockType,
  CtaBlock as CtaBlockType,
} from "@/types/content";

export function generateMetadata(): Metadata {
  const page = getPage("/get-involved");
  return { title: page?.seo.title, description: page?.seo.description };
}

export default function GetInvolvedPage() {
  const page = getPage("/get-involved");
  if (!page) return null;
  const [hero, ways, tourism, cta] = page.blocks as [
    HeroBlockType,
    CardsBlockType,
    ContentBlockType,
    CtaBlockType,
  ];
  return (
    <>
      <HeroBlock block={hero} variant="interior-dropcap" />
      <CardsBlock block={ways} />
      <DonationTiers />
      <ContentBlock block={tourism} index={0} variant="deep" />
      <PartnerStrip />
      <CtaBlock block={cta} />
    </>
  );
}
