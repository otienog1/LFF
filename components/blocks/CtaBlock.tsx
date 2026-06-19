import Link from "next/link";
import type { CtaBlock as CtaBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SmartImage } from "@/components/ui/SmartImage";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";

export function CtaBlock({
  block,
  variant = "inverse",
}: {
  block: CtaBlockType;
  variant?: "inverse" | "green" | "green-deep";
}) {
  const hasImages = block.images && block.images.length >= 2;

  if (hasImages) {
    const [img1, img2] = block.images!;
    return (
      <Section variant={variant}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: text */}
          <Reveal>
            {block.subtitle && (
              <Eyebrow className="text-paper/50! mb-5">{block.subtitle}</Eyebrow>
            )}
            <h2 className="display-2 text-paper max-w-[18ch]">{block.title}</h2>
            {block.content && (
              <p className="body-lg mt-6 text-paper/70 max-w-[48ch]">{block.content}</p>
            )}
            {block.cta && (
              <Link
                href={block.cta.link}
                className={`${buttonVariants()} mt-10 inline-flex`}
              >
                {block.cta.label}
              </Link>
            )}
          </Reveal>

          {/* Right: two staggered portrait images */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="relative aspect-3/4 overflow-hidden">
              <SmartImage image={img1} sizes="(max-width:768px) 50vw, 25vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden mt-14">
              <SmartImage image={img2} sizes="(max-width:768px) 50vw, 25vw" />
            </div>
          </div>

        </div>
      </Section>
    );
  }

  /* Fallback: centered layout for CTAs without paired images */
  return (
    <Section variant={variant} className="text-center">
      <h2 className="display-2 max-w-[20ch] mx-auto text-paper">{block.title}</h2>
      {block.subtitle && <p className="eyebrow mt-4 text-paper/70!">{block.subtitle}</p>}
      {block.content && (
        <p className="body-lg mt-5 max-w-[52ch] mx-auto text-paper/75">{block.content}</p>
      )}
      {block.cta && (
        <Link href={block.cta.link} className={`${buttonVariants()} mt-8`}>
          {block.cta.label}
        </Link>
      )}
    </Section>
  );
}
