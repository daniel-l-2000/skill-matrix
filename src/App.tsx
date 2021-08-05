import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginPage from "./pages/Login";
import MatrixPage from "./pages/Matrix";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" exact>
          <LoginPage></LoginPage>
        </Route>
        <Route path="/matrix">
          <MatrixPage></MatrixPage>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
