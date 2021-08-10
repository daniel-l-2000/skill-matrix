import { FormEvent, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { firebasePut } from "../../util/firebase";
import { clearSessionData, getUserId } from "../../util/identitytoolkit";

function ProfilePage() {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const authContext = useContext(AuthContext);

  const history = useHistory();

  const submitHandler = (ev: FormEvent) => {
    ev.preventDefault();

    const enteredName = nameInputRef.current?.value;
    firebasePut("/users/" + getUserId() + "/name.json", enteredName).then(
      (_) => {
        console.log("Changes saved");
      }
    );
  };

  const logoutHandler = () => {
    clearSessionData();
    authContext.logout();
    history.replace("/");
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="profilePicture">Profile Picture</label>
          <input type="url" className="form-control" id="profilePicture" />
        </div>
        <div className="mt-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            ref={nameInputRef}
          />
        </div>
        <div className="mt-2 d-flex justify-content-between">
          <button className="btn btn-primary" type="submit">
            Save
          </button>
          <button
            className="btn btn-secondary ms-1"
            type="button"
            onClick={logoutHandler}
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
