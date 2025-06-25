// services/firebaseAuth.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBN2Kwh2N3bQQ5o0i-GhE3JUtyb65riVJw",
  authDomain: "couplesapp-9a024.firebaseapp.com",
  projectId: "couplesapp-9a024",
  storageBucket: "couplesapp-9a024.appspot.com",
  messagingSenderId: "1047163985777",
  appId: "1:1047163985777:web:f66b9d60b82da9669e20d0",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, app };
