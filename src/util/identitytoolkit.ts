import { ToastContextModel } from "../store/toast-context-model";
import { httpRequest } from "./helper-functions";

const baseUrl = "https://identitytoolkit.googleapis.com/v1/accounts";
const apiKey = "AIzaSyDLS3jH_aScYixlquSXwLyf37UY-cwrUjc";

export interface IdentitytoolkitRequestOptions {
  body: any;
  toastContext: ToastContextModel;
}

export function identitytoolkitPost(
  endpoint: string,
  options: IdentitytoolkitRequestOptions
) {
  return httpRequest<any>(
    baseUrl + endpoint + "?key=" + apiKey,
    "POST",
    options.body
  ).catch((reason) => {
    let error = (reason?.error?.message as string) ?? "Unknown error";
    error = error[0] + error.substring(1).toLowerCase().replace(/_/g, " ");
    options.toastContext.showToast("Error", "warning", error);

    return new Promise((_) => {});
  });
}

export function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function setAuthToken(token: string) {
  localStorage.setItem("authToken", token);
}

export function clearSessionData() {
  localStorage.clear();
}

export function getUserId() {
  const token = getAuthToken();
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id;
  }

  return null;
}
