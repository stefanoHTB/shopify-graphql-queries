import type { LoaderFunction as LF } from "@remix-run/node";
import {
    Card,
    Page,
    List
  } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "~/shopify.server";


export const query = `
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

export const loader: LF = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;
  
  try {
    const response = await fetch(
      `https://${shop}/admin/api/2022-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/graphql",
          "X-Shopify-Access-Token": accessToken!,
        },
        body: query,
      }
    );

    if (response.ok) {
      const data = await response.json();

      const {
        data: {
          collections: { edges },
        },
      } = data;

      return edges;
    }

    return null;
  } catch (err) {
    console.error(err);
  }
}


const Collections = () => {
    const collections: any = useLoaderData();
    console.log(collections, "collections");
  
    return (
      <Page>
        <Card>
          <List type="bullet" gap="loose">
            {collections.map((edge: any) => {
              const { node: collection } = edge;
              return (
                <List.Item key={collection.id}>
                  <h2>{collection.title}</h2>
                  <p>{collection.description}</p>
                </List.Item>
              );
            })}
          </List>
        </Card>
      </Page>
      )
    };

export default Collections;
