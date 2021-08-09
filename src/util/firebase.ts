const baseUrl = "https://skill-matrix-b5cd6-default-rtdb.firebaseio.com/";

function firebaseHttp<T>(resource: string, method: string, body?: any) {
  const token = localStorage.getItem("token");
  return fetch(baseUrl + resource + "?auth=" + token, {
    method,
    body: JSON.stringify(body)
  })
    .then((res) => res.json())
    .then((res) => res as T);
}

export function firebaseGet<T>(resource: string) {
  return firebaseHttp<T>(resource, "GET");
}

export function firebasePut<T>(resource: string, body: any) {
  return firebaseHttp<T>(resource, "PUT", body);
}

export function firebaseDelete<T>(resource: string) {
  return firebaseHttp<T>(resource, "DELETE");
}

export function getUserId() {
  return "QIuSXFa7lgMiWGd7rVCxXpK8FKa2";
}
