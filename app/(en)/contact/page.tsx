import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
import { ContactPage } from "@/components/contact/ContactPage";
import type { ContactBlock, CtaBlock } from "@/types/content";

export function generateMetadata(): Metadata {
  return pageMetadata(getPage("/contact"), "/contact", "en");
}

export default async function Page() {
  // Static rendering: every page that reads translations must set the locale itself.
  setRequestLocale("en");
  const t = await getTranslations("contact");
  const f = await getTranslations("footer");
  const hero = getPage("/contact")?.blocks.find((b) => b.type === "contact") as ContactBlock | undefined;
  const cta = getPage("/")?.blocks.find((b) => b.type === "cta") as CtaBlock | undefined;
  return (
    <ContactPage
      hero={hero}
      cta={cta}
      locale="en"
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
