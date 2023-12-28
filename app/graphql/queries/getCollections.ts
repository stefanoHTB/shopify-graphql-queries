export const getCollectionsQuery = `
  {
    collections(first: 10) {
      edges {
        node {
          id
          handle
          title
          description
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;