import { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getFirestore,
  onSnapshot,
  setDoc,
  Unsubscribe,
  updateDoc,
} from 'firebase/firestore';

export interface RequestConfig {
  path: string;
  data?: any;
}

export type Method =
  | 'create'
  | 'createWithCustomId'
  | 'read'
  | 'update'
  | 'delete';

export type ListenerFn<T> = (data: T | null) => void;
export type SetListenerFn<T> = (listener: ListenerFn<T>) => void;

type StartRequestFn<T, M extends Method> = M extends 'read'
  ? (configOverride?: Partial<RequestConfig>) => SetListenerFn<T>
  : M extends 'create'
  ? (configOverride?: Partial<RequestConfig>) => Promise<string>
  : (configOverride?: Partial<RequestConfig>) => Promise<void>;

function useDatabase<
  T extends { id: string } | { id: string }[],
  M extends Method = 'read'
>(method: M, config?: Partial<RequestConfig>): StartRequestFn<T, M> {
  const [unsubs, setUnsubs] = useState<(() => void)[]>([]);

  useEffect(() => {
    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }, [unsubs]);

  const startRequest = useCallback(
    (configOverride?: Partial<RequestConfig>) => {
      const path = config?.path || configOverride?.path || '';
      const data = config?.data || configOverride?.data;

      const db = getFirestore();
      const isCollection = method === 'create' || path.endsWith('/');
      const docRef = !isCollection ? doc(db, path) : null;
      const collectionRef = isCollection ? collection(db, path) : null;

      switch (method) {
        case 'create':
          return addDoc(collectionRef!, data).then((ref) => ref.id);

        case 'createWithCustomId':
          return setDoc(docRef!, data);

        case 'read':
          return ((listener: ListenerFn<T>) => {
            let unsub: Unsubscribe;

            const getData = (snapshot: DocumentSnapshot) =>
              snapshot.exists()
                ? {
                    ...snapshot.data(),
                    id: snapshot.id,
                  }
                : null;

            if (path.endsWith('/')) {
              unsub = onSnapshot(collectionRef!, (querySnapshot) => {
                const data = querySnapshot.docs.map(getData) as T | null;
                listener(data);
              });
            } else {
              unsub = onSnapshot(docRef!, (snapshot) => {
                const data = getData(snapshot) as T | null;
                listener(data);
              });
            }

            setUnsubs((prev) => [...prev, unsub]);
          }) as SetListenerFn<T>;

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
