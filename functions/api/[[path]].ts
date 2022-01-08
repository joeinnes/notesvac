export async function onRequest(context) {
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    // params
  } = context;
  const apiUrl = env.API_URL;
  const newReq = new Request(apiUrl, request);
  newReq.headers.set("Origin", new URL(apiUrl).origin)

  let response = await fetch(request)
  response = new Response(response.body, response)
  response.headers.set("Access-Control-Allow-Origin", url.origin)
  response.headers.append("Vary", "Origin")
  return response
}