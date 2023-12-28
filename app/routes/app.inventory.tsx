import { Page } from "@shopify/polaris";
import type { LoaderFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import {  authenticate } from "~/shopify.server";
import { useLoaderData } from "@remix-run/react";


export const loader: LoaderFunction = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    const { admin } = await authenticate.admin(request);

    try {

       const response =  await admin.rest.resources.InventoryLevel.all({
            session: session,
            location_ids: "67335028890",
          });
        

          if (response) {

            console.log('hit')

          const data = response.data

          console.log(data, "inventory levels")

          return json({
            inventory: data
        });
        }

           
         return null;

    } catch(err){
        console.log(err)
    }
}




const Inventory = () => {
    const data: any = useLoaderData();
    console.log(data, "inventory");
  return (
    <Page>app.inventory</Page>
)};

export default Inventory;
