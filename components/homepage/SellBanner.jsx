"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

export default function SellBanner() {
  const router = useRouter();
  // We need the 'role' to distinguish between buyer and seller
  const { user, role, loading: authLoading } = useAuth();
  const [showBuyerDialog, setShowBuyerDialog] = useState(false);

  const handleStartSelling = () => {
    // Flow 3: If no user is logged in, redirect to sign-in
    if (!user) {
      router.push("/seller-signin");
      return;
    }

    // Flow 2: If the user's role is 'seller', redirect to their dashboard
    if (role === "seller") {
      router.push("/seller-dashboard");
    }
    // Flow 1: If the user's role is 'buyer', show the dialog
    else if (role === "buyer") {
      setShowBuyerDialog(true);
    }
    // Fallback: If user is logged in but has no role, send to sign-in
    else {
      router.push("/seller-signin");
    }
  };

  const handleConfirmRedirect = () => {
    // This function is called when a buyer clicks "Yes" in the dialog
    router.push("/seller-signin");
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
            onClick={handleStartSelling}
            disabled={authLoading}
            className='bg-white text-blue-700 px-5 py-2 rounded-full font-medium shadow-md hover:bg-blue-50 transition mt-3 self-end flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {authLoading ? (
              <Loader2 className='animate-spin w-4 h-4' />
            ) : (
              "Start Selling"
            )}
          </button>
        </div>
      </div>

      <Dialog open={showBuyerDialog} onOpenChange={setShowBuyerDialog}>
        <DialogContent className='w-[90%] max-w-[360px] rounded-2xl mx-auto border border-blue-100 bg-white/90 backdrop-blur-lg shadow-2xl p-6'>
          <DialogHeader>
            <DialogTitle className='text-lg font-bold text-blue-900'>
              Become a Seller
            </DialogTitle>
            <DialogDescription className='text-sm text-gray-700 mt-2'>
              To become a seller, you'll need to complete the seller
              registration.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4 flex justify-end gap-2'>
            <button
              onClick={() => setShowBuyerDialog(false)}
              className='px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700'
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRedirect}
              className='px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white'
            >
              Continue
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
