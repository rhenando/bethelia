import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  loginStart,
  buyerLoginSuccess,
  sellerLoginSuccess,
  loginFailure,
  logout as logoutAction,
} from "../slices/authSlice";
import { convertTimestamps } from "@/helpers/authHelpers";

// signInUser and signUpUser functions remain the same...
export const signInUser = (email, password, role) => async (dispatch) => {
  dispatch(loginStart());
  try {
    // When a user signs in, set their preferred role for this session
    sessionStorage.setItem("preferredRole", role);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, `${role}s`, user.uid));

    if (!userDoc.exists()) {
      throw new Error(`No ${role} account found with these credentials.`);
    }

    const userData = userDoc.data();
    const serializableData = convertTimestamps(userData);

    if (role === "buyer") {
      dispatch(buyerLoginSuccess(serializableData));
    } else if (role === "seller") {
      dispatch(sellerLoginSuccess(serializableData));
    } else {
      throw new Error("Invalid user role specified.");
    }
    return { success: true };
  } catch (error) {
    dispatch(loginFailure(error.message));
    return { success: false, error: error.message };
  }
};

export const signUpUser =
  (email, password, role, additionalData = {}) =>
  async (dispatch) => {
    dispatch(loginStart());
    try {
      // When a user signs up, set their preferred role for this session
      sessionStorage.setItem("preferredRole", role);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const collectionName = `${role}s`;
      const userData = {
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
        ...additionalData,
      };
      await setDoc(doc(db, collectionName, user.uid), userData);

      if (role === "buyer") {
        dispatch(buyerLoginSuccess(userData));
      } else if (role === "seller") {
        dispatch(sellerLoginSuccess(userData));
      } else {
        throw new Error("Invalid user role specified.");
      }
      return { success: true };
    } catch (error) {
      dispatch(loginFailure(error.message));
      return { success: false, error: error.message };
    }
  };

export const signOutUser = () => async (dispatch) => {
  try {
    await signOut(auth);
    // Clear the preferred role on sign-out
    sessionStorage.removeItem("preferredRole");
    dispatch(logoutAction());
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: error.message };
  }
};

// Listen to auth state changes
export const initializeAuth = () => (dispatch) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // --- UPDATED LOGIC TO BE EQUAL AND CONTEXT-AWARE ---
        const preferredRole = sessionStorage.getItem("preferredRole");

        const sellerDoc = await getDoc(doc(db, "sellers", user.uid));
        const buyerDoc = await getDoc(doc(db, "buyers", user.uid));

        // Use the preferred role from the session to decide the active state
        if (preferredRole === "seller" && sellerDoc.exists()) {
          const serializableData = convertTimestamps(sellerDoc.data());
          dispatch(sellerLoginSuccess(serializableData));
        } else if (preferredRole === "buyer" && buyerDoc.exists()) {
          const serializableData = convertTimestamps(buyerDoc.data());
          dispatch(buyerLoginSuccess(serializableData));
        }
        // Fallback if no preferred role is set (e.g., user is "remembered")
        else if (buyerDoc.exists()) {
          const serializableData = convertTimestamps(buyerDoc.data());
          dispatch(buyerLoginSuccess(serializableData)); // Default to buyer
        } else if (sellerDoc.exists()) {
          const serializableData = convertTimestamps(sellerDoc.data());
          dispatch(sellerLoginSuccess(serializableData));
        } else {
          // User exists in Firebase Auth but has no profile in DB
          dispatch(logoutAction());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        dispatch(logoutAction());
      }
    } else {
      dispatch(logoutAction());
    }
  });
};
