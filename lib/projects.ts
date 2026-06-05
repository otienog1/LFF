import type { Project, RelatedProject, MoreProject, TypeOfProject } from '@/types'
import projectsData from '../data/all-projects.json'
import { sortObjectsByDateAsc } from './datetime'

const projects = projectsData as Project[]

export function projectPathBySlug(slug: string): string {
  return `/projects/${slug}`
}

export const getProjectBySlug = async (slug: string): Promise<{ project: Project | undefined }> => ({
  project: projects.find(p => p.slug === slug),
})

export async function getAllProjects(): Promise<{ projects: Project[] }> {
  return { projects }
}

export async function getRelatedProjects(
  category: TypeOfProject | null,
  projectId: number,
  count = 3
): Promise<RelatedProject[]> {
  if (!category) return []
  const filtered = projects
    .filter(p => p.typesOfProjects.some(t => t.databaseId === category.databaseId))
    .filter(p => p.databaseId !== projectId)
  const sorted = sortObjectsByDateAsc(filtered as unknown as Record<string, string>[]) as unknown as Project[]
  return sorted.slice(0, count).map(p => ({ title: p.title, slug: p.slug }))
}

export async function getMoreProjects(count: number): Promise<MoreProject[]> {
  const sorted = sortObjectsByDateAsc(projects as unknown as Record<string, string>[]) as unknown as Project[]
  return sorted.slice(0, count).map(p => ({
    title: p.title,
    slug: p.slug,
    image: p.featuredImage,
  }))
}
