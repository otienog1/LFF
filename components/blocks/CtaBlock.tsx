import Link from "next/link";
import type { CtaBlock as CtaBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CtaArrow } from "@/components/ui/CtaArrow";
import { Reveal } from "@/components/motion/Reveal";
import { PortraitPair } from "@/components/home/PortraitPair";

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
              <Eyebrow className="text-paper/70! mb-5">{block.subtitle}</Eyebrow>
            )}
            <h2 className="display-2 text-paper max-w-[18ch]">{block.title}</h2>
            {block.content && (
              <p className="body-lg mt-6 text-paper/70 max-w-[48ch]">{block.content}</p>
            )}
            {block.cta && (
              <Link
                href={block.cta.link}
                className={cn(buttonVariants({ size: "lg" }), "mt-10 inline-flex text-[13px]")}
              >
                {block.cta.label}
                <CtaArrow />
              </Link>
            )}
          </Reveal>

          {/* Right: two staggered portrait photographs */}
          <PortraitPair images={[img1, img2]} />

        </div>
      </Section>
    );
  }

  /* Without photographs: the title on the left, the text and both links on the right. */
  return (
    <Section variant={variant}>
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
        <div className="lg:col-span-7">
          {block.subtitle && <Eyebrow className="text-paper/70! mb-5">{block.subtitle}</Eyebrow>}
          <h2 className="display-2 max-w-[18ch] text-balance text-paper">{block.title}</h2>
        </div>
        <div className="mt-8 lg:col-span-4 lg:col-start-9 lg:mt-0">
          {block.content && <p className="body-lg m-0 max-w-[40ch] text-paper/70">{block.content}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            {block.cta && (
              <Link href={block.cta.link} className={cn(buttonVariants({ size: "lg" }), "text-[13px]")}>
                {block.cta.label}
                <CtaArrow />
              </Link>
            )}
            {block.secondary && (
              <Link
                href={block.secondary.link}
                className={cn(buttonVariants({ variant: "link" }), "text-paper hover:text-green-light")}
              >
                {block.secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
