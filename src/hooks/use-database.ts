import { useCallback } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

export type Method =
  | 'create'
  | 'createWithCustomId'
  | 'read'
  | 'update'
  | 'delete';

type StartRequestFn<T, M extends Method> = M extends 'read'
  ? (configOverride?: Partial<RequestConfig>) => Promise<T | null>
  : M extends 'create'
  ? (configOverride?: Partial<RequestConfig>) => Promise<string>
  : (configOverride?: Partial<RequestConfig>) => Promise<void>;

export interface RequestConfig {
  path: string;
  data?: any;
}

function useDatabase<
  T extends { id: string } | { id: string }[],
  M extends Method = 'read'
>(method: M, config?: Partial<RequestConfig>): StartRequestFn<T, M> {
  const startRequest = useCallback(
    async (configOverride?: Partial<RequestConfig>) => {
      const path = config?.path || configOverride?.path || '';
      const data = config?.data || configOverride?.data;

      const db = getFirestore();
      const isCollection = method === 'create' || path.endsWith('/');
      const docRef = !isCollection ? doc(db, path) : null;
      const collectionRef = isCollection ? collection(db, path) : null;

      switch (method) {
        case 'create':
          const ref = await addDoc(collectionRef!, data);
          return ref.id;
        case 'createWithCustomId':
          return setDoc(docRef!, data);
        case 'read':
          if (path.endsWith('/')) {
            const snapshots = await getDocs(collectionRef!);
            return snapshots.docs.map((snapshot) => ({
              ...snapshot.data(),
              id: snapshot.id,
            })) as T | null;
          } else {
            const snapshot = await getDoc(docRef!);
            const data = snapshot.data();
            return data ? ({ ...snapshot.data(), id: snapshot.id } as T) : null;
          }
        case 'update':
          return updateDoc(docRef!, data);
        case 'delete':
          return deleteDoc(docRef!);
      }
    },
    [method, config?.path, config?.data]
  );

  return startRequest as StartRequestFn<T, M>;
}

export default useDatabase;
