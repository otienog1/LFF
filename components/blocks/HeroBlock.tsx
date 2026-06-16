import Link from "next/link";
import type { HeroBlock as HeroBlockType } from "@/types/content";
import { SmartImage } from "@/components/ui/SmartImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buttonVariants } from "@/components/ui/button";
import { Ticker } from "@/components/home/Ticker";

export function HeroBlock({ block, variant = "home" }: {
  block: HeroBlockType;
  variant?: "home" | "interior" | "interior-dropcap" | "interior-split" | "interior-pullquote" | "interior-preview";
}) {
  const tall = variant === "home";
  const showDropCap = variant === "home" || variant === "interior-dropcap";
  const showSplit = variant === "interior-split";
  const showPullQuote = variant === "interior-pullquote";
  const showPreview = variant === "interior-preview"; // all three for picking

  const firstChar = block.content?.[0] ?? "";
  const restContent = block.content?.slice(1) ?? "";
  const sentences = block.content?.split(/(?<=\.) /) ?? [];
  const pullQuote = sentences[0] ?? "";
  const bodyRest = sentences.slice(1).join(" ");

  return (
    <>
      {/* ── Hero image ── */}
      <section className={`relative flex items-end ${tall ? "min-h-screen" : "min-h-[60vh] pt-24"}`}>
        {block.image && (
          <div className="absolute inset-0">
            <SmartImage image={block.image} priority sizes="100vw" />
            <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/30 to-ink/10" />
          </div>
        )}
        <div className="relative container pb-16 md:pb-24 pt-32 md:pt-40 text-paper">
          <Eyebrow className="text-paper/70!">Luigi Footprints Foundation</Eyebrow>
          <h1 className="display-1 max-w-[18ch] mt-4">{block.title}</h1>
          {block.subtitle && (
            <p className="mt-5 text-paper/80 text-sm md:text-base tracking-wide max-w-[44ch]">
              {block.subtitle}
            </p>
          )}
          {block.cta && (
            <Link href={block.cta.link} className={`${buttonVariants()} mt-8 inline-flex`}>
              {block.cta.label}
            </Link>
          )}
        </div>
      </section>

      {/* ── Option A: Editorial column split ── */}
      {block.content && (showSplit || showPreview) && (
        <section className="bg-paper py-24 md:py-36 border-b border-line">
          {showPreview && <p className="container eyebrow mb-8 text-ink/40">Option A — Column split</p>}
          <div className="container">
            <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[260px_1fr]">
              <div className="flex flex-col gap-5 pb-10 md:pb-0 md:pr-12 lg:pr-20">
                <p className="eyebrow">{block.title}</p>
                <div className="w-8 h-px bg-ink/20" />
              </div>
              <div className="md:border-l md:border-line md:pl-12 lg:pl-20">
                <p className="text-ink text-xl md:text-2xl lg:text-[1.625rem] leading-[1.65] font-light tracking-[-0.01em]">
                  {block.content}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Option B: Pull quote extract ── */}
      {block.content && (showPullQuote || showPreview) && (
        <section className="bg-white py-24 md:py-36 border-b border-line">
          {showPreview && <p className="container eyebrow mb-8 text-ink/40">Option B — Pull quote</p>}
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <p className="display-2 text-ink font-medium italic leading-[1.15]">
                  &ldquo;{pullQuote}&rdquo;
                </p>
              </div>
              <div className="md:pt-3 md:border-l md:border-line md:pl-12 lg:pl-16">
                <p className="text-ink-soft text-base lg:text-lg leading-[1.7] font-light">
                  {bodyRest}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Option C: Drop cap ── */}
      {block.content && (showDropCap || showPreview) && (
        <section className="bg-paper py-24 md:py-36 border-b border-line">
          {showPreview && <p className="container eyebrow mb-8 text-ink/40">Option C — Drop cap</p>}
          <div className="container">
            <div className="max-w-3xl">
              <p className="text-ink text-xl md:text-2xl leading-[1.7] font-light">
                <span className="float-left font-display font-medium text-[7rem] md:text-[9rem] leading-[0.8] mr-4 mt-2 text-ink">
                  {firstChar}
                </span>
                {restContent}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Ticker strip (home only) ── */}
      {tall && <Ticker />}
    </>
  );
}
