import { gql } from '@apollo/client'

export const QUERY_ALL_PROJECTS = gql`
  query AllProjects {
    projects(first: 10000) {
      edges {
        node {
          id
          typesOfProjects {
            edges {
              node {
                databaseId
                id
                name
                slug
              }
            }
          }
          content
          date
          excerpt
          featuredImage {
            node {
              altText
              caption
              sourceUrl
              srcSet
              sizes
              id
            }
          }
          modified
          databaseId
          title
          slug
        }
      }
    }
  }
`;

export const QUERY_PROJECT_BY_SLUG = gql`
  query ProjectBySlug($slug: ID!) {
    project(id: $slug, idType: SLUG) {
        id
        typesOfProjects {
            edges {
                node {
                databaseId
                id
                name
                slug
                }
            }
        }
        content
        date
        excerpt
        featuredImage {
            node {
                altText
                caption
                sourceUrl
                srcSet
                sizes
                id
            }
        }
        modified
        databaseId
        title
        slug
        tags {
      edges {
        node {
          name
          slug
        }
      }
    }
        }
    }
`;

export const QUERY_PROJECTS_BY_CATEGORY_ID = gql`
  query ProjectsByCategoryId($categoryId: Int!) {
    projects(where: { categoryId: $categoryId }) {
      edges {
        node {
          id
          categories {
            edges {
              node {
                databaseId
                id
                name
                slug
              }
            }
          }
          content
          date
          excerpt
          featuredImage {
            node {
              altText
              caption
              id
              sizes
              sourceUrl
              srcSet
            }
          }
          modified
          databaseId
          title
          slug
        }
      }
    }
  }
`;