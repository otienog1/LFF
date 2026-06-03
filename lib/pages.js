import homepageData from '../data/homepage.json'
import ourStoryData from '../data/our-story.json'
import projectsPageData from '../data/projects-page.json'

export const getHomePage = async () => ({ page: homepageData })
export const getOurStory = async () => ({ page: ourStoryData })
export const getOurProjects = async () => ({ page: projectsPageData })
