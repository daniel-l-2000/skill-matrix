import MainNavigation from "./MainNavigation";

function Layout(props: { children: any }) {
  return (
    <div>
      <MainNavigation></MainNavigation>
      <main className="p-2">{props.children}</main>
    </div>
  );
}

export default Layout;
