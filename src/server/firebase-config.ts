import { initializeApp, setLogLevel } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

setLogLevel('silent');

const firebaseConfig = {
  apiKey: 'AIzaSyC46PLTq3Wl-MwOX3Oj3vKXX89mip007FY',
  authDomain: 'fantasypredictor-23888.firebaseapp.com',
  databaseURL: 'https://fantasypredictor-23888.firebaseio.com',
  projectId: 'fantasypredictor-23888',
  storageBucket: 'fantasypredictor-23888.appspot.com',
  messagingSenderId: '856815371806',
  appId: '1:856815371806:web:06a04413e389747628900f',
};

const app = initializeApp(firebaseConfig);
export default getFirestore();
