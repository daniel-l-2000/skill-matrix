import { ToastContextModel } from "../store/toast-context-model";
import { History } from "history";

export class RequestOptions {
  body?: any;
  handleErrorInComponent? = false;
  toastContext!: ToastContextModel;
  history!: History;
}

export function httpRequest<T>(
  url: string,
  method: string,
  body?: any,
  headers?: Record<string, string>
) {
  return fetch(url, {
    method,
    body: body instanceof File ? body : JSON.stringify(body),
    headers
  })
    .then(async (res) => {
      const json = await res.json();

      if (res.ok) {
        return json;
      }

      return new Promise((_, reject) => reject(json));
    })
    .then((res) => res as T | undefined);
}
