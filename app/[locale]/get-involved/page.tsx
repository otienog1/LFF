import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import type { Locale } from "@/i18n/config";
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
  const page = getPage("/get-involved", loc);
  return { title: page?.seo.title, description: page?.seo.description };
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
