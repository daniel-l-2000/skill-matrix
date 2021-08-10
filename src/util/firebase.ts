import { httpRequest } from "./http";

const baseUrl = "https://skill-matrix-b5cd6-default-rtdb.firebaseio.com";

function firebaseHttp<T>(resource: string, method: string, body?: any) {
  const token = localStorage.getItem("token");
  return httpRequest<T>(baseUrl + resource + "?auth=" + token, method, body);
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
