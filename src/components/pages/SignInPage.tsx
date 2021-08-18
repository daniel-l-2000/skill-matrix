import {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useReducer
} from "react";
import LoadingContext from "../../store/loading-context";
import ToastContext from "../../store/toast-context";
import { FaSignInAlt } from "react-icons/fa";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

interface ReducerAction {
  type: "USER_INPUT" | "INPUT_BLUR";
  val?: string;
}

interface ReducerState {
  value: string;
  isValid?: boolean;
}

function emailReducer(
  state: ReducerState,
  action: ReducerAction
): ReducerState {
  if (action.type === "USER_INPUT") {
    return { value: action.val ?? "", isValid: action.val?.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value?.includes("@") };
  }
  return { value: "", isValid: undefined };
}

function passwordReducer(
  state: ReducerState,
  action: ReducerAction
): ReducerState {
  switch (action.type) {
    case "USER_INPUT":
      return {
        value: action.val ?? "",
        isValid: !!action.val && action.val.trim().length >= 6
      };
    case "INPUT_BLUR":
      return {
        value: state.value,
        isValid: !!state.value && state.value.trim().length >= 6
      };
    default:
      return { value: "", isValid: undefined };
  }
}

function SignInPage() {
  const [formIsValid, setFormIsValid] = useState<boolean>();

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: undefined
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: undefined
  });

  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailState.isValid && passwordState.isValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailState.isValid, passwordState.isValid]);

  const emailChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    dispatchEmail({ type: "USER_INPUT", val: ev.target.value });
  };

  const passwordChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    dispatchPassword({ type: "USER_INPUT", val: ev.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    loadingContext.startLoading();

    const auth = getAuth();
    signInWithEmailAndPassword(auth, emailState.value, passwordState.value)
      .then(() => {
        loadingContext.stopLoading();
      })
      .catch((err) => {
        loadingContext.stopLoading();

        switch (err.code) {
          case "auth/wrong-password":
            toastContext.showToast("Incorrect password", "danger");
            break;
          case "auth/user-not-found":
            toastContext.showToast("Unknown email", "danger");
            break;
        }
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
            className={`form-control ${
              emailState.isValid === false && "is-invalid"
            }`}
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
              passwordState.isValid === false && "is-invalid"
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
