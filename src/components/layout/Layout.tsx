import { useContext } from "react";
import ReactDOM from "react-dom";
import AuthContext from "../../store/auth-context";
import LoadingContext from "../../store/loading-context";
import LoadingSpinner from "../util/LoadingSpinner";
import ToastContainer from "../util/ToastContainer";
import MainNavigation from "./MainNavigation";

function Layout(props: { children: any }) {
  const loadingContext = useContext(LoadingContext);
  const authContext = useContext(AuthContext);

  return (
    <>
      {authContext.isSignedIn && <MainNavigation />}
      <main className="p-2">{props.children}</main>
      {loadingContext.isLoading &&
        ReactDOM.createPortal(
          <LoadingSpinner />,
          document.getElementById("lds-root") as Element
        )}
      {ReactDOM.createPortal(
        <ToastContainer />,
        document.getElementById("toasts-root") as Element
      )}
    </>
  );
}

export default Layout;
