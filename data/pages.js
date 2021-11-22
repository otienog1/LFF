import { gql } from '@apollo/client'

export const QUERY_HOMEPAGE = gql`
    query HomePage {
        page(id: "cG9zdDoxODA=") {
            homePage {
                heroText
                    heroSlider {
                        image1 {
                            sourceUrl
                        }
                        image2 {
                            sourceUrl
                        }
                        image3 {
                            sourceUrl
                        }
                    }
                    heroSliderThumbnails {
                        image1 {
                            sourceUrl
                        }
                        image2 {
                            sourceUrl
                        }
                        image3 {
                            sourceUrl
                        }
                    }
                    philosophyImage {
                        sourceUrl
                    }
                    philosophyTitle
                    philosophyText
                    ourStoryTitle
                    ourStoryIntro
                    ourStoryText
                    ourStoryImage {
                        sourceUrl
                    }
                    projectsTitle
                    projectText
                    luigiTitle
                    luigiText
                    luigiText1
                    luigiText2
                    luigiImages {
                        image1 {
                            sourceUrl
                        }
                        image2 {
                            sourceUrl
                        }
                    }
                    ctaImage {
                        sourceUrl
                    }
                    ctaTitle
                    ctaText
                    }
        }
    }`

export const QUERY_OURSTORY = gql`
    query OurStory {
        page(id: "cG9zdDoyNDE=") {
            ourStory {
                title1
                title2
                trustees {
                    trustee1 {
                        name
                        title
                        thumb {
                            sourceUrl
                        }
                        image {
                            sourceUrl
                        }
                        text1
                        text2          
                    }
                    trustee2 {
                        name
                        title
                        thumb {
                            sourceUrl
                        }
                        image {
                            sourceUrl
                        }
                        text1
                        text2          
                    }
                    trustee3{
                        name
                        title
                        thumb {
                            sourceUrl
                        }
                        image {
                            sourceUrl
                        }
                        text1
                        text2
                    }
                    trustee4 {
                        name
                        title
                        thumb {
                            sourceUrl
                        }
                        image {
                            sourceUrl
                        }
                        text1
                        text2          
                    }
                    trustee5 {
                        name
                        title
                        thumb {
                            sourceUrl
                        }
                        image {
                            sourceUrl
                        }
                        text1
                        text2          
                    }
                    trustee6 {
                        name
                        title
                        thumb {
                            sourceUrl
                        }
                        image {
                            sourceUrl
                        }
                        text1
                        text2          
                    }
                }
            }
        }
    }
`