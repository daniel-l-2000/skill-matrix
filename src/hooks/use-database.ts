import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { useCallback } from "react";

function useDatabase<T = void>(
  path: string,
  method: "create" | "read" | "update" | "delete"
) {
  const startRequest = useCallback(
    async (value?: any) => {
      const db = getDatabase();
      const pathRef = ref(db, path);

      switch (method) {
        case "create":
          return set(pathRef, value);
        case "read":
          const snapshot = await get(pathRef);
          return snapshot.val() as T | null;
        case "update":
          return update(pathRef, value);
        case "delete":
          return remove(pathRef);
      }
    },
    // because <T> parameter cannot be added to deps array
    // eslint-disable-next-line
    [path, method]
  );

  return startRequest;
}

export default useDatabase;
