import { ToastContextModel } from "../store/toast-context-model";
import { History } from "history";
import { clearSessionData, getAuthToken } from "./auth";

export const DATABASE_BASE_URL =
  "https://skill-matrix-b5cd6-default-rtdb.firebaseio.com";
export const IDENTITY_TOOLKIT_BASE_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts";
export const STORAGE_BASE_URL =
  "https://firebasestorage.googleapis.com/v0/b/skill-matrix-b5cd6.appspot.com/o/";
export const API_KEY = "AIzaSyDLS3jH_aScYixlquSXwLyf37UY-cwrUjc";

type RequestType = "database" | "identitytoolkit" | "storage";

export class RequestOptions {
  body?: any;
  skipErrorHandling? = false;
  toastContext!: ToastContextModel;
  history!: History;
}

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
      return `${IDENTITY_TOOLKIT_BASE_URL}${resource}?key=${API_KEY}`;

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

function getHeaders(
  type: RequestType,
  body: any
): Record<string, string> | undefined {
  switch (type) {
    case "database":
    case "identitytoolkit":
      return undefined;

    case "storage":
      return {
        Authorization: `Firebase ${getAuthToken()}`,
        "Content-Type": body.type
      };
  }
}

function httpRequest<T>(
  resource: string,
  method: string,
  options: RequestOptions
) {
  const token = getAuthToken();
  const requestType = getRequestType(resource);
  const url = getUrl(requestType, resource);
  const headers = getHeaders(requestType, options.body);

  let promise = fetch(url, {
    method,
    body:
      options.body instanceof File
        ? options.body
        : JSON.stringify(options.body),
    headers
  }).then(async (res) => {
    const json = await res.json();

    if (!res.ok) {
      return new Promise<undefined>((_, reject) => reject(json));
    }

    return json as T | undefined;
  });

  if (!options.skipErrorHandling) {
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
  return httpRequest<T>(resource, "GET", options);
}

export function httpPost<T>(resource: string, options: RequestOptions) {
  return httpRequest<T>(resource, "POST", options);
}

export function httpPut<T>(resource: string, options: RequestOptions) {
  return httpRequest<T>(resource, "PUT", options);
}

export function httpDelete<T>(resource: string, options: RequestOptions) {
  return httpRequest<T>(resource, "DELETE", options);
}
