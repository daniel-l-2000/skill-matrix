import { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import LoadingContext from "../../store/loading-context";
import LoadingSpinner from "../util/LoadingSpinner";
import ToastContainer from "../util/ToastContainer";
import MainNavigation from "./MainNavigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useHistory } from "react-router-dom";

function Layout(props: { children: any }) {
  const loadingContext = useContext(LoadingContext);

  const history = useHistory();

  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
        if (history.location.pathname === "/") {
          history.replace("/matrix");
        }
      } else {
        history.replace("/");
        setIsSignedIn(false);
      }
    });
  }, [history]);

  return (
    <>
      {isSignedIn && <MainNavigation />}
      {(isSignedIn || history.location.pathname === "/") && (
        <main className="p-2">{props.children}</main>
      )}
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
