import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { LoadingContextProvider } from "./store/loading-context";
import { AuthContextProvider } from "./store/auth-context";

import "./styles.css";

ReactDOM.render(
  <LoadingContextProvider>
    <AuthContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthContextProvider>
  </LoadingContextProvider>,
  document.getElementById("root")
);
