import { FormEvent, useContext, useEffect } from 'react';
import LoadingContext from '../../store/loading-context';
import { FaSignInAlt } from 'react-icons/fa';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import useFormControl from '../../hooks/use-form-control';
import useToasts from '../../hooks/use-toasts';

function SignInPage() {
  const [formIsValid, setFormIsValid] = useState<boolean>(false);

  const emailInput = useFormControl((value) => value.includes('@'));
  const passwordInput = useFormControl((value) => value.length >= 6);

  const loadingContext = useContext(LoadingContext);

  const showToast = useToasts();

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailInput.isValid && passwordInput.isValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailInput.isValid, passwordInput.isValid]);

  const submitHandler = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    loadingContext.startLoading();

    const auth = getAuth();
    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
      .then(() => {
        loadingContext.stopLoading();
      })
      .catch((err) => {
        loadingContext.stopLoading();

        passwordInput.reset();

        switch (err.code) {
          case 'auth/wrong-password':
            showToast('Incorrect password', 'danger');
            break;
          case 'auth/user-not-found':
            showToast('Unknown email', 'danger');
            break;
        }
      });
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <form className="card p-3 w-100 max-card-width" onSubmit={submitHandler}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={emailInput.value}
            className={emailInput.classes}
            required
            onChange={emailInput.changeHandler}
            onBlur={emailInput.blurHandler}
          />
          {emailInput.hasError && (
            <div className="form-text text-danger">
              Please enter a valid email address
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={passwordInput.value}
            className={passwordInput.classes}
            required
            minLength={6}
            onChange={passwordInput.changeHandler}
            onBlur={passwordInput.blurHandler}
          />
          {passwordInput.hasError && (
            <div className="form-text text-danger">
              The password must have 6 or more characters
            </div>
          )}
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
