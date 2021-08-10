import { httpRequest } from "./http";
import { clearSessionData, getAuthToken } from "./identitytoolkit";
import { History } from "history";
import { ToastContextModel } from "../store/toast-context-model";

const baseUrl = "https://skill-matrix-b5cd6-default-rtdb.firebaseio.com";

export class FirebaseRequestOptions {
  body?: any;
  handleErrorInComponent? = false;
  toastContext!: ToastContextModel;
  history!: History;
}

function firebaseHttp<T>(
  resource: string,
  method: string,
  options: FirebaseRequestOptions
) {
  const token = getAuthToken();
  let promise = httpRequest<T>(
    baseUrl + resource + "?auth=" + token,
    method,
    options.body
  );

  if (!options.handleErrorInComponent) {
    promise = promise.catch((reason) => {
      const error = (reason?.error as string) ?? "Unknown error";
      options.toastContext.showToast("Error", error);

      if (error === "Auth token is expired") {
        clearSessionData();
        options.history.replace("/");
      }

      return new Promise<T>((_) => {});
    });
  }

  return promise;
}

export function firebaseGet<T>(
  resource: string,
  options: FirebaseRequestOptions
) {
  return firebaseHttp<T>(resource, "GET", options);
}

export function firebasePut<T>(
  resource: string,
  options: FirebaseRequestOptions
) {
  return firebaseHttp<T>(resource, "PUT", options);
}

export function firebaseDelete<T>(
  resource: string,
  options: FirebaseRequestOptions
) {
  return firebaseHttp<T>(resource, "DELETE", options);
}
