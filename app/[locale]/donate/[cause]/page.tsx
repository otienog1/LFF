import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { getCause, getCauses, getDonate } from "@/lib/donate";
import { CausePage } from "@/components/donate/CausePage";

/** Only the params listed below are built; anything else is the exported 404 page. */
export const dynamicParams = false;

export function generateStaticParams() {
  const locales: Locale[] = ["es", "pt"];
  // Slugs are shared across locales, so the English list names every page.
  const slugs = getCauses("en").map((c) => c.slug!);
  return locales.flatMap((locale) => slugs.map((cause) => ({ locale, cause })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; cause: string }> }): Promise<Metadata> {
  const { locale, cause: slug } = await params;
  const cause = getCause(slug, locale as Locale);
  if (!cause) return {};
  return { title: cause.title, description: cause.summary };
}

export default async function DonateCausePage({ params }: { params: Promise<{ locale: string; cause: string }> }) {
  const { locale, cause: slug } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);
  const cause = getCause(slug, loc);
  if (!cause) notFound();
  const t = await getTranslations("donate");
  const tCommon = await getTranslations("common");
  return (
    <CausePage
      cause={cause}
      donate={getDonate(loc)}
      locale={loc}
      labels={{
        back: t("backToProjects"),
        supportProject: t("supportProject"),
        aboutLabel: t("aboutLabel"),
        readProject: t("readProject"),
        sponsorItem: t("sponsorItem"),
        gallery: tCommon("fromTheField"),
        giveHeading: t("giveHeading"),
        giveIntro: t("giveIntro"),
        progress: (p) => t("progress", p),
      }}
    />
  );
}
