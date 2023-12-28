import type { ActionFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Button, Card, Layout, Page, TextField } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import {  useSubmit, Form, useActionData } from "@remix-run/react";
// import { createUser } from "~/api/mongo.server";


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email');
  console.log(email)



  try {

const { admin } = await authenticate.admin(request);


const response = await admin.graphql(
  `#graphql
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      userErrors {
        field
        message
      }
      customer {
        id
        email
        phone
        firstName
        lastName
        smsMarketingConsent {
          marketingState
          marketingOptInLevel
        }
        addresses {
          address1
          city
          country
          phone
          zip
        }
      }
    }
  }`,
  {
    variables: {
      "input": {
        "email": 'gido@email.com',
        "phone": "+13052342233",
        "firstName": "gido",
        "lastName": "tapia",
        "acceptsMarketing": true,
        "addresses": [
          {
            "address1": "905 BRICKELL BAY DR",
            "city": "Miami",
            "province": "FL",
            "phone": "1234911030",
            "zip": "33131",
            "lastName": "paul",
            "firstName": "richard",
            "country": "USA"
          }
        ]
      }
    },
  },
);

if (response.ok){
     console.log("hit")
     const data = await response.json();
     console.log(data, "data")

    //  await createUser({
    //   email: 'new@email.com',
    //   name: 'richard',
    // });

    return json({
         data: data.data
      });

}

 return null;
}

  catch(err) {

    console.log(err)

  } 
}




const Customers = () => {
    const submit = useSubmit();
    const actionData = useActionData<typeof action>();

    console.log(actionData, actionData)

    const createCustomer = () => submit({}, { replace: true, method: "POST" });

  return (
       <Page>
          <Layout>
          <Layout.Section>
          <Card>
            <Form onSubmit={createCustomer} method="post">
            <TextField
            id="email"
            name="email"
            label="Email"
            autoComplete="off"
            />
                     <TextField
           label="Phone Number"
           autoComplete="off"
           type="number"
            />
          <TextField
                     autoComplete="off"
                     label="new"



            />
         <Button submit>Create Customer</Button>
            </Form>
           </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <h1>hello world</h1>

            </Card>
          </Layout.Section>

          </Layout>
  </Page>
  )};

export default Customers;
