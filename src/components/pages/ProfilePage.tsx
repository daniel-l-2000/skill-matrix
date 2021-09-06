import { FormEvent, useEffect, useRef, useState } from 'react';
import { FaSave, FaSignOutAlt } from 'react-icons/fa';
import ProfilePicture from '../profile/ProfilePicture';
import { getAuth } from 'firebase/auth';
import useDatabase from '../../hooks/use-database';
import { Prompt, useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showAndPopToast } from '../../store/redux';
import UserModel from '../../models/user';

function ProfilePage() {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const params = useParams() as { userId: string };
  const location = useLocation();

  const [name, setName] = useState<string>();
  const [wasFocused, setWasFocused] = useState(false);

  const dispatch = useDispatch();

  const path = `/users/${params.userId}`;
  const readUser = useDatabase<UserModel>('read', { path });
  const updateUser = useDatabase('update', { path });

  const auth = getAuth();

  const queryParams = new URLSearchParams(location.search);
  const allowEdit = JSON.parse(queryParams.get('allow-edit') ?? 'false');

  useEffect(() => {
    const userListener = readUser();
    userListener((user) => {
      if (user) {
        setName(user.name);
      } else {
        setName(auth.currentUser?.email?.split('@')[0]);
      }
    });
  }, [readUser, auth]);

  const submitHandler = (ev: FormEvent) => {
    ev.preventDefault();

    setWasFocused(false);

    const enteredName = nameInputRef.current?.value;
    updateUser({ data: { name: enteredName } }).then(() => {
      dispatch(showAndPopToast('Changes saved', 'success'));
    });
  };

  const focusHandler = () => {
    setWasFocused(true);
  };

  const signOutHandler = () => {
    auth.signOut();
  };

  if (!name) {
    return <div></div>;
  }

  return (
    <>
      <Prompt
        when={wasFocused}
        message={() =>
          'Do you really want to leave? Your entered data will be lost!'
        }
      />
      <div className="d-flex justify-content-center">
        <div className="card p-2 w-100 max-card-width">
          <ProfilePicture
            allowEdit={allowEdit}
            userId={params.userId}
            key={params.userId}
          />
          <form
            onSubmit={submitHandler}
            onFocus={focusHandler}
            key={name}
            className={`mt-2 ${!allowEdit && 'text-center'}`}
          >
            {allowEdit ? (
              <>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={20}
                  className="form-control"
                  id="name"
                  defaultValue={name}
                  ref={nameInputRef}
                />
              </>
            ) : (
              <span>{name}</span>
            )}
            {allowEdit && (
              <button className="mt-2 btn btn-primary" type="submit">
                <FaSave className="me-1" />
                Save
              </button>
            )}
          </form>
          {allowEdit && (
            <div className="mt-2 d-flex justify-content-end">
              <button
                className="btn btn-secondary btn-sm ms-1"
                type="button"
                onClick={signOutHandler}
              >
                <FaSignOutAlt className="me-1" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
