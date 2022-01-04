import {
    gql
} from '@apollo/client'

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
                    sliderText {
                        text {
                            heading
                            explainer
                        }
                        text1 {
                            heading
                            explainer
                        }
                        text2 {
                            heading
                            explainer
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
                    projects {
                        projectOne {
                            image {
                                sourceUrl
                            }
                            text
                        }
                        projectTwo {
                            image {
                                sourceUrl
                            }
                            text
                        }
                        projectThree {
                            image {
                                sourceUrl
                            }
                            text
                        }
                        projectFour {
                            image {
                                sourceUrl
                            }
                            text
                        }
                    }
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
                heroContent
                heroImage {
                    sourceUrl
                }
                whoWeAreTitle
                whoWeAreImage {
                    sourceUrl
                }
                whoWeAreText
                whoWeAreText1
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
                    trustee3 {
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
                banner {
                    sourceUrl
                }
            }
        }
    }
`