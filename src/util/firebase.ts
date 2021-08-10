import { httpRequest } from "./http";
import { getAuthToken } from "./identitytoolkit";

const baseUrl = "https://skill-matrix-b5cd6-default-rtdb.firebaseio.com";

function firebaseHttp<T>(
  resource: string,
  method: string,
  body?: any,
  handleErrorInComponent = false
) {
  const token = getAuthToken();
  let promise = httpRequest<T>(
    baseUrl + resource + "?auth=" + token,
    method,
    body
  );

  if (!handleErrorInComponent) {
    promise = promise.catch((reason) => {
      console.log("toast error: " + JSON.stringify(reason));
      return new Promise<T>((_) => {});
    });
  }

  return promise;
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
