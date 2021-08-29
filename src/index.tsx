import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LoadingContextProvider } from './store/context/loading-context';
import { BrowserRouter } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { Provider } from 'react-redux';
import store from './store/redux';

initializeApp({
  apiKey: 'AIzaSyDYQ6zBeoqOLoohwVSBU_BvRMdQXGavewU',
  authDomain: 'skill-matrix-b5cd6.firebaseapp.com',
  databaseURL: 'https://skill-matrix-b5cd6-default-rtdb.firebaseio.com',
  projectId: 'skill-matrix-b5cd6',
  storageBucket: 'skill-matrix-b5cd6.appspot.com',
  messagingSenderId: '241333790692',
  appId: '1:241333790692:web:1656078dc014510f7309f1',
});

ReactDOM.render(
  <Provider store={store}>
    <LoadingContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LoadingContextProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
