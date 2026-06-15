import data from "@/data/data.json";
import type { SiteData, Page } from "@/types/content";

const site = data as SiteData;

export function getAllPages(): Page[] { return site.pages; }
export function getAllSlugs(): string[] { return site.pages.map((p) => p.slug); }
export function getPage(slug: string): Page | undefined {
  return site.pages.find((p) => p.slug === slug);
}
