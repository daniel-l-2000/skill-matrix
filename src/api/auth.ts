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
