import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { LoadingContextProvider } from "./store/loading-context";
import { AuthContextProvider } from "./store/auth-context";

import "./styles.css";
import { ToastContextProvider } from "./store/toast-context";

ReactDOM.render(
  <LoadingContextProvider>
    <AuthContextProvider>
      <ToastContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastContextProvider>
    </AuthContextProvider>
  </LoadingContextProvider>,
  document.getElementById("root")
);
