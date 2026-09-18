import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getAllSlugs } from "@/lib/content";
import { getProjects } from "@/lib/projects";
import { SITE_URL, localePath } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...getAllSlugs(), "/donate", ...getProjects().map((p) => `/projects/${p.slug}`)];
  const entries: MetadataRoute.Sitemap = [];
  for (const path of paths) {
    const languages: Record<string, string> = {};
    for (const l of locales) languages[l] = SITE_URL + localePath(l, path);
    for (const l of locales) {
      entries.push({
        url: SITE_URL + localePath(l, path),
        changeFrequency: "monthly",
        priority: path === "/" ? 1 : path === "/donate" ? 0.9 : 0.7,
        alternates: { languages },
      });
    }
  }
  return entries;
}
