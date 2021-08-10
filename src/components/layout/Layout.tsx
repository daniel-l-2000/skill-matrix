import LoadingSpinner from "../util/LoadingSpinner";
import MainNavigation from "./MainNavigation";

function Layout(props: { children: any }) {
  return (
    <div>
      <MainNavigation />
      <main className="p-2">{props.children}</main>
      {/* <LoadingSpinner /> */}
    </div>
  );
}

export default Layout;
