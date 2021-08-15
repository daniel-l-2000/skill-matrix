import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { User } from "../../api/models/user";
import AuthContext from "../../store/auth-context";
import LoadingContext from "../../store/loading-context";
import ToastContext from "../../store/toast-context";
import { httpGet, httpPut } from "../../api/http";
import { clearSessionData, getUserId } from "../../api/auth";
import { FaEdit, FaSave, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { httpPost, STORAGE_BASE_URL } from "../../api/http";
import { Thumbnail } from "../util/Thumbnail";

function ProfilePage() {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>();
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>();

  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);
  const authContext = useContext(AuthContext);

  const history = useHistory();

  const filePath = encodeURIComponent(`users/${getUserId()}/profilePicture`);
  const profilePictureUrl1 = `${STORAGE_BASE_URL}${filePath}?alt=media&token=`;

  useEffect(() => {
    loadingContext.startLoading();
    httpGet<User>(`/users/${getUserId()}.json`, {
      toastContext,
      history
    }).then((user) => {
      loadingContext.stopLoading();
      setName(user?.name);
      if (user?.profilePictureToken) {
        setProfilePictureUrl(
          `${profilePictureUrl1}${user.profilePictureToken}`
        );
      }
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

  const changePicHandler = () => {
    fileInputRef.current?.click();
  };

  const fileChangeHandler = () => {
    const file = fileInputRef.current?.files && fileInputRef.current.files[0];
    if (file) {
      if (file.size >= 2 * 1024 * 1024) {
        toastContext.showToast("File must be less than 2 MB", "warning");
      } else {
        loadingContext.startLoading();
        httpPost<any>(`users/${getUserId()}/profilePicture`, {
          body: file,
          toastContext,
          history
        }).then((res) => {
          httpPut(`/users/${getUserId()}/profilePictureToken.json`, {
            body: res.downloadTokens,
            toastContext,
            history
          }).then(() => {
            loadingContext.stopLoading();
            setProfilePictureUrl(`${profilePictureUrl1}${res.downloadTokens}`);
            toastContext.showToast("Profile picture changed", "success");
          });
        });
      }
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <form className="card p-2 w-100 max-card-width" onSubmit={submitHandler}>
        <div className="d-flex justify-content-center align-items-center">
          {profilePictureUrl ? (
            <Thumbnail
              src={profilePictureUrl}
              alt="No pic"
              maxSize="8rem"
              className="border rounded p-1 me-2"
            />
          ) : (
            <FaUserCircle size="2rem" className="me-2" />
          )}
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
