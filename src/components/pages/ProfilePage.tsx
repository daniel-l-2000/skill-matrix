import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import ToastContext from "../../store/toast-context";
import { FaSave, FaSignOutAlt } from "react-icons/fa";
import ProfilePicture from "../profile/ProfilePicture";
import { getAuth } from "firebase/auth";
import useDatabase from "../../hooks/use-database";
import { Prompt, useLocation, useParams } from "react-router-dom";

function ProfilePage() {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const params = useParams() as { userId: string };
  const location = useLocation();

  const [name, setName] = useState<string>();
  const [wasFocused, setWasFocused] = useState(false);

  const toastContext = useContext(ToastContext);

  const readName = useDatabase<string>(`/users/${params.userId}/name`, "read");
  const updateName = useDatabase(`/users/${params.userId}`, "update");

  const queryParams = new URLSearchParams(location.search);
  const allowEdit = JSON.parse(queryParams.get("allow-edit") ?? "");
  const signedInUserId = getAuth().currentUser?.uid;

  const isSignedInUser = signedInUserId === params.userId;
  const canEdit = isSignedInUser && allowEdit;

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

  const focusHandler = () => {
    setWasFocused(true);
  };

  const signOutHandler = () => {
    getAuth().signOut();
  };

  if (!name) {
    return <div></div>;
  }

  return (
    <>
      <Prompt
        when={wasFocused}
        message={() =>
          "Do you really want to leave? Your entered data will be lost!"
        }
      />
      <div className="d-flex justify-content-center">
        <form
          className="card p-2 w-100 max-card-width"
          onSubmit={submitHandler}
          onFocus={focusHandler}
        >
          <ProfilePicture
            canEdit={canEdit}
            userId={params.userId}
            key={params.userId}
          />
          <div key={name} className={`mt-2 ${!canEdit && "text-center"}`}>
            {canEdit ? (
              <>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  maxLength={100}
                  className="form-control"
                  id="name"
                  defaultValue={name}
                  ref={nameInputRef}
                />
              </>
            ) : (
              <span>{name}</span>
            )}
          </div>
          {canEdit && (
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
          )}
        </form>
      </div>
    </>
  );
}

export default ProfilePage;
