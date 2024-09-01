
import {firebase} from 'firebase/compat/app';
import 'firebase/compat/firestore';
import "firebase/compat/auth";
import { getApp,getApps, initializeApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

//FIREBASE ALLE yli 8.0
const firebaseConfig = {
    apiKey: Constants.manifest.extra.FIREBASE_API_KEY,
    authDomain: Constants.manifest.extra.FIREBASE_AUTH_DOMAIN,
    projectId: Constants.manifest.extra.FIREBASE_PROJECT_ID,
    storageBucket: Constants.manifest.extra.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Constants.manifest.extra.FIREBASE_MESSAGING_SENDER_ID,
    appId: Constants.manifest.extra.FIREBASE_APP_ID
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


