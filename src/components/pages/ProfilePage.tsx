import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { User } from "../../api/models/user";
import AuthContext from "../../store/auth-context";
import LoadingContext from "../../store/loading-context";
import ToastContext from "../../store/toast-context";
import { httpGet, httpPut } from "../../api/http";
import { clearSessionData, getUserId } from "../../api/auth";
import { FaSave, FaSignOutAlt } from "react-icons/fa";
import ProfilePicture from "../profile/ProfilePicture";

function ProfilePage() {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>();
  const [profilePictureToken, setProfilePictureToken] = useState<string>();

  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);
  const authContext = useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {
    loadingContext.startLoading();
    httpGet<User>(`/users/${getUserId()}.json`, {
      toastContext,
      history
    }).then((user) => {
      loadingContext.stopLoading();
      setName(user?.name);
      setProfilePictureToken(user?.profilePictureToken);
    });
  }, []);

  const submitHandler = (ev: FormEvent) => {
    ev.preventDefault();

    const enteredName = nameInputRef.current?.value;
    httpPut(`/users/${getUserId()}/name.json`, {
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

  return (
    <div className="d-flex justify-content-center">
      <form className="card p-2 w-100 max-card-width" onSubmit={submitHandler}>
        <ProfilePicture profilePictureToken={profilePictureToken} />
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
