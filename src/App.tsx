import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/Login";
import MatrixPage from "./pages/Matrix";
import ProfilePage from "./pages/Profile";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <LoginPage></LoginPage>
        </Route>
        <Route path="/matrix">
          <MatrixPage></MatrixPage>
        </Route>
        <Route path="/profile">
          <ProfilePage></ProfilePage>
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
