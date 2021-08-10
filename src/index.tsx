import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { LoadingContextProvider } from "./store/loading-context";

import "./styles.css";

ReactDOM.render(
  <LoadingContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </LoadingContextProvider>,
  document.getElementById("root")
);
