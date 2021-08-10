import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { User } from "../../models/user";
import AuthContext from "../../store/auth-context";
import LoadingContext from "../../store/loading-context";
import { firebaseGet, firebasePut } from "../../util/firebase";
import { clearSessionData, getUserId } from "../../util/identitytoolkit";

function ProfilePage() {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");

  const loadingContext = useContext(LoadingContext);
  const authContext = useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {
    loadingContext.startLoading();
    firebaseGet<User>("/users/" + getUserId() + ".json").then((user) => {
      loadingContext.stopLoading();
      setName(user.name);
    });
  }, []);

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
    <div className="d-flex justify-content-center">
      <form className="card p-2 w-100 max-card-width" onSubmit={submitHandler}>
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
            defaultValue={name}
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
