import { Chapter, ChapterMark } from "@/components/home/Chapter";
import { SplitHeading } from "@/components/home/SplitHeading";

/**
 * The frame every error page shares: a chapter on ink whose numeral is the
 * status code, the heading rising word by word, a line of explanation and
 * the actions on the left seven columns, and on the right four whatever
 * else leads out of the dead end (the ways through the site).
 */
export function ErrorChapter({
  code,
  label,
  heading,
  body,
  actions,
  aside,
}: {
  code: string;
  label: string;
  heading: string;
  body: string;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  // The chapter fills the viewport (its padding is 10, 14 and 18rem across the breakpoints), so on a short page
  // no paper shows between it and the footer; main starts under the fixed nav and is at least one viewport tall.
  return (
    <Chapter tone="inverse" className="flex min-h-[calc(100svh-10rem)] flex-col justify-center md:min-h-[calc(100svh-14rem)] lg:min-h-[calc(100svh-18rem)]">
      <ChapterMark number={code} label={label} tone="inverse" />
      <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <SplitHeading text={heading} as="h1" className="display-1 max-w-[14ch] text-paper" />
          <p className="body-lg mt-8 max-w-[44ch] text-paper/70">{body}</p>
          {actions && <div className="mt-10">{actions}</div>}
        </div>
        {aside && <div className="mt-14 lg:col-span-4 lg:col-start-9 lg:mt-0">{aside}</div>}
      </div>
    </Chapter>
  );
}
