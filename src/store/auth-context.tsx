import { createContext, useState } from "react";
import { AuthContextModel } from "./auth-context-model";

const AuthContext = createContext<AuthContextModel>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {}
});

export function AuthContextProvider(props: { children: any }) {
  const [isLoggedIn, setisLoggedIn] = useState(false);

  const login = () => {
    setisLoggedIn(true);
  };

  const logout = () => {
    setisLoggedIn(false);
  };

  const context: AuthContextModel = { isLoggedIn, login, logout };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
