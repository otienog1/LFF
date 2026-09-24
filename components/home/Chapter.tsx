import { cn } from "@/lib/utils";

export type ChapterTone = "light" | "deep" | "inverse" | "green";

const surface: Record<ChapterTone, string> = {
  light: "bg-paper text-ink border-b border-line",
  deep: "bg-paper-deep text-ink border-b border-line",
  inverse: "bg-ink text-paper border-b border-paper/10",
  green: "bg-green text-paper border-b border-green-deep",
};

const rule: Record<ChapterTone, string> = {
  light: "bg-line",
  deep: "bg-line",
  inverse: "bg-paper/10",
  green: "bg-paper/15",
};

/** Distance from the viewport edge to the container edge: the page grid's outer gutter. */
const EDGE = "calc((100% - min(var(--container-w), 100%)) / 2)";

/**
 * A chapter of the home page. A full-width section whose container edges are
 * drawn as hairline column rules on large screens, so the page reads as one
 * continuous printed grid rather than a stack of unrelated blocks.
 */
export function Chapter({
  tone = "light",
  id,
  className,
  rulesFrom = "top-0",
  children,
}: {
  tone?: ChapterTone;
  id?: string;
  className?: string;
  /** Where the column rules start. A chapter that opens a page under the transparent header starts them below it. */
  rulesFrom?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn(surface[tone], "relative scroll-mt-24 py-20 md:py-28 lg:py-36")}>
      <span aria-hidden="true" className={cn("hidden lg:block absolute bottom-0 w-px", rulesFrom, rule[tone])} style={{ left: EDGE }} />
      <span aria-hidden="true" className={cn("hidden lg:block absolute bottom-0 w-px", rulesFrom, rule[tone])} style={{ right: EDGE }} />
      <div className={cn("container relative", className)}>{children}</div>
    </section>
  );
}

/** Chapter numeral, a short rule and the chapter's name, in place of a bare eyebrow. */
export function ChapterMark({
  number,
  label,
  tone = "light",
  className,
}: {
  number: string;
  label?: string;
  tone?: ChapterTone;
  className?: string;
}) {
  const dark = tone === "inverse" || tone === "green";
  return (
    <p className={cn("m-0 flex items-center gap-4", className)}>
      <span className={cn("font-display text-xl leading-none tabular-nums", dark ? "text-paper" : "text-green")}>{number}</span>
      <span aria-hidden="true" className={cn("h-px w-10", dark ? "bg-paper/40" : "bg-green/60")} />
      {label && <span className={cn("eyebrow", dark && "text-paper/70!")}>{label}</span>}
    </p>
  );
}
