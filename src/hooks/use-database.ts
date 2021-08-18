import { get, getDatabase, ref, remove, set, update } from "firebase/database";

function useDatabase<T = void>(
  path: string,
  method: "create" | "read" | "update" | "delete"
) {
  const startRequest = async (value?: any) => {
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
  };

  return startRequest;
}

export default useDatabase;
