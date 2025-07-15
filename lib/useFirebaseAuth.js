// lib/useFirebaseAuth.js
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "./firebase";
import { useAuth } from "@clerk/nextjs";

export const useFirebaseAuth = () => {
  const { getToken } = useAuth();

  const signIntoFirebase = async () => {
    const firebaseAuth = getAuth(app);
    const token = await getToken({ template: "integration_firebase" });

    if (!token) throw new Error("❌ Clerk token missing");

    try {
      await signInWithCustomToken(firebaseAuth, token);
      console.log("✅ Signed in to Firebase");
    } catch (err) {
      console.error("❌ Firebase sign-in error", err);
      throw err;
    }
  };

  return { signIntoFirebase };
};
