"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/signin"); // redirect to login
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null; // or a loader

  return children;
};

export default ProtectedRoute;
