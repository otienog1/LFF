# Design: Replace Apollo/GraphQL with local JSON files

**Date:** 2026-06-03  
**Status:** Approved  

## Problem

`ApolloError: Response not successful: Received status code 500` — the WordPress GraphQL backend at `LFF_API_URL` is returning 500 errors, breaking the build. All data fetching is build-time only (`getStaticProps`), so there is no need for a live API at all.

## Goal

Remove Apollo/GraphQL entirely. Store all page and project content in local JSON files. The site reads from those files at build time with zero network calls.

## Approach: Direct JSON imports

All data fetching already happens inside `getStaticProps`, which runs only at build time. Replacing Apollo queries with JSON imports is a direct swap — no page components change, no routing changes, no new abstractions.

## Architecture

### Files created

| File | Purpose |
|---|---|
| `data/homepage.json` | All fields for `pages/index.js` |
| `data/our-story.json` | All fields for `pages/our-story/index.js` |
| `data/projects-page.json` | All fields for `pages/projects/index.js` |
| `data/all-projects.json` | Array of all project objects for `pages/projects/[slug].js` |

### Files rewritten

| File | Change |
|---|---|
| `lib/pages.js` | Import JSON files, return data directly — no Apollo |
| `lib/projects.js` | Import `all-projects.json`, filter/slice in JS — no Apollo |
| `lib/catogories.js` | Remove Apollo queries and `getAllCategories`/`getCategoryBySlug`; keep only `categoryPathBySlug` and `mapCategoryData` |
| `pages/_app.js` | Remove `ApolloProvider`, `ApolloClient`, `createHttpLink`, `setContext`, `authLink`; keep GSAP transition logic and `SwitchTransition` wrapper |
| `pages/contact/index.js` | Remove `useMutation`, `ContactForm`, and Apollo imports; replace form with a mailto link |
| `pages/donate/index.js` | Remove `useMutation(SEND_EMAIL)` and the `sendEmail` call after payment; PayPal integration remains untouched |

### Files deleted

| File | Reason |
|---|---|
| `lib/apollo-client.js` | No longer needed |
| `lib/contact.js` | Contained only commented-out Apollo mutation code |
| `data/pages.js` | Contained only GQL query strings |
| `data/projects.js` | Contained only GQL query strings |
| `data/contact.js` | Contained only GQL mutation strings |
| `data/categories.js` | Contained only GQL query strings |
| `data/user.js` | Contained only GQL mutation strings (unused) |
| `apollo.config.js` | Apollo client config, no longer needed |

### package.json

Remove `@apollo/client` and `graphql` from dependencies.

## JSON shapes

### `data/homepage.json`

```json
{
  "heroText": "...",
  "heroSlider": [
    {
      "image1": { "sourceUrl": "..." },
      "image2": { "sourceUrl": "..." },
      "image3": { "sourceUrl": "..." }
    }
  ],
  "sliderText": [
    {
      "text":  { "heading": "...", "explainer": "..." },
      "text1": { "heading": "...", "explainer": "..." },
      "text2": { "heading": "...", "explainer": "..." }
    }
  ],
  "philosophyImage": { "sourceUrl": "..." },
  "philosophyTitle": "...",
  "philosophyText": "...",
  "ourStoryTitle": "...",
  "ourStoryIntro": "...",
  "ourStoryText": "...",
  "ourStoryImage": { "sourceUrl": "..." },
  "projectsTitle": "...",
  "projectText": "...",
  "projects": {
    "projectOne":   { "image": { "sourceUrl": "..." }, "text": "..." },
    "projectTwo":   { "image": { "sourceUrl": "..." }, "text": "..." },
    "projectThree": { "image": { "sourceUrl": "..." }, "text": "..." },
    "projectFour":  { "image": { "sourceUrl": "..." }, "text": "..." }
  },
  "luigiTitle": "...",
  "luigiText": "...",
  "luigiText1": "...",
  "luigiText2": "...",
  "luigiImages": {
    "image1": { "sourceUrl": "..." },
    "image2": { "sourceUrl": "..." }
  },
  "ctaImage": { "sourceUrl": "..." },
  "ctaTitle": "...",
  "ctaText": "..."
}
```

### `data/our-story.json`

```json
{
  "heroContent": "...",
  "heroImage": { "sourceUrl": "..." },
  "whoWeAreTitle": "...",
  "whoWeAreImage": { "sourceUrl": "..." },
  "whoWeAreText": "...",
  "whoWeAreText1": "...",
  "title1": "...",
  "title2": "...",
  "trustees": {
    "trustee1": { "name": "...", "title": "...", "thumb": { "sourceUrl": "..." }, "image": { "sourceUrl": "..." }, "text1": "...", "text2": "..." },
    "trustee2": { "name": "...", "title": "...", "thumb": { "sourceUrl": "..." }, "image": { "sourceUrl": "..." }, "text1": "...", "text2": "..." },
    "trustee3": { "name": "...", "title": "...", "thumb": { "sourceUrl": "..." }, "image": { "sourceUrl": "..." }, "text1": "...", "text2": "..." },
    "trustee4": { "name": "...", "title": "...", "thumb": { "sourceUrl": "..." }, "image": { "sourceUrl": "..." }, "text1": "...", "text2": "..." },
    "trustee5": { "name": "...", "title": "...", "thumb": { "sourceUrl": "..." }, "image": { "sourceUrl": "..." }, "text1": "...", "text2": "..." }
  },
  "banner": { "sourceUrl": "..." }
}
```

### `data/projects-page.json`

```json
{
  "pageTitle": "...",
  "projectsText": "...",
  "projectsSectionTitle": "...",
  "projects": [
    { "image": { "sourceUrl": "..." }, "title": "...", "slug": "..." }
  ],
  "moreProjects": [
    { "image": { "sourceUrl": "..." }, "title": "...", "slug": "..." }
  ]
}
```

### `data/all-projects.json`

Array of project objects. Already in flat shape — no GraphQL `edges/node` wrapping. `mapProjectData` is deleted since the JSON stores the already-mapped structure.

```json
[
  {
    "id": "...",
    "databaseId": 1,
    "title": "...",
    "slug": "...",
    "excerpt": "...",
    "content": "...",
    "date": "2023-01-01T00:00:00",
    "modified": "2023-01-01T00:00:00",
    "featuredImage": {
      "altText": "...",
      "caption": "...",
      "sourceUrl": "...",
      "srcSet": "...",
      "sizes": "...",
      "id": "..."
    },
    "typesOfProjects": [
      { "databaseId": 1, "id": "...", "name": "...", "slug": "..." }
    ],
    "tags": [
      { "name": "...", "slug": "..." }
    ]
  }
]
```

## lib/pages.js (rewritten)

```js
import homepageData from '../data/homepage.json'
import ourStoryData from '../data/our-story.json'
import projectsPageData from '../data/projects-page.json'

export const getHomePage = async () => ({ page: homepageData })
export const getOurStory = async () => ({ page: ourStoryData })
export const getOurProjects = async () => ({ page: projectsPageData })
```

## lib/projects.js (rewritten)

```js
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
```

## pages/contact/index.js (simplified)

- Remove `useMutation`, `useState`, `useEffect`, `useRef` imports
- Remove `CREATE_MESSAGE` and `SEND_EMAIL` imports from `data/contact`
- Remove `ContactForm` component entirely
- Replace with a mailto anchor styled to match existing button

## Contact page replacement

The left-hand "We'd love to hear from you" heading and social links remain. The right half becomes:

```jsx
<div className="flex md:w-1/2 relative pt-8 md:pt-0 md:pl-20 items-center">
  <a
    href="mailto:info@theluigifootprints.org"
    className="donate-button text-lff_800 flex font-sen items-center text-sm py-5 px-8 space-x-2 border-solid border border-lff_800 w-auto justify-center bg-lff_200 hover:bg-lff_400"
  >
    <span className="text-lff_800 lowercase">Send us an email</span>
  </a>
</div>
```

## Constraints

- No page components (`pages/`) change their props interface — `getStaticProps` return values stay identical
- `lib/catogories.js` is not touched (no Apollo dependency)
- `.env.local` is left as-is (removing `LFF_API_URL` is optional cleanup)
- Content in JSON files must be populated manually before running `next build`
