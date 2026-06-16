import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { ContentBlock } from "@/components/blocks/ContentBlock";
import { ProgramNav } from "@/components/our-work/ProgramNav";
import type {
  HeroBlock as HeroBlockType,
  ContentBlock as ContentBlockType,
} from "@/types/content";

export function generateMetadata(): Metadata {
  const page = getPage("/our-work");
  return { title: page?.seo.title, description: page?.seo.description };
}

const PROGRAM_IDS = [
  "education-program",
  "environmental-program",
  "community-program",
  "coexistence-program",
];

export default function OurWorkPage() {
  const page = getPage("/our-work");
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
