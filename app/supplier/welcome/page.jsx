"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SupplierWelcomePage() {
  const router = useRouter();

  return (
    <main className='min-h-[80vh] flex flex-col items-center justify-center text-center px-4'>
      <h1 className='text-3xl font-bold mb-4'>🎉 Welcome to Bethelia!</h1>
      <p className='text-gray-600 max-w-xl mb-6'>
        Your supplier account has been created and approved. You can now start
        exploring your dashboard, managing your business profile, and connecting
        with customers.
      </p>

      <Button
        className='bg-blue-600 text-white px-6 py-2 text-lg'
        onClick={() => router.push("/supplier/dashboard")}
      >
        Go to Dashboard
      </Button>
    </main>
  );
}
