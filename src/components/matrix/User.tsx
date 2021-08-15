import styled from "styled-components";
import { STORAGE_BASE_URL } from "../../api/http";

const Thumbnail = styled.img`
  max-width: 2rem;
  max-height: 1.5rem;
`;

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
        />
      )}
    </div>
  );
}

export default User;
