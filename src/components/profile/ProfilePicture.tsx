import { useContext, useEffect, useRef } from "react";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { getUserId } from "../../api/auth";
import { httpPost, httpPut, STORAGE_BASE_URL } from "../../api/http";
import Thumbnail from "../util/Thumbnail";
import LoadingContext from "../../store/loading-context";
import ToastContext from "../../store/toast-context";
import { useState } from "react";

function ProfilePicture(props: { profilePictureToken?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profilePictureUrl, setProfilePictureUrl] = useState<string>();

  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);

  const history = useHistory();

  const filePath = encodeURIComponent(`users/${getUserId()}/profilePicture`);
  const profilePictureUrl1 = `${STORAGE_BASE_URL}${filePath}?alt=media&token=`;

  useEffect(() => {
    if (props.profilePictureToken) {
      setProfilePictureUrl(`${profilePictureUrl1}${props.profilePictureToken}`);
    }
  }, [profilePictureUrl1, props.profilePictureToken]);

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
  );
}

export default ProfilePicture;
