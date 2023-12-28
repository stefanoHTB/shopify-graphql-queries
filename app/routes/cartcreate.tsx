import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
// import db from "../../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, admin } = await authenticate.webhook(
    request
  );

  if (!admin) {
    throw new Response();
  }

  switch (topic) {
    case "CARTS_CREATE":
      console.log('hit webhook')

      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};