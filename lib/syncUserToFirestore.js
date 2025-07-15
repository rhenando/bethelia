// lib/syncUserToFirestore.js
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";

const db = getFirestore(app);

export async function syncUserToFirestore(user) {
  if (!user?.id) return;

  const userRef = doc(db, "users", user.id);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      roles: ["buyer"], // ✅ this line assigns default role
      createdAt: new Date().toISOString(),
    });
  }
}
