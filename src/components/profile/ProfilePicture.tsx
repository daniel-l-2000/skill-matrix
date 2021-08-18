import { useContext, useEffect, useRef, useState } from "react";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import Thumbnail from "../util/Thumbnail";
import LoadingContext from "../../store/loading-context";
import ToastContext from "../../store/toast-context";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, UserInfo } from "firebase/auth";

function ProfilePicture() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);

  const [profilePictureUrl, setProfilePictureUrl] = useState<string>();

  const { uid } = getAuth().currentUser as UserInfo;
  const profilePicturePath = `/users/${uid}/profilePicture`;

  useEffect(() => {
    const storage = getStorage();
    getDownloadURL(ref(storage, profilePicturePath))
      .then((url) => {
        setProfilePictureUrl(url);
      })
      .catch(() => {});
  }, [profilePicturePath]);

  const changePicHandler = () => {
    fileInputRef.current?.click();
  };

  const fileChangeHandler = () => {
    const file = fileInputRef.current?.files && fileInputRef.current.files[0];
    if (file) {
      if (file.size >= 2 * 1024 * 1024) {
        toastContext.showToast("File must be less than 2 MB", "warning");
      } else if (!file.type.match(/image\/(png|jpeg)/)) {
        toastContext.showToast("File has to be of type PNG or JPEG", "warning");
      } else {
        loadingContext.startLoading();
        const storage = getStorage();
        uploadBytes(ref(storage, profilePicturePath), file).then(() => {
          setProfilePictureUrl(undefined);
          getDownloadURL(ref(storage, profilePictureUrl)).then((url) => {
            loadingContext.stopLoading();
            setProfilePictureUrl(url);
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
