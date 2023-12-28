import type { ActionFunction, LoaderFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Button, Card, Page, Select, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useLoaderData, useActionData, useSubmit, Form } from "@remix-run/react";
import { apiVersion, authenticate } from "~/shopify.server";
import { getCollectionsQuery } from "~/graphql/queries/getCollections";


export const action: ActionFunction = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const discountTitlee = formData.get('discountTitlee');
    console.log(discountTitlee, 'discountTitlee')
    try {
        // const discountTitle = "3 discount";
        const startsAt = "2022-06-21T00:00:00Z";
        const endsAt = "2022-09-21T00:00:00Z";
        const minimumRequirementSubtotal = 2;
        const discountAmount = 3;



        // const selectedCollectionId = "gid://shopify/Collection/293021417626"

        const response = await admin.graphql(
         `#graphql
                  mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
                    discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
                      automaticDiscountNode {
                        id
                        automaticDiscount {
                          ... on DiscountAutomaticBasic {
                            startsAt
                            endsAt
                            minimumRequirement {
                          ... on DiscountMinimumSubtotal {
                           greaterThanOrEqualToSubtotal {
                                 amount
                                 currencyCode
                           }
                           }
                         }
                            customerGets {
                              value {
                                ... on DiscountAmount {
                                  amount {
                                    amount
                                    currencyCode
                                  }
                                  appliesOnEachItem
                                  
                                }
                              }
                              items {
                                ... on AllDiscountItems {
                                  allItems
                                }
                                # ... on DiscountCollections {
                                #   collections(first: 2) {
                                #    edges {
                                #      node {
                                #        id
                                #        description
                                #       }
                                #     }
                                #    }
                                #  }
                              }
                            }
                          }
                        }
                      }
                      userErrors {
                        field
                        code
                        message
                      }
                    }
                  }`,
                  {
                variables: {
                  automaticBasicDiscount: {
                    title: discountTitlee,
                    startsAt,
                    endsAt,
                    minimumRequirement: {
                      subtotal: {
                        greaterThanOrEqualToSubtotal: minimumRequirementSubtotal,
                      },
                    },
                    customerGets: {
                      value: {
                        discountAmount: {
                          amount: discountAmount,
                          appliesOnEachItem: false,
                        },
                      },
                      items: {
                        all: true,
                        // collections: {
                        //     add: [
                        //         selectedCollectionId
                        //     ]
                        // }
                        
                      },
                    },
                 },
             }
        });

       if (response.ok) {
                const responseJson = await response.json();
                console.log('discount created!')
                return json({
                    discount: responseJson.data
                });
        } 
            
        return null;
            
    } catch(err){
        console.log(err, "main error")
    }
}


export const loader: LoaderFunction = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    const { shop, accessToken } = session;

    try {
        const response = await fetch(
          `https://${shop}/admin/api/${apiVersion}/graphql.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/graphql",
              "X-Shopify-Access-Token": accessToken!,
            },
            body: getCollectionsQuery,
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

const CreateDiscount = () => {
    const collections: any = useLoaderData();
    console.log(collections, "collections");


    const [priceRuleTitle, setPriceRuleTitle] = useState('');
    const [discountAmount, setDiscountAmount] = useState('');
    

    //select code
    const [selectedCollection, setSelectedCollection] = useState('');

    const handleSelectChange = useCallback((value: string) => {
        setSelectedCollection(value);
      }, []);

    const selectOptions = collections.map((edge: any) => ({
        label: edge.node.title,
        value: edge.node.id,
      }));

    //submit form
    const submit = useSubmit();
    const actionData = useActionData<typeof action>();
    console.log(actionData, actionData)
    const generateDiscount = () => submit({}, { replace: true, method: "POST" });


return (
  <Page>
    <Card>
      <Form onSubmit={generateDiscount} method="post">
        {/* <FormLayout> */}
          <TextField
            id="discountTitlee"
            name="discountTitlee"
            label="Discount Title"
            autoComplete="off"
            value={priceRuleTitle}
            onChange={(value) => setPriceRuleTitle(value)}
            />
          <Select
              label="Select Collection"
              options={selectOptions}
              onChange={handleSelectChange}
              value={selectedCollection}
            />
         <TextField
           label="Discount Amount"
           autoComplete="off"
           value={discountAmount}
           type="number"
           onChange={(value) => setDiscountAmount(value)}
            />
         <Button submit>Create Discount</Button>
       {/* </FormLayout> */}
     </Form>
   </Card> 
</Page>
)};

export default CreateDiscount;
