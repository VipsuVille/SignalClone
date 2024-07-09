import {firebase} from 'firebase/compat/app';
import 'firebase/compat/firestore';
import "firebase/compat/auth";
import { getApp,getApps, initializeApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

//FIREBASE ALLE yli 8.0
const firebaseConfig = {
  apiKey: "AIzaSyDXrFnHa7kKW8lTBGguxGXdJdTIHEeHWDk",
  authDomain: "signalclone-89f1c.firebaseapp.com",
  projectId: "signalclone-89f1c",
  storageBucket: "signalclone-89f1c.appspot.com",
  messagingSenderId: "972588067337",
  appId: "1:972588067337:web:18e4e878257b77587ba6d8"
};

let app, auth, storage;
if (!getApps().length) {
app = initializeApp(firebaseConfig)
auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
} else {
  app = getApp();
  auth = getAuth();
  storage = getStorage(app)
}

const db = getFirestore(app);
export { db, auth, getApp, getAuth, storage };
