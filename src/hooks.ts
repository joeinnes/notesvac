import type { Handle } from "@sveltejs/kit";

/*export const handle: Handle = async ({ event, resolve }) => {
  const request = event.request;
  // Protocol below doesn't matter because it's not being used for anything.
  const reqUrl = new URL(request.url, `https://${request.headers.get("host")}`);
  const response = await resolve(event, {
    ssr: reqUrl.pathname === '/'
  });

  return response;
}*/