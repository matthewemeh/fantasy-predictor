import db from './firebase-config';
import { onSnapshot, collection } from 'firebase/firestore';
export const fetchData = (dbName, setState, database) => {
    onSnapshot(collection(database || db, dbName), snapshot => {
        setState(snapshot.docs.map(doc => doc.data()));
    });
};
