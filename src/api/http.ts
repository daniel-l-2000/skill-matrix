export function httpRequest<T>(
  url: string,
  method: string,
  body?: any,
  headers?: Record<string, string>
) {
  return fetch(url, {
    method,
    body: body instanceof File ? body : JSON.stringify(body),
    headers
  })
    .then(async (res) => {
      const json = await res.json();

      if (res.ok) {
        return json;
      }

      return new Promise((_, reject) => reject(json));
    })
    .then((res) => res as T | undefined);
}
