import { useContext } from "react";
import LoadingContext from "../../store/loading-context";
import LoadingSpinner from "../util/LoadingSpinner";
import MainNavigation from "./MainNavigation";

function Layout(props: { children: any }) {
  const loadingContext = useContext(LoadingContext);

  return (
    <div>
      <MainNavigation />
      <main className="p-2">{props.children}</main>
      {loadingContext.isLoading && <LoadingSpinner />}
    </div>
  );
}

export default Layout;
