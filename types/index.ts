export interface ImageRef {
  sourceUrl: string
}

export interface FeaturedImage {
  altText: string
  caption: string | null
  sourceUrl: string
  srcSet: string
  sizes: string
  id: string
}

export interface TypeOfProject {
  databaseId: number
  id: string
  name: string
  slug: string
}

export interface Project {
  id: string
  databaseId: number
  title: string
  slug: string
  excerpt: string
  content: string | null
  date: string
  modified: string
  featuredImage: FeaturedImage
  typesOfProjects: TypeOfProject[]
  tags: { name: string; slug: string }[]
}

export interface Homepage {
  heroText: string
  heroSlider: Array<{ image1: ImageRef; image2: ImageRef; image3: ImageRef }>
  sliderText: Array<{
    text: { heading: string; explainer: string }
    text1: { heading: string; explainer: string }
    text2: { heading: string; explainer: string }
  }>
  philosophyImage: ImageRef
  philosophyTitle: string
  philosophyText: string
  ourStoryTitle: string
  ourStoryIntro: string
  ourStoryText: string
  ourStoryImage: ImageRef
  projectsTitle: string
  projectText: string
  projects: Record<string, { image: ImageRef; text: string }>
  luigiTitle: string
  luigiText: string
  luigiText1: string
  luigiText2: string
  luigiImages: { image1: ImageRef; image2: ImageRef }
  ctaImage: ImageRef
  ctaTitle: string
  ctaText: string
}

export interface OurStory {
  heroContent: string
  heroImage: ImageRef
  whoWeAreTitle: string
  whoWeAreImage: ImageRef
  whoWeAreText: string
  whoWeAreText1: string
  title1: string
  title2: string
  trustees: Record<string, {
    name: string
    title: string
    thumb: ImageRef
    image: ImageRef
    text1: string
    text2: string
  }>
  banner: ImageRef
}

export interface ProjectsPage {
  pageTitle: string
  projectsText: string
  projectsSectionTitle: string
  projects: Array<{ image: ImageRef; title: string; slug: string }>
  moreProjects: Array<{ image: ImageRef; title: string; slug: string }>
}

export interface RelatedProject {
  title: string
  slug: string
}

export interface MoreProject {
  title: string
  slug: string
  image: FeaturedImage
}
