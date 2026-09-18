import dataEn from "@/data/data.json";
import dataEs from "@/data/data.es.json";
import dataPt from "@/data/data.pt.json";
import type { Locale } from "@/i18n/config";
import type { ImageRef } from "@/types/content";
import { stripHtml } from "@/lib/wp";

/** The project the archive leads with: the one with a full write-up, and the one open to sponsorship. */
export const FLAGSHIP_SLUG = "dignity-housing-for-wildife-rangers";

export interface ProjectCategory {
  databaseId: number;
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  date: string;
  featuredImage: {
    altText: string;
    sourceUrl: string;
    srcSet: string;
    sizes: string;
    id: string;
  } | null;
  /** A crop made for small cards and rows (see the Cropframe handoff); the featured photograph stays for the large frames. */
  thumbnail?: ImageRef;
  typesOfProjects: ProjectCategory[];
  tags: string[];
}

function getProjectData(locale: Locale = "en"): { projects: Project[] } {
  switch (locale) {
    case "es":
      return dataEs as unknown as { projects: Project[] };
    case "pt":
      return dataPt as unknown as { projects: Project[] };
    default:
      return dataEn as unknown as { projects: Project[] };
  }
}

/** Newest first. */
export function getProjects(locale: Locale = "en"): Project[] {
  return [...getProjectData(locale).projects].sort((a, b) => b.date.localeCompare(a.date));
}

export function getProject(slug: string, locale: Locale = "en"): Project | undefined {
  return getProjectData(locale).projects.find((p) => p.slug === slug);
}

export function getProjectsBySlugs(slugs: string[], locale: Locale = "en"): Project[] {
  return slugs.map((s) => getProject(s, locale)).filter((p): p is Project => Boolean(p));
}

/** The project's featured photograph as an image reference, or null. */
export function projectImage(project: Project): ImageRef | null {
  if (!project.featuredImage) return null;
  return { url: project.featuredImage.sourceUrl, alt: project.featuredImage.altText || project.title };
}

/** The photograph for a small card or row: the crop made for that size when there is one, else the featured photograph. */
export function projectThumbnail(project: Project): ImageRef | null {
  return project.thumbnail ?? projectImage(project);
}

/** Only projects with a real write-up get their own page; the rest are shown as archive entries. */
export function hasWriteup(project: Project): boolean {
  return stripHtml(project.content).length > 80;
}
