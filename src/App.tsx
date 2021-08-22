import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Layout from "./components/layout/Layout";
import SignInPage from "./components/pages/SignInPage";
import MatrixPage from "./components/pages/MatrixPage";
import ProfilePage from "./components/pages/ProfilePage";
import useAuth from "./hooks/use-auth";

function App() {
  const auth = useAuth();

  return (
    <Layout>
      <Switch>
        {!auth.isSignedIn && (
          <Route path="/" exact>
            <SignInPage></SignInPage>
          </Route>
        )}
        {auth.isSignedIn && (
          <Route path="/matrix">
            <MatrixPage></MatrixPage>
          </Route>
        )}
        {auth.isSignedIn && (
          <Route path="/profiles/:userId">
            <ProfilePage></ProfilePage>
          </Route>
        )}
        <Route path="*">
          {auth.isSignedIn === false && <Redirect to="/" />}
          {auth.isSignedIn === true && <Redirect to="/matrix" />}
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
