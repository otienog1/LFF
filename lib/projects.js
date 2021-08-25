import { getApolloClient } from './apollo-client'

import { sortObjectsByDate } from './datetime'
import { QUERY_ALL_PROJECTS, QUERY_PROJECT_BY_SLUG, QUERY_PROJECTS_BY_CATEGORY_ID } from '../data/projects'


export function projectPathBySlug(slug) {
    return `/projects/${slug}`;
}

export const getProjectBySlug = async (slug) => {
    const apolloClient = getApolloClient();

    let projectData

    try {
        projectData = await apolloClient.query({
            query: QUERY_PROJECT_BY_SLUG,
            variables: {
                slug,
            }
        })
    } catch (e) {
        console.log(`[projects][getprojectBySlug] Failed to query project data: ${e.message}`);
        throw e;
    }

    const project = [projectData?.data.project].map(mapProjectData)[0]

    return {
        project,
    }
}

export async function getAllProjects() {
    const apolloClient = getApolloClient();

    const data = await apolloClient.query({
        query: QUERY_ALL_PROJECTS,
    });

    const projects = data?.data.projects.edges.map(({ node = {} }) => node);

    return {
        projects: Array.isArray(projects) && projects.map(mapProjectData),
    };
}

export async function getRelatedProjects(category, projectId, count = 3) {
    let relatedProjects = []

    if (category) {
        const { projects } = await getProjectsByCategoryId(category.databaseId)
        const filtered = projects.filter(({ projectId: id }) => id !== postId)
        const sorted = sortObjectsByDate(filtered)
        relatedProjects = sorted.map((project) => ({
            title: project.title,
            slug: project.slug
        }))
    }

    if (relatedProjects.length > count) {
        return relatedProjects.slice(0, count)
    }
    return relatedProjects
}

export function mapProjectData(project = {}) {
    const data = { ...project }

    if (data.categories)
        data.categories = data.categories.edges.map(({ node }) => ({ ...node, }))

    if (data.typesOfProjects)
        data.typesOfProjects = data.typesOfProjects.edges.map(({ node }) => ({ ...node }))

    if (data.featuredImage) {
        data.featuredImage = data.featuredImage.node;
    }

    if (data.tags)
        data.tags = data.tags.edges.map(({ node }) => ({ ...node }))

    return data;
}

export async function getProjectsByCategoryId(categoryId) {
    const apolloClient = getApolloClient()

    let projectData

    try {
        projectData = await apolloClient.query({
            query: QUERY_PROJECTS_BY_CATEGORY_ID,
            variables: {
                categoryId,
            },
        })
    } catch (e) {
        console.log(`Failed to query post data: ${e.message}`);
        throw e;
    }

    const projects = projectData?.data.projects.edges.map(({ node = {} }) => node);

    return {
        projects: Array.isArray(projects) && projects.map(mapProjectData),
    };
}