import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import { getCauses, getDonate, getGeneral } from "@/lib/donate";
import { pageMetadata } from "@/lib/site";
import { InteriorHero } from "@/components/shared/InteriorHero";
import { Lede } from "@/components/home/Lede";
import { CauseGrid } from "@/components/donate/CauseGrid";
import { GeneralGift } from "@/components/donate/GeneralGift";
import { GiftSummary } from "@/components/donate/GiftSummary";
import type { HeroBlock } from "@/types/content";

export function generateMetadata(): Metadata {
  return pageMetadata(getPage("/donate"), "/donate", "en");
}

export default async function DonatePage() {
  // Static rendering: every page that reads translations must set the locale itself.
  setRequestLocale("en");
  const t = await getTranslations("donate");
  const page = getPage("/donate");
  const [hero] = (page?.blocks ?? []) as [HeroBlock];
  const donate = getDonate("en");
  const general = getGeneral("en");
  return (
    <>
      <InteriorHero block={{ title: hero?.title, subtitle: hero?.subtitle, image: hero?.image }} />
      {hero?.content && <Lede number="01" text={hero.content} />}
      <CauseGrid
        causes={getCauses("en")}
        locale="en"
        number="02"
        label={t("chooseProject")}
        heading={t("chooseHeading")}
        intro={t("chooseIntro")}
        cta={t("giveTo")}
        progressLabel={(p) => t("progress", p)}
      />
      {general && (
        <GeneralGift cause={general} donate={donate} number="03" heading={general.title} intro={general.summary} />
      )}
      <GiftSummary rates={donate.rates} number="04" />
    </>
  );
}
