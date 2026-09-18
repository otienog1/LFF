import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import { ContactPage } from "@/components/contact/ContactPage";
import type { ContactBlock, CtaBlock } from "@/types/content";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "pt" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return pageMetadata(getPage("/contact", loc), "/contact", loc);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);
  const t = await getTranslations("contact");
  const f = await getTranslations("footer");
  const hero = getPage("/contact", loc)?.blocks.find((b) => b.type === "contact") as ContactBlock | undefined;
  const cta = getPage("/", loc)?.blocks.find((b) => b.type === "cta") as CtaBlock | undefined;
  return (
    <ContactPage
      hero={hero}
      cta={cta}
      locale={loc}
      labels={{
        writeLabel: t("writeLabel"),
        writeHeading: t("writeHeading"),
        writeIntro: t("writeIntro"),
        emailLabel: t("emailLabel"),
        followLabel: t("followLabel"),
        whereLabel: t("whereLabel"),
        location: f("location"),
        social: { instagram: f("instagram"), facebook: f("facebook"), youtube: f("youtube") },
      }}
    />
  );
}
