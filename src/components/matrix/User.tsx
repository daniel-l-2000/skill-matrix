import { STORAGE_BASE_URL } from "../../api/http";
import Thumbnail from "../util/Thumbnail";

function User(props: {
  index: number;
  id: string;
  name: string;
  profilePictureToken?: string;
}) {
  const filePath = encodeURIComponent(`users/${props.id}/profilePicture`);
  const profilePictureUrl1 = `${STORAGE_BASE_URL}${filePath}?alt=media&token=`;

  return (
    <div
      className="p-1 border-top d-flex align-items-center"
      style={{
        gridRow: props.index + 2
      }}
    >
      {props.name}
      {props.profilePictureToken && (
        <Thumbnail
          src={`${profilePictureUrl1}${props.profilePictureToken}`}
          className="ms-1"
          maxSize="1.5rem"
        />
      )}
    </div>
  );
}

export default User;
