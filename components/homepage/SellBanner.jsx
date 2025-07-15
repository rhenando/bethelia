"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function SellBanner() {
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
          <button className='bg-white text-blue-700 px-5 py-2 rounded-full font-medium shadow-md hover:bg-blue-50 transition mt-3 self-end'>
            Start Selling
          </button>
        </div>
      </div>

      <Dialog open={false}>
        <DialogContent className='sm:max-w-[420px] rounded-2xl shadow-2xl border border-blue-100 bg-white/90 backdrop-blur-lg'>
          <DialogHeader>
            <DialogTitle className='text-lg font-bold text-blue-900'>
              Please hold on
            </DialogTitle>
            <DialogDescription className='text-sm text-gray-700 flex items-center gap-2 mt-2'>
              <Loader2 className='h-4 w-4 animate-spin text-blue-500' />
              Redirecting...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
