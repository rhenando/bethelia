"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function SellBanner({ onLogout }) {
  const user = useSelector((state) => state.auth.user);
  const activeRole = useSelector((state) => state.auth.activeRole); // ✅ THIS LINE FIXES IT
  const roles = user?.roles || [];

  const [message, setMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    // ⛔ Guest or missing role? Go to /seller-login
    if (!user || !activeRole) {
      router.push("/seller-login");
      return;
    }

    console.log("✅ user:", user);
    console.log("✅ activeRole:", activeRole);
    console.log("✅ roles:", roles);

    setLoading(true);

    if (roles.includes("seller") && activeRole === "seller") {
      setMessage(
        "You're already registered as a seller. Redirecting you now..."
      );
      setShowDialog(true);
      setTimeout(() => {
        router.push("/seller");
      }, 2000);
    } else if (roles.includes("buyer") && activeRole === "buyer") {
      setMessage("Preparing your seller account. Logging out as buyer...");
      setShowDialog(true);
      setTimeout(async () => {
        if (onLogout) await onLogout();
        router.push("/seller-login");
      }, 2000);
    } else {
      setMessage("Redirecting to seller registration...");
      setShowDialog(true);
      setTimeout(() => {
        router.push("/seller-login");
      }, 2000);
    }

    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <>
      <div className='mx-4 my-4 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white p-5 flex items-center shadow-xl'>
        <div className='flex-1 flex flex-col'>
          <div>
            <div className='text-xl font-extrabold mb-1 tracking-tight'>
              Ready to start selling?
            </div>
            <div className='mb-2 text-sm text-white/90 leading-snug'>
              Set up your shop on{" "}
              <span className='font-semibold'>Bethelia</span> and connect with
              thousands of buyers across the country.
            </div>
          </div>
          <button
            onClick={handleClick}
            className='bg-white text-blue-700 px-5 py-2 rounded-full font-medium shadow-md hover:bg-blue-50 transition mt-3 self-end'
          >
            Start Selling
          </button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className='sm:max-w-[420px] rounded-2xl shadow-2xl border border-blue-100 bg-white/90 backdrop-blur-lg'>
          <DialogHeader>
            <DialogTitle className='text-lg font-bold text-blue-900'>
              Please hold on
            </DialogTitle>
            <DialogDescription className='text-sm text-gray-700 flex items-center gap-2 mt-2'>
              {loading && (
                <Loader2 className='h-4 w-4 animate-spin text-blue-500' />
              )}
              {message}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
