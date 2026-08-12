export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const response = await fetch(new URL(url.pathname, url.origin), request)
    if (response.status !== 404 || url.pathname.includes('.')) return response
    return fetch(new URL('/index.html', url.origin), request)
  },
}
