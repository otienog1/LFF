import dataEn from "@/data/data.json";
import dataEs from "@/data/data.es.json";
import dataPt from "@/data/data.pt.json";
import type { Locale } from "@/i18n/config";

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
  typesOfProjects: ProjectCategory[];
  tags: string[];
}

function getProjectData(locale: Locale = "en"): { projects: Project[] } {
  switch (locale) {
    case "es":
      return dataEs as { projects: Project[] };
    case "pt":
      return dataPt as { projects: Project[] };
    default:
      return dataEn as { projects: Project[] };
  }
}

export function getProjects(locale: Locale = "en"): Project[] {
  return getProjectData(locale).projects;
}

export function getProject(slug: string, locale: Locale = "en"): Project | undefined {
  return getProjectData(locale).projects.find((p) => p.slug === slug);
}
