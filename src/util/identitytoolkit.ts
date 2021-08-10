import { httpRequest } from "./http";

const baseUrl = "https://identitytoolkit.googleapis.com/v1/accounts";
const apiKey = "AIzaSyDLS3jH_aScYixlquSXwLyf37UY-cwrUjc";

export function identitytoolkitPost(endpoint: string, body: any) {
  return httpRequest<any>(baseUrl + endpoint + "?key=" + apiKey, "POST", body);
}

export function getUserId() {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id;
  }

  return null;
}
