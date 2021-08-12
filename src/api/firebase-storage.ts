import { ToastContextModel } from "../store/toast-context-model";
import { httpRequest } from "./http";
import { getAuthToken } from "./identitytoolkit";

const baseUrl =
  "https://firebasestorage.googleapis.com/v0/b/skill-matrix-b5cd6.appspot.com/o?name=";

export interface FirebaseStorageRequestOptions {
  body: File;
  toastContext: ToastContextModel;
}

export function firebaseStoragePost(
  filePath: string,
  options: FirebaseStorageRequestOptions
) {
  return httpRequest<any>(
    baseUrl + encodeURIComponent(filePath),
    "POST",
    options.body,
    {
      authorization: "Firebase " + getAuthToken(),
      "Content-Type": "image/jpeg"
    }
  ).catch((reason) => {
    const error = (reason?.error?.message as string) ?? "Unknown error";
    options.toastContext.showToast("Error", "danger", error);

    return new Promise((_) => {});
  });
}
