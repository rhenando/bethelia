"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn === false) {
      router.replace("/signin");
    }
  }, [isLoggedIn, router]);

  // While checking login, you can show a loader
  if (isLoggedIn === undefined) return <div>Loading...</div>;
  if (!isLoggedIn) return null;

  return children;
};

export default ProtectedRoute;
