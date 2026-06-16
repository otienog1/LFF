import { projects as projectsData } from "@/data/data.json";

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
  typesOfProjects: string[];
  tags: string[];
}

const projects = projectsData as Project[];

export function getProjects(): Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
