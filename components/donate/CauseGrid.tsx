import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Cause } from "@/types/content";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/site";
import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";
import { Photo } from "@/components/home/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { ProgressBar } from "@/components/donate/ProgressBar";

/**
 * The projects a gift can go to, three to a row: the photograph, the title,
 * one line on the work, the progress the foundation has reported where there
 * is any, and the way in. The whole card is the link.
 */
export function CauseGrid({
  causes,
  locale,
  number,
  label,
  heading,
  intro,
  cta,
  progressLabel,
}: {
  causes: Cause[];
  locale: Locale;
  number: string;
  label: string;
  heading: string;
  intro: string;
  cta: string;
  progressLabel: (p: { done: number; total: number; unit: string }) => string;
}) {
  return (
    <Chapter tone="light" id="projects">
      <ChapterMark number={number} label={label} />
      <SplitHeading text={heading} className="display-2 mt-6 max-w-[20ch]" />
      <p className="body-lg mt-6 max-w-[58ch] text-ink-soft">{intro}</p>
      <ol className="m-0 mt-14 grid list-none gap-x-8 gap-y-14 p-0 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
        {causes.map((cause, i) => (
          <li key={cause.id}>
            {/* Each card is the full height of its row and the way in sits at its foot, so the links in a row line up
                whatever the summaries run to. */}
            <Reveal className="h-full">
              <Link href={localePath(locale, `/donate/${cause.slug}`)} className="group flex h-full flex-col focus-visible:outline-offset-4">
                <Photo image={cause.image} sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="aspect-4/3" drift={3} scale={1.08} />
                <h3 className="display-3 mt-6 transition-colors duration-200 group-hover:text-green">{cause.title}</h3>
                <p className="m-0 mt-3 text-[15px] leading-relaxed text-ink-soft">{cause.summary}</p>
                {cause.progress && (
                  <ProgressBar done={cause.progress.done} total={cause.progress.total} label={progressLabel(cause.progress)} className="mt-6" />
                )}
                <span className="mt-auto inline-flex items-center gap-2 self-start pt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-green">
                  {cta}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" />
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}
