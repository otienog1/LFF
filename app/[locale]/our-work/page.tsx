import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { ContentBlock } from "@/components/blocks/ContentBlock";
import { ProgramNav } from "@/components/our-work/ProgramNav";
import type {
  HeroBlock as HeroBlockType,
  ContentBlock as ContentBlockType,
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
  const page = getPage("/our-work", loc);
  return { title: page?.seo.title, description: page?.seo.description };
}

const PROGRAM_IDS = [
  "education-program",
  "environmental-program",
  "community-program",
  "coexistence-program",
];

export default async function OurWorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);

  const page = getPage("/our-work", loc);
  if (!page) return null;
  const [hero, ...programs] = page.blocks as [HeroBlockType, ...ContentBlockType[]];
  return (
    <>
      <HeroBlock block={hero} variant="interior-split" />
      <ProgramNav />
      {programs.map((block, i) => (
        <ContentBlock
          key={block.id}
          block={block}
          index={i}
          id={PROGRAM_IDS[i]}
        />
      ))}
    </>
  );
}
