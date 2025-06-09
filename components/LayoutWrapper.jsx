"use client";
import useBadgeSync from "@/hooks/useBadgeSync";

const LayoutWrapper = ({ children }) => {
  useBadgeSync(); // ✅ Inside Provider now
  return <>{children}</>;
};

export default LayoutWrapper;
