import { FormEvent, useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import LoadingContext from "../../store/loading-context";
import {
  getAuthToken,
  identitytoolkitPost,
  setAuthToken
} from "../../util/identitytoolkit";
import classes from "./Login.module.css";

function LoginPage() {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const loadingContext = useContext(LoadingContext);
  const authContext = useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      authContext.login();
      history.replace("/matrix");
    }
  }, [history]);

  const submitHandler = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    loadingContext.startLoading();
    identitytoolkitPost(":signInWithPassword", {
      email: emailInputRef.current?.value,
      password: passwordInputRef.current?.value,
      returnSecureToken: true
    }).then((res) => {
      loadingContext.stopLoading();
      authContext.login();
      setAuthToken(res.idToken);
      history.replace("/matrix");
    });
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <form
        className={"card p-3 w-100 " + classes.loginForm}
        onSubmit={submitHandler}
      >
        <div className="mb-3">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            className="form-control"
            required
            ref={emailInputRef}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className="d-flex flex-row-reverse">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
