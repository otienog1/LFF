import projectsData from '../data/all-projects.json'
import { sortObjectsByDateAsc } from './datetime'

export function projectPathBySlug(slug) {
    return `/projects/${slug}`
}

export const getProjectBySlug = async (slug) => ({
    project: projectsData.find(p => p.slug === slug)
})

export async function getAllProjects() {
    return { projects: projectsData }
}

export async function getRelatedProjects(category, projectId, count = 3) {
    if (!category) return []
    const filtered = projectsData
        .filter(p => p.typesOfProjects.some(t => t.databaseId === category.databaseId))
        .filter(p => p.databaseId !== projectId)
    const sorted = sortObjectsByDateAsc(filtered)
    return sorted.slice(0, count).map(p => ({ title: p.title, slug: p.slug }))
}

export async function getMoreProjects(count) {
    const sorted = sortObjectsByDateAsc(projectsData)
    return sorted.slice(0, count).map(p => ({
        title: p.title,
        slug: p.slug,
        image: p.featuredImage
    }))
}
