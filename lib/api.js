const API_URL = process.env.LFF_API_URL

async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.log(json.errors)
    throw new Error('Failed to fetch API')
  }
  return json.data
}

export async function getPreviewProject(id, idType = 'DATABASE_ID') {
  const data = await fetchAPI(
    `
        query PreviewPost($id: ID!, $idType: PostIdType!) {
          post(id: $id, idType: $idType) {
            databaseId
            slug
            status
          }
        }`,
    {
      variables: { id, idType },
    }
  )
  return data.post
}

export async function getAllProjectsForHome(preview) {
  const data = await fetchAPI(
    `
    query AllProjects {
      projects(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                firstName
                lastName
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  )

  return data?.projects
}

export async function getAllProjectsWithSlug() {
  const data = await fetchAPI(`
      {
        projects(first: 10000) {
          edges {
            node {
              slug
            }
          }
        }
      }
    `)
  return data?.projects
}

export async function getProjectAndMoreProjects(slug, preview, previewData) {
  const projectPreview = preview && previewData?.project
  const isId = Number.isInteger(Number(slug))
  const isSameProject = isId
    ? Number(slug) === projectPreview.id
    : slug === projectPreview.slug
  const isDraft = isSameProject && projectPreview?.status === 'draft'
  const isRevision = isSameProject && projectPreview?.status === 'publish'
  const data = await fetchAPI(
    `
        fragment AuthorFields on User {
          name
          firstName
          lastName
          avatar {
            url
          }
        }
        fragment ProjectFields on Project {
          title
          excerpt
          slug
          date
          featuredImage {
            node {
              sourceUrl
            }
          }
          author {
            node {
              ...AuthorFields
            }
          }
          typesOfProjects {
            edges {
              node {
                name
              }
            }
          }
          tags {
            edges {
              node {
                name
              }
            }
          }
        }
        query ProjectBySlug($id: ID!, $idType: ProjectIdType!) {
          project(id: $id, idType: $idType) {
            ...ProjectFields
            content
            ${
    // Only some of the fields of a revision are considered as there are some inconsistencies
    isRevision
      ? `
            revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
              edges {
                node {
                  title
                  excerpt
                  content
                  author {
                    node {
                      ...AuthorFields
                    }
                  }
                }
              }
            }
            `
      : ''
    }
          }
          projects(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
            edges {
              node {
                ...ProjectFields
              }
            }
          }
        }
      `,
    {
      variables: {
        id: isDraft ? projectPreview.id : slug,
        idType: isDraft ? 'DATABASE_ID' : 'SLUG',
      },
    }
  )

  // Draft projects may not have an slug
  if (isDraft) data.project.slug = projectPreview.id
  // Apply a revision (changes in a published project)
  if (isRevision && data.project.revisions) {
    const revision = data.project.revisions.edges[0]?.node

    if (revision) Object.assign(data.project, revision)
    delete data.project.revisions
  }

  // Filter out the main project
  data.projects.edges = data.projects.edges.filter(({ node }) => node.slug !== slug)
  // If there are still 3 project, remove the last one
  if (data.projects.edges.length > 2) data.projects.edges.pop()

  return data
}

export async function createMessage({ title, email, content }) {
  const data = await fetchAPI(
    `
        mutation MessageMutation($title: String!, $email: String!, $content: String!) {
            createMessage(
              input: {
				  title: $title, 
				  email: $email, 
				  content: $content, 
				  clientMutationId: "CreateMessage"
				}
            ) {
              message {
                email
                title
                content
                date
              }
            }
          }
          `,
    {
      variables: {
        'title': title,
        'email': email,
        'content': content
      }
    }
  )

  return data
}