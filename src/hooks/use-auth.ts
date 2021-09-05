import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import UserModel from '../models/user';
import useDatabase from './use-database';

function useAuth() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>();

  const readUser = useDatabase<UserModel>('read');
  const createUser = useDatabase('createWithCustomId');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
      if (!!user) {
        const path = `/users/${user.uid}`;
        readUser({ path }).then((res) => {
          if (!res) {
            createUser({
              path,
              data: { name: user.email?.split('@')[0] },
            }).then(() => {});
          }
        });
      }
    });
  }, [readUser, createUser]);

  return { isSignedIn };
}

export default useAuth;
