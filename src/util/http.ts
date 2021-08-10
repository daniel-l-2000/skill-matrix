export function httpRequest<T>(url: string, method: string, body?: any) {
  return fetch(url, {
    method,
    body: JSON.stringify(body)
  })
    .then((res) => res.json())
    .then((res) => res as T);
}
