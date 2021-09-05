import { getStorage, getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import UserModel from '../../models/user';
import Thumbnail from '../util/Thumbnail';

function User(props: { index: number; user: UserModel }) {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>();

  const match = useRouteMatch();

  useEffect(() => {
    const storage = getStorage();
    getDownloadURL(ref(storage, `/users/${props.user.id}/profilePicture`))
      .then((url) => {
        setProfilePictureUrl(url);
      })
      .catch(() => {});
  }, [props.user.id]);

  return (
    <Link
      to={`${match.path}/profiles/${props.user.id}?allow-edit=false`}
      className="p-1 border-top d-flex align-items-center"
      style={{
        gridRow: props.index + 2,
      }}
    >
      {props.user.name}
      {profilePictureUrl && (
        <Thumbnail src={profilePictureUrl} className="ms-1" maxSize="1.5rem" />
      )}
    </Link>
  );
}

export default User;
