export interface AuthContextModel {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}
