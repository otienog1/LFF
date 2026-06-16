import Link from "next/link";
import type { CtaBlock as CtaBlockType } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { buttonVariants } from "@/components/ui/button";

export function CtaBlock({ block, variant = "inverse" }: { block: CtaBlockType; variant?: "inverse" | "green" | "green-deep" }) {
  return (
    <Section variant={variant} className="text-center">
      <h2 className="display-2 max-w-[20ch] mx-auto text-paper">{block.title}</h2>
      {block.subtitle && <p className="eyebrow mt-4 text-paper/70!">{block.subtitle}</p>}
      {block.content && <p className="body-lg mt-5 max-w-[52ch] mx-auto text-paper/75">{block.content}</p>}
      {block.cta && (
        <Link href={block.cta.link} className={`${buttonVariants()} mt-8`}>{block.cta.label}</Link>
      )}
    </Section>
  );
}
