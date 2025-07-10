import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const isLocal = window.location.hostname === "localhost";

const firebaseConfig = {
  apiKey: "AIzaSyCrn0VybqXwTPeTPjzY3qambjBAO1E0HA0",
  authDomain: isLocal ? "bethelia.firebaseapp.com" : "www.bethelia.com",
  projectId: "bethelia",
  storageBucket: "bethelia.firebasestorage.app",
  messagingSenderId: "630519197144",
  appId: "1:630519197144:web:13bc0f7954ea07b0fbd6ad",
  measurementId: "G-30JB0Q0368",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize each Firebase service separately
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// Export individual services as needed
export { app, auth, db, functions, storage };

// // DEV ONLY: expose for debugging
// window._auth = auth;
