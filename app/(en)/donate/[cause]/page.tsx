import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCause, getCauses, getDonate } from "@/lib/donate";
import { CausePage } from "@/components/donate/CausePage";

/** Only the params listed below are built; anything else is the exported 404 page. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getCauses("en").map((c) => ({ cause: c.slug! }));
}

export async function generateMetadata({ params }: { params: Promise<{ cause: string }> }): Promise<Metadata> {
  const { cause: slug } = await params;
  const cause = getCause(slug, "en");
  if (!cause) return {};
  return { title: cause.title, description: cause.summary };
}

export default async function DonateCausePage({ params }: { params: Promise<{ cause: string }> }) {
  setRequestLocale("en");
  const { cause: slug } = await params;
  const cause = getCause(slug, "en");
  if (!cause) notFound();
  const t = await getTranslations("donate");
  const tCommon = await getTranslations("common");
  return (
    <CausePage
      cause={cause}
      donate={getDonate("en")}
      locale="en"
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
