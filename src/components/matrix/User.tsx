import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import Thumbnail from "../util/Thumbnail";

function User(props: { index: number; id: string; name: string }) {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>();

  useEffect(() => {
    const storage = getStorage();
    getDownloadURL(ref(storage, `/users/${props.id}/profilePicture`))
      .then((url) => {
        setProfilePictureUrl(url);
      })
      .catch(() => {});
  }, [props.id]);

  return (
    <div
      className="p-1 border-top d-flex align-items-center"
      style={{
        gridRow: props.index + 2
      }}
    >
      {props.name}
      {profilePictureUrl && (
        <Thumbnail src={profilePictureUrl} className="ms-1" maxSize="1.5rem" />
      )}
    </div>
  );
}

export default User;
