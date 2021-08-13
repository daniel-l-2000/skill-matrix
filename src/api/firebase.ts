import { STORAGE_BASE_URL } from "./firebase-storage";
import { httpRequest, RequestOptions } from "./http";
import { clearSessionData, getAuthToken } from "./auth";

const DATABASE_BASE_URL =
  "https://skill-matrix-b5cd6-default-rtdb.firebaseio.com";
const IDENTITY_TOOLKIT_BASE_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts";
const apiKey = "AIzaSyDLS3jH_aScYixlquSXwLyf37UY-cwrUjc";

type RequestType = "database" | "identitytoolkit" | "storage";

function getRequestType(resource: string): RequestType {
  if (resource.endsWith(".json")) {
    return "database";
  }

  if (resource.startsWith(":")) {
    return "identitytoolkit";
  }

  return "storage";
}

function getUrl(type: RequestType, resource: string) {
  switch (type) {
    case "database":
      const token = getAuthToken();
      return `${DATABASE_BASE_URL}${resource}?auth=${token}`;

    case "identitytoolkit":
      return `${IDENTITY_TOOLKIT_BASE_URL}${resource}?key=${apiKey}`;

    case "storage":
      return `${STORAGE_BASE_URL}${encodeURIComponent(resource)}`;
  }
}

function getErrorText(type: RequestType, reason: any) {
  let errorText = "";

  switch (type) {
    case "database":
      errorText = reason?.error as string;
      break;

    case "identitytoolkit":
      errorText = reason?.error?.message as string;
      if (errorText) {
        errorText = `${errorText[0]}${errorText
          .substring(1)
          .toLowerCase()
          .replace(/_/g, " ")}`;
      }
      break;

    case "storage":
      errorText = reason?.error?.message as string;
      break;
  }

  return !!errorText ? errorText : "Unknown error";
}

function firebaseHttp<T>(
  resource: string,
  method: string,
  options: RequestOptions
) {
  const token = getAuthToken();
  const requestType = getRequestType(resource);
  let promise = httpRequest<T>(
    getUrl(requestType, resource),
    method,
    options.body
  );

  if (!options.handleErrorInComponent) {
    promise = promise.catch((reason) => {
      const error = getErrorText(requestType, reason);
      options.toastContext.showToast("Error", "danger", error);

      if (error === "Auth token is expired" || !token) {
        clearSessionData();
        options.history.replace("/");
      }

      return new Promise<T>((_) => {});
    });
  }

  return promise;
}

export function httpGet<T>(resource: string, options: RequestOptions) {
  return firebaseHttp<T>(resource, "GET", options);
}

export function httpPost<T>(resource: string, options: RequestOptions) {
  return firebaseHttp<T>(resource, "POST", options);
}

export function httpPut<T>(resource: string, options: RequestOptions) {
  return firebaseHttp<T>(resource, "PUT", options);
}

export function httpDelete<T>(resource: string, options: RequestOptions) {
  return firebaseHttp<T>(resource, "DELETE", options);
}
