"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  setCartCount,
  setMessagesCount,
  setBadgeLoading,
} from "@/store/badgeSlice";

const useBadgeSync = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user?.uid) return;

    dispatch(setBadgeLoading(true));

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      const data = docSnap.data();
      dispatch(setCartCount(data?.cartCount || 0));
      dispatch(setMessagesCount(data?.unreadMessagesCount || 0));
      dispatch(setBadgeLoading(false));
    });

    return () => unsubscribe();
  }, [user?.uid, dispatch]);
};

export default useBadgeSync;
