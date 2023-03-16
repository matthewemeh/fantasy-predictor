import db from './firebase-config';
import { onSnapshot, collection, Firestore } from 'firebase/firestore';

export const fetchData = (
  dbName: string,
  setState: React.Dispatch<React.SetStateAction<any[]>>,
  database?: Firestore
) => {
  onSnapshot(collection(database || db, dbName), snapshot => {
    setState(snapshot.docs.map(doc => doc.data()));
  });
};
