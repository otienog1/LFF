import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Cause, DonateData } from "@/types/content";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/site";
import { InteriorHero } from "@/components/shared/InteriorHero";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { PhotoGrid } from "@/components/projects/PhotoGrid";
import { ProgressBar } from "@/components/donate/ProgressBar";
import { ItemLedger } from "@/components/donate/ItemLedger";
import { GeneralGift } from "@/components/donate/GeneralGift";
import { GiftSummary } from "@/components/donate/GiftSummary";
import { JumpLink } from "@/components/donate/JumpLink";

export interface CauseLabels {
  back: string;
  supportProject: string;
  aboutLabel: string;
  readProject: string;
  sponsorItem: string;
  gallery: string;
  giveHeading: string;
  giveIntro: string;
  progress: (p: { done: number; total: number; unit: string }) => string;
}

/**
 * One project's donate page, kept short: the hero, one line on the project
 * with the reported progress beside it and two ways on (down to the items,
 * or out to the project's own page for the full story), the field
 * photographs, the items to sponsor, a gift of any amount, and the gift so
 * far with the checkout.
 */
export function CausePage({ cause, donate, locale, labels }: { cause: Cause; donate: DonateData; locale: Locale; labels: CauseLabels }) {
  let n = 0;
  const next = () => String(++n).padStart(2, "0");
  return (
    <>
      <InteriorHero
        block={{ title: cause.title, subtitle: labels.supportProject, image: cause.image }}
        lead={
          <Link href={localePath(locale, "/donate")} className="link-draw inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-paper/80 hover:text-paper">
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            {labels.back}
          </Link>
        }
      />

      <Chapter tone="light" id="about">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7">
            <ChapterMark number={next()} label={labels.aboutLabel} />
            {/* A one-line summary reads as a heading; the longer programme summaries are set a size down. */}
            <SplitHeading text={cause.summary} className={cause.summary.split(/\s+/).length > 18 ? "mt-6 max-w-[34ch] font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.2] tracking-[-0.01em]" : "display-2 mt-6 max-w-[24ch]"} />
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              {cause.items.length > 0 && <JumpLink to="sponsor">{labels.sponsorItem}</JumpLink>}
              {cause.link && (
                <Link href={localePath(locale, cause.link)} className="link-draw inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-green" data-project-link>
                  {labels.readProject}
                  <ArrowRight aria-hidden="true" className="size-3.5" />
                </Link>
              )}
            </div>
          </div>
          {cause.progress && (
            <Reveal className="mt-12 lg:col-span-4 lg:col-start-9 lg:mt-2">
              <ProgressBar done={cause.progress.done} total={cause.progress.total} label={labels.progress(cause.progress)} />
            </Reveal>
          )}
        </div>
      </Chapter>

      {cause.gallery && cause.gallery.length > 0 && (
        <Chapter tone="deep">
          <ChapterMark number={next()} label={labels.gallery} />
          <PhotoGrid images={cause.gallery} className="mt-10 md:mt-14" />
        </Chapter>
      )}

      {cause.items.length > 0 && <ItemLedger cause={cause} rates={donate.rates} number={next()} />}

      <GeneralGift
        cause={cause}
        donate={donate}
        number={next()}
        heading={labels.giveHeading}
        intro={labels.giveIntro}
        tone={cause.items.length > 0 ? "deep" : "light"}
      />

      <GiftSummary rates={donate.rates} number={next()} />
    </>
  );
}
