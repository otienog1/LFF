import dataEn from "@/data/data.json";
import dataEs from "@/data/data.es.json";
import dataPt from "@/data/data.pt.json";
import type { SiteData, Page } from "@/types/content";

function getSiteData(locale: string = "en"): SiteData {
  switch (locale) {
    case "es":
      return dataEs as SiteData;
    case "pt":
      return dataPt as SiteData;
    default:
      return dataEn as SiteData;
  }
}

export function getAllPages(locale: string = "en"): Page[] {
  return getSiteData(locale).pages;
}

export function getAllSlugs(locale: string = "en"): string[] {
  return getSiteData(locale).pages.map((p) => p.slug);
}

export function getPage(slug: string, locale: string = "en"): Page | undefined {
  return getSiteData(locale).pages.find((p) => p.slug === slug);
}
