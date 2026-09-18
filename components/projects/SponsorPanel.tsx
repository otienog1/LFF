import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { CtaArrow } from "@/components/ui/CtaArrow";
import { cn } from "@/lib/utils";

export interface SponsorLabels {
  title: string;
  body: string;
  cta: string;
  contact: string;
}

/**
 * The sponsorship facts for a Dignity House: the unit cost and the plaque,
 * with the two actions, Donate and a note to the foundation. `dark` sets it
 * for an ink chapter.
 */
export function SponsorPanel({
  locale,
  labels,
  dark = false,
  className,
}: {
  locale: Locale;
  labels: SponsorLabels;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("border-t pt-8", dark ? "border-paper/20" : "border-ink/15", className)}>
      <h3 className={cn("display-3", dark ? "text-paper" : "text-ink")}>{labels.title}</h3>
      <p className={cn("m-0 mt-4 max-w-[42ch] text-[15px] leading-relaxed", dark ? "text-paper/70" : "text-ink-soft")}>{labels.body}</p>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link href={localePath(locale, "/donate/dignity-housing")} className={cn(buttonVariants({ size: "lg" }), "text-[13px]")}>
          {labels.cta}
          <CtaArrow />
        </Link>
        <Link
          href={localePath(locale, "/contact")}
          className={cn(buttonVariants({ variant: "link" }), dark && "text-paper hover:text-green-light")}
        >
          {labels.contact}
        </Link>
      </div>
    </div>
  );
}
