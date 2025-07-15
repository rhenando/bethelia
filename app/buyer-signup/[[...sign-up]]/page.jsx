"use client";

import { SignUp } from "@clerk/nextjs";

export default function BuyerSignUpPage() {
  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-4rem)] w-full px-4'>
      <SignUp
        path='/buyer-signup'
        routing='path'
        signInUrl='/sign-in'
        afterSignUpUrl='/buyer-dashboard'
        appearance={{
          elements: {
            card: "w-full max-w-md shadow-lg rounded-xl border border-gray-200",
            headerTitle: "text-2xl font-bold text-[var(--primary)]",
            formButtonPrimary:
              "bg-[var(--primary)] hover:bg-blue-700 text-white",
          },
          variables: {
            colorPrimary: "#2563eb",
            fontFamily: "Roboto, sans-serif",
            borderRadius: "0.75rem",
          },
        }}
      />
    </div>
  );
}
