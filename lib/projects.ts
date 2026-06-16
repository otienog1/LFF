import dataJson from "@/data/data.json";

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

const projects = (dataJson as { projects: Project[] }).projects;

export function getProjects(): Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
