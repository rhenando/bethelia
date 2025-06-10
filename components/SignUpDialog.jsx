// components/SignUpDialog.jsx
"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Smartphone, Phone } from "lucide-react";
import { toast } from "sonner";

export default function SignUpDialog() {
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!phone) return toast.error("Please enter your phone number.");
    if (!agreed) return toast.error("Please agree to the terms.");

    setLoading(true);
    try {
      // simulate SMS send
      await new Promise((r) => setTimeout(r, 1200));
      toast.success(`SMS code sent to ${phone}`);

      // write to Firestore
      await addDoc(collection(db, "users"), {
        phone,
        agreedToTerms: true,
        signupVia: "sms",
        createdAt: serverTimestamp(),
      });
      toast.success("Welcome aboard! Your info is saved.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='hover:text-blue-700 cursor-pointer font-medium'>
          Become a Supplier
        </button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-3xl p-0 overflow-hidden rounded-2xl shadow-lg'>
        <div className='grid grid-cols-1 sm:grid-cols-2'>
          {/* Left column: form */}
          <div className='bg-white p-6 sm:p-10 flex flex-col justify-center'>
            <DialogHeader>
              <DialogTitle className='text-xl text-center font-semibold text-primary'>
                Join as a Supplier
              </DialogTitle>
            </DialogHeader>

            <div className='mt-4 space-y-5'>
              {/* Phone input */}
              <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2'>
                <div className='flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 w-full sm:w-32'>
                  <span className='uppercase font-semibold'>PH</span>
                  <span className='text-gray-500 text-xs'>(+63)</span>
                  <svg
                    className='w-4 h-4 ml-auto text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </div>
                <div className='relative flex-1'>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='9123456789'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className='pr-10'
                  />
                  <Phone className='w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' />
                </div>
              </div>

              {/* Terms checkbox */}
              <div className='flex items-start gap-2 text-sm'>
                <input
                  type='checkbox'
                  id='terms'
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className='mt-1 accent-primary'
                />
                <label htmlFor='terms'>
                  By continuing, you agree to our{" "}
                  <a href='#' className='text-primary underline'>
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a href='#' className='text-primary underline'>
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              {/* Send & register */}
              <Button
                onClick={handleRegister}
                className='w-full'
                disabled={loading}
              >
                {loading ? (
                  <span className='animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full' />
                ) : (
                  <Smartphone className='w-4 h-4 mr-2' />
                )}
                Send Code & Register
              </Button>

              {/* Already have an account */}
              <p className='text-sm text-center mt-2'>
                Already have an account?
              </p>
              <Button
                variant='outline'
                onClick={() => {
                  /* your login handler */
                }}
                className='w-full'
              >
                Login
              </Button>

              {/* Divider + social (optional) */}
              <div className='flex items-center gap-2 text-sm text-muted-foreground mt-4'>
                <Separator className='flex-1' />
                <span>Or sign up with</span>
                <Separator className='flex-1' />
              </div>
              <div className='flex flex-col gap-4'>
                <Button variant='outline' className='w-full'>
                  {/* Google SVG */}
                  Sign up with Google
                </Button>
                <Button variant='outline' className='w-full'>
                  {/* Apple SVG */}
                  Sign up with Apple
                </Button>
              </div>
            </div>
          </div>

          {/* Right column: illustration */}
          <div className='bg-gray-100 hidden sm:flex items-center justify-center'>
            <div className='w-24 h-24 border border-dashed border-gray-300 rounded-full flex items-center justify-center'>
              <svg
                className='w-10 h-10 text-gray-400'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path d='M3 3v18h18V3H3zm15 4l-4 4-2-2-5 5h11V7z' />
              </svg>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
