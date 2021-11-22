import { getApolloClient } from "./apollo-client";
import { QUERY_HOMEPAGE, QUERY_OURSTORY } from "../data/pages";

const apolloClient = getApolloClient()

export const getHomePage = async () => {
    let pageData;

    try {
        pageData = await apolloClient.query({
            query: QUERY_HOMEPAGE
        })
    } catch (e) {
        console.log(`[page][homepage] Filed to query page data: ${e.message}`)
        throw e
    }

    const page = pageData?.data.page.homePage

    return {
        page
    }
}

export const getOurStory = async () => {
    let pageData

    try {
        pageData = await apolloClient.query({
            query: QUERY_OURSTORY
        })
    } catch (e) {
        console.log(`[page][homepage] Filed to query page data: ${e.message}`)
        throw e
    }

    const page = pageData?.data.page.ourStory

    return {
        page
    }
}