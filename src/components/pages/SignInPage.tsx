import { ChangeEvent, FormEvent, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import LoadingContext from "../../store/loading-context";
import ToastContext from "../../store/toast-context";
import { getAuthToken, setAuthToken } from "../../api/auth";
import { httpPost } from "../../api/http";
import { FaSignInAlt } from "react-icons/fa";
import { useState } from "react";

function SignInPage() {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState<boolean>();
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>();
  const [formIsValid, setFormIsValid] = useState(false);

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
  }, []);

  // useEffect(() => {
  //   const identifier = setTimeout(() => {
  //     setFormIsValid(
  //       enteredEmail.includes('@') && enteredPassword.trim().length >= 6
  //     );
  //   }, 500);

  //   return () => {
  //     clearTimeout(identifier);
  //   };
  // }, [enteredEmail, enteredPassword]);

  const emailChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setEnteredEmail(ev.target.value);

    setFormIsValid(
      ev.target.value.includes("@") && enteredPassword.trim().length >= 6
    );
  };

  const passwordChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setEnteredPassword(ev.target.value);

    setFormIsValid(
      enteredEmail.includes("@") && ev.target.value.trim().length >= 6
    );
  };

  const validateEmailHandler = () => {
    setEmailIsValid(enteredEmail.includes("@"));
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length >= 6);
  };

  const submitHandler = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    loadingContext.startLoading();
    httpPost<any>(":signInWithPassword", {
      toastContext,
      history,
      body: {
        email: enteredEmail,
        password: enteredPassword,
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
            className={`form-control ${emailIsValid === false && "is-invalid"}`}
            required
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className={`form-control ${
              passwordIsValid === false && "is-invalid"
            }`}
            required
            minLength={6}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className="d-flex flex-row-reverse">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!formIsValid}
          >
            <FaSignInAlt className="me-1" />
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignInPage;
