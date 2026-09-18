import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import type { Page } from "@/types/content";

export const SITE_URL = "https://theluigifootprints.org";
export const SITE_NAME = "Luigi Footprints Foundation";
export const CONTACT_EMAIL = "info@theluigifootprints.org";
export const DEFAULT_OG_IMAGE = "https://api.theluigifootprints.org/wp-content/uploads/2022/01/Give.webp";

export const SOCIAL_LINKS = [
  { key: "instagram", href: "https://www.instagram.com/maniagosafaris/" },
  { key: "facebook", href: "https://www.facebook.com/ManiagoSafarisEastAfrica" },
  { key: "youtube", href: "https://www.youtube.com/channel/UCVmNdFZ3SvfszacIMCfpPHg" },
] as const;

/** Prefix a site-relative path with the locale segment (none for English). */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === "en" ? clean || "/" : `/${locale}${clean}`;
}

/** hreflang alternates for one page, across all locales. */
export function alternatesFor(path: string): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = SITE_URL + localePath(l, path);
  languages["x-default"] = SITE_URL + localePath("en", path);
  return { canonical: undefined, languages };
}

/** Full metadata for a content page: title, description, hreflang, Open Graph. */
export function pageMetadata(page: Page | undefined, path: string, locale: Locale, image?: string): Metadata {
  if (!page) return { alternates: alternatesFor(path) };
  const url = SITE_URL + localePath(locale, path);
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { ...alternatesFor(path), canonical: url },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: locale === "en" ? "en_GB" : locale === "es" ? "es_ES" : "pt_BR",
      images: [{ url: image ?? DEFAULT_OG_IMAGE }],
    },
  };
}
