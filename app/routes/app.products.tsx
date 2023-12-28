import type { LoaderFunction as LF } from "@remix-run/node";
import {
    Card,
    Page,
    List
  } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

  const query = `
  {
    products(first: 10) {
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
    // const { admin } = await authenticate.admin(request);
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

        if(response){
            const data = await response.json();

            const {
              data: {
                products: { edges },
              },
            } = data;

            return edges;

        }

        return null;

        } catch(err){
            console.log(err)

        }
  }


const Products = () => {
    const products: any = useLoaderData();
    console.log(products, "products")

  return <Page>
    <Card>
        <List type="bullet" gap="loose">
          {products.map((edge: any) => {
            const { node: product } = edge;
            return (
              <List.Item key={product.id}>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
              </List.Item>
            );
          })}
        </List>
      </Card>
  </Page>;
};

export default Products;
