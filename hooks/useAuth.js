// hooks/useAuth.js
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  // CORRECTED: Importing the real selector name
  selectUser,
  selectUserType,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from "@/store/slices/authSlice";
import { initializeAuth } from "@/store/thunks/authThunks";

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  // CORRECTED: Using the real selector and renaming the variable for clarity
  const role = useSelector(selectUserType);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    // This part is correct and doesn't need changes
    const unsubscribe = dispatch(initializeAuth());
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [dispatch]);

  // The return object is now correct
  return {
    user,
    role, // This now holds the value from selectUserType
    isAuthenticated,
    loading,
    error,
    isBuyer: role === "buyer",
    isSeller: role === "seller",
  };
};

// This second hook for route guarding will now work correctly without any changes.
export const useAuthGuard = (requiredRole = null) => {
  const router = useRouter();
  const { isAuthenticated, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        if (requiredRole === "buyer") {
          router.push("/buyer-signin");
        } else if (requiredRole === "seller") {
          router.push("/seller-signin");
        } else {
          router.push("/");
        }
      } else if (requiredRole && role !== requiredRole) {
        router.push("/");
      }
    }
  }, [isAuthenticated, role, requiredRole, loading, router]);

  return { isAuthenticated, role, loading };
};
