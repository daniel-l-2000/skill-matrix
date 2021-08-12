import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { User } from "../../api/models/user";
import AuthContext from "../../store/auth-context";
import LoadingContext from "../../store/loading-context";
import ToastContext from "../../store/toast-context";
import { firebaseGet, firebasePut } from "../../api/firebase";
import { clearSessionData, getUserId } from "../../api/identitytoolkit";
import { FaEdit, FaSave, FaSignOutAlt } from "react-icons/fa";

function ProfilePage() {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");

  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);
  const authContext = useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {
    loadingContext.startLoading();
    firebaseGet<User>("/users/" + getUserId() + ".json", {
      toastContext,
      history
    }).then((user) => {
      loadingContext.stopLoading();
      setName(user?.name);
    });
  }, []);

  const submitHandler = (ev: FormEvent) => {
    ev.preventDefault();

    const enteredName = nameInputRef.current?.value;
    firebasePut("/users/" + getUserId() + "/name.json", {
      toastContext,
      history,
      body: enteredName
    }).then(() => {
      toastContext.showToast("Changes saved", "success");
    });
  };

  const signOutHandler = () => {
    clearSessionData();
    authContext.signOut();
    history.replace("/");
  };

  const changePicHandler = () => {
    fileInputRef.current?.click();
  };

  const fileChangeHandler = () => {
    console.log(fileInputRef.current?.files[0]);
  };

  return (
    <div className="d-flex justify-content-center">
      <form className="card p-2 w-100 max-card-width" onSubmit={submitHandler}>
        <div className="d-flex justify-content-center align-items-center">
          <img
            src="https://picsum.photos/200/300"
            alt="No pic"
            width="85"
            height="85"
            className="border rounded p-1 me-2"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={changePicHandler}
          >
            <FaEdit className="me-1" />
            Change
          </button>
          <input
            type="file"
            className="d-none"
            onChange={fileChangeHandler}
            ref={fileInputRef}
          />
        </div>
        <div className="mt-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            maxLength={100}
            className="form-control"
            id="name"
            defaultValue={name}
            ref={nameInputRef}
          />
        </div>
        <div className="mt-2 d-flex justify-content-between">
          <button className="btn btn-primary" type="submit">
            <FaSave className="me-1" />
            Save
          </button>
          <button
            className="btn btn-secondary ms-1"
            type="button"
            onClick={signOutHandler}
          >
            <FaSignOutAlt className="me-1" />
            Sign out
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
