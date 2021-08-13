import { FormEvent, useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import LoadingContext from "../../store/loading-context";
import ToastContext from "../../store/toast-context";
import { getAuthToken, setAuthToken } from "../../api/auth";
import { httpPost } from "../../api/firebase";
import { FaSignInAlt } from "react-icons/fa";

function SignInPage() {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const loadingContext = useContext(LoadingContext);
  const authContext = useContext(AuthContext);
  const toastContext = useContext(ToastContext);

  const history = useHistory();

  useEffect(() => {
    authContext.signOut();
    const token = getAuthToken();
    if (token) {
      authContext.signIn();
      history.replace("/matrix");
    }
  }, [authContext, history]);

  const submitHandler = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    loadingContext.startLoading();
    httpPost<any>(":signInWithPassword", {
      toastContext,
      history,
      body: {
        email: emailInputRef.current?.value,
        password: passwordInputRef.current?.value,
        returnSecureToken: true
      }
    }).then((res) => {
      loadingContext.stopLoading();
      authContext.signIn();
      setAuthToken(res.idToken);
      history.replace("/matrix");
    });
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <form className="card p-3 w-100 max-card-width" onSubmit={submitHandler}>
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
            <FaSignInAlt className="me-1" />
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignInPage;
