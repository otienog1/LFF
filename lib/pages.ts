import type { Homepage, OurStory, ProjectsPage } from '@/types'
import homepageData from '../data/homepage.json'
import ourStoryData from '../data/our-story.json'
import projectsPageData from '../data/projects-page.json'

export const getHomePage = async (): Promise<{ page: Homepage }> => ({
  page: homepageData as unknown as Homepage,
})

export const getOurStory = async (): Promise<{ page: OurStory }> => ({
  page: ourStoryData as unknown as OurStory,
})

export const getOurProjects = async (): Promise<{ page: ProjectsPage }> => ({
  page: projectsPageData as ProjectsPage,
})
