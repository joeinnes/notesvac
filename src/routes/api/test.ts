import type { RequestHandler } from "@sveltejs/kit";
import(!process.env.CF_PAGES ? 'dotenv/config' : '');
import openai from "../../lib/openai";

export const post: RequestHandler = async (request) => {

  const encoded = openai.tokens('Hello, world!');
  console.log(encoded);

  console.log(tokensJson)
  return {
    status: 200,
    body: { access_token, data }
  }
}