// const LATEST_API_VERSION = 12


// export async function graphQLRequest({ shop
//     , accessToken, query, variables }) {
//     try {
//       const url = `https://${shop}/admin/api/${ LATEST_API_VERSION }/graphql.json`;
  
//       const requestHeaders = {
//         'X-Shopify-Access-Token': accessToken,
//       }
  
//       const data = await request({
//         url,
//         document: query,
//         variables,
//         requestHeaders
//       })
  
//       return data;
//     } catch (error) {
//       console.log('error', error)
//     }
//   }


//-------------------------------------------------------------------- get product


// export async function getProduct({ shop, accessToken, productId }) {
//     const variables = {
//       id: `gid://shopify/Product/${productId}`
//     }
  
//     const response = await graphQLRequest({
//       shop,
//       accessToken,
//       query: GET_PRODUCT,
//       variables
//     });
  
//     return response;
//   }

//----------------------------------------------------------------------

// routes/resource.search-form.tsx

// export async function loader({ request }: DataFunctionArgs) {
//     const url = new URL(request.url)
//     const query = url.searchParams.get('query')
//     const results = await doSearch(query)
//     return json(results)
//   }
  
//   export function SearchForm() {
//     const fetcher = useFetcher<typeof loader>()
  
//     return (
//       <div>
//         <fetcher.Form method="get" action="/resource/search-form">
//           <input type="text" name="query" placeholder="search" />
//           <button>Submit</button>
//         </fetcher.Form>
//         {fetcher.data && (
//           <ul>
//             {fetcher.data.map((product: any) => (
//               <li key={product.node.id}>{product.node.title}</li>
//             ))}
//           </ul>
//         )}
//       </div>
//     )
//   }