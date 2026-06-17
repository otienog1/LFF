import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import type { Locale } from "@/i18n/config";
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
  const page = getPage("/about", loc);
  return { title: page?.seo.title, description: page?.seo.description };
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
