import { ToastContextModel } from "../store/toast-context-model";
import { httpRequest } from "./http";
import { getAuthToken } from "./identitytoolkit";

export const STORAGE_BASE_URL =
  "https://firebasestorage.googleapis.com/v0/b/skill-matrix-b5cd6.appspot.com/o/";

export interface FirebaseStorageRequestOptions {
  body: File;
  toastContext: ToastContextModel;
}

export function firebaseStoragePost(
  filePath: string,
  options: FirebaseStorageRequestOptions
) {
  return httpRequest<any>(
    STORAGE_BASE_URL + encodeURIComponent(filePath),
    "POST",
    options.body,
    {
      Authorization: "Firebase " + getAuthToken(),
      "Content-Type": options.body.type
    }
  ).catch((reason) => {
    const error = (reason?.error?.message as string) ?? "Unknown error";
    options.toastContext.showToast("Error", "danger", error);

    return new Promise((_) => {});
  });
}
