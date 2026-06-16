import type { ContentBlock as ContentBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SmartImage } from "@/components/ui/SmartImage";
import { Reveal } from "@/components/motion/Reveal";

export function ContentBlock({ block, index = 0, variant = "light", id, aspectRatio }: {
  block: ContentBlockType;
  index?: number;
  variant?: "light" | "deep";
  id?: string;
  aspectRatio?: string;
}) {
  const imageRight = index % 2 === 0;
  const imgAspect = aspectRatio ?? "aspect-[4/3]";
  return (
    <Section id={id} variant={variant}>
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <Reveal className={imageRight ? "md:order-1" : "md:order-2"}>
          {block.title && <Eyebrow>{block.title}</Eyebrow>}
          {block.subtitle && <h2 className="display-2 mt-3 max-w-[20ch]">{block.subtitle}</h2>}
          {block.content && <p className="body-lg mt-5 text-ink-soft max-w-[58ch]">{block.content}</p>}
        </Reveal>
        {block.image && (
          <div className={`relative ${imgAspect} ${imageRight ? "md:order-2" : "md:order-1"}`}>
            <SmartImage image={block.image} sizes="(max-width:768px) 100vw, 50vw" />
          </div>
        )}
      </div>
    </Section>
  );
}
