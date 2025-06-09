// lib/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrn0VybqXwTPeTPjzY3qambjBAO1E0HA0",
  authDomain: "bethelia.firebaseapp.com",
  projectId: "bethelia",
  storageBucket: "bethelia.firebasestorage.app",
  messagingSenderId: "630519197144",
  appId: "1:630519197144:web:13bc0f7954ea07b0fbd6ad",
  measurementId: "G-30JB0Q0368",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };
