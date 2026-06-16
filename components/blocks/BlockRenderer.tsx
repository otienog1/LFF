import type { Block } from "@/types/content";
import { HeroBlock } from "./HeroBlock";
import { ContentBlock } from "./ContentBlock";
import { CardsBlock } from "./CardsBlock";
import { ImpactBlock } from "./ImpactBlock";
import { TeamBlock } from "./TeamBlock";
import { CtaBlock } from "./CtaBlock";

export function BlockRenderer({ blocks, heroVariant = "home" }: { blocks: Block[]; heroVariant?: "home" | "interior"; }) {
  let contentIndex = 0;
  return (
    <>
      {blocks.map((block) => {
        switch (block.type) {
          case "hero": return <HeroBlock key={block.id} block={block} variant={heroVariant} />;
          case "content": return <ContentBlock key={block.id} block={block} index={contentIndex++} />;
          case "cards": return <CardsBlock key={block.id} block={block} />;
          case "impact": return <ImpactBlock key={block.id} block={block} />;
          case "team": return <TeamBlock key={block.id} block={block} />;
          case "cta": return <CtaBlock key={block.id} block={block} />;
          default: return null;
        }
      })}
    </>
  );
}
