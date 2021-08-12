import { createContext, useState } from "react";
import { AuthContextModel } from "./auth-context-model";

const AuthContext = createContext<AuthContextModel>({
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {}
});

export function AuthContextProvider(props: { children: any }) {
  const [isSignedIn, setisSignedIn] = useState(true);

  const signIn = () => {
    setisSignedIn(true);
  };

  const signOut = () => {
    setisSignedIn(false);
  };

  const context: AuthContextModel = { isSignedIn, signIn, signOut };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
