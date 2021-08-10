export function httpRequest<T>(url: string, method: string, body?: any) {
  return fetch(url, {
    method,
    body: JSON.stringify(body)
  })
    .then(async (res) => {
      const json = await res.json();

      if (res.ok) {
        return json;
      }

      return new Promise((_, reject) => {
        reject(json);
      });
    })
    .then((res) => res as T);
}
