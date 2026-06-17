import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import type { Locale } from "@/i18n/config";
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
  const page = getPage("/impact", loc);
  return { title: page?.seo.title, description: page?.seo.description };
}

export default async function ImpactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);

  const page = getPage("/impact", loc);
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
