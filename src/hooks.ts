import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ request, resolve }) => {
  const response = await resolve(request, {
    ssr: request.url.pathname === '/'
  });

  return response;
}