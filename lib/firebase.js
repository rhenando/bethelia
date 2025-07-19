// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrn0VybqXwTPeTPjzY3qambjBAO1E0HA0",
  authDomain: "bethelia.com",
  projectId: "bethelia",
  storageBucket: "bethelia.firebasestorage.app",
  messagingSenderId: "630519197144",
  appId: "1:630519197144:web:725754d8aacd7ca4fbd6ad",
  measurementId: "G-MB1RWPFVWK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const db = getFirestore(app);
const auth = getAuth(app);

// Export what you need
export { app, db, auth };
