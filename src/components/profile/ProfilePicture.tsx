import { useContext, useEffect, useRef, useState } from 'react';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import Thumbnail from '../util/Thumbnail';
import LoadingContext from '../../store/context/loading-context';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { showAndPopToast } from '../../store/redux';

function ProfilePicture(props: { userId: string; canEdit: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingContext = useContext(LoadingContext);

  const dispatch = useDispatch();

  const [profilePictureUrl, setProfilePictureUrl] = useState<string>();

  const profilePicturePath = `/users/${props.userId}/profilePicture`;

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
      if (!file.type.match(/image\/(png|jpeg)/)) {
        dispatch(
          showAndPopToast('File has to be of type PNG or JPEG', 'warning')
        );
      } else if (file.size >= 2 * 1024 * 1024) {
        dispatch(showAndPopToast('File must be less than 2 MB', 'warning'));
      } else {
        loadingContext.startLoading();

        const storage = getStorage();
        uploadBytes(ref(storage, profilePicturePath), file).then(() => {
          setProfilePictureUrl(undefined);

          getDownloadURL(ref(storage, profilePictureUrl)).then((url) => {
            loadingContext.stopLoading();
            dispatch(showAndPopToast('Profile picture changed', 'success'));
            setProfilePictureUrl(url);
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
          className={`border rounded p-1 ${props.canEdit && 'me-2'}`}
        />
      ) : (
        <FaUserCircle size="2rem" className={props.canEdit ? 'me-2' : ''} />
      )}
      {props.canEdit && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={changePicHandler}
        >
          <FaEdit className="me-1" />
          Change
        </button>
      )}
      <input
        type="file"
        className="d-none"
        placeholder="Profile Picture"
        onChange={fileChangeHandler}
        ref={fileInputRef}
      />
    </div>
  );
}

export default ProfilePicture;
