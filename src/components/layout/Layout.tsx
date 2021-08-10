import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import LoadingContext from "../../store/loading-context";
import LoadingSpinner from "../util/LoadingSpinner";
import MainNavigation from "./MainNavigation";

function Layout(props: { children: any }) {
  const loadingContext = useContext(LoadingContext);
  const authContext = useContext(AuthContext);

  return (
    <div>
      {authContext.isLoggedIn && <MainNavigation />}
      <main className="p-2">{props.children}</main>
      {loadingContext.isLoading && <LoadingSpinner />}
    </div>
  );
}

export default Layout;
