export const get = (request) => {
  return {
    status: 200,
    body: request.url.searchParams.get('access_token')
  }
}