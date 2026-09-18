import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import { getCauses, getDonate, getGeneral } from "@/lib/donate";
import { pageMetadata } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import { InteriorHero } from "@/components/shared/InteriorHero";
import { Lede } from "@/components/home/Lede";
import { CauseGrid } from "@/components/donate/CauseGrid";
import { GeneralGift } from "@/components/donate/GeneralGift";
import { GiftSummary } from "@/components/donate/GiftSummary";
import type { HeroBlock } from "@/types/content";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "pt" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return pageMetadata(getPage("/donate", loc), "/donate", loc);
}

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);
  const t = await getTranslations("donate");
  const page = getPage("/donate", loc);
  const [hero] = (page?.blocks ?? []) as [HeroBlock];
  const donate = getDonate(loc);
  const general = getGeneral(loc);
  return (
    <>
      <InteriorHero block={{ title: hero?.title, subtitle: hero?.subtitle, image: hero?.image }} />
      {hero?.content && <Lede number="01" text={hero.content} />}
      <CauseGrid
        causes={getCauses(loc)}
        locale={loc}
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
