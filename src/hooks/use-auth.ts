import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function useAuth() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });
  }, []);

  return { isSignedIn };
}

export default useAuth;
