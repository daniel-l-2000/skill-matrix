import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import ToastContext from "../../store/toast-context";
import { FaSave, FaSignOutAlt } from "react-icons/fa";
import ProfilePicture from "../profile/ProfilePicture";
import { getAuth } from "firebase/auth";
import useDatabase from "../../hooks/use-database";

function ProfilePage() {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>();

  const toastContext = useContext(ToastContext);

  const user = getAuth().currentUser;
  const readName = useDatabase<string>(`/users/${user?.uid}/name`, "read");
  const updateName = useDatabase(`/users/${user?.uid}`, "update");

  useEffect(() => {
    readName().then((result) => {
      if (result) {
        setName(result);
      }
    });
  }, [readName]);

  const submitHandler = (ev: FormEvent) => {
    ev.preventDefault();

    const enteredName = nameInputRef.current?.value;
    updateName({ name: enteredName }).then(() => {
      toastContext.showToast("Changes saved", "success");
    });
  };

  const signOutHandler = () => {
    getAuth().signOut();
  };

  if (!name) {
    return <div></div>;
  }

  return (
    <div className="d-flex justify-content-center">
      <form className="card p-2 w-100 max-card-width" onSubmit={submitHandler}>
        <ProfilePicture />
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
