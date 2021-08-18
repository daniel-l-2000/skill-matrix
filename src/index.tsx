import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { LoadingContextProvider } from "./store/loading-context";
import { initializeApp } from "firebase/app";

import "./styles.css";
import { ToastContextProvider } from "./store/toast-context";

initializeApp({
  apiKey: "AIzaSyDYQ6zBeoqOLoohwVSBU_BvRMdQXGavewU",
  authDomain: "skill-matrix-b5cd6.firebaseapp.com",
  databaseURL: "https://skill-matrix-b5cd6-default-rtdb.firebaseio.com",
  projectId: "skill-matrix-b5cd6",
  storageBucket: "skill-matrix-b5cd6.appspot.com",
  messagingSenderId: "241333790692",
  appId: "1:241333790692:web:1656078dc014510f7309f1"
});

ReactDOM.render(
  <LoadingContextProvider>
    <ToastContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastContextProvider>
  </LoadingContextProvider>,
  document.getElementById("root")
);
