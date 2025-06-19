"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Phone } from "lucide-react";

export default function MobileSignupPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("phone");
  const [otp, setOtp] = useState("");

  const countryCode = "+63";
  const nationalNumber = phone.replace(/\D/g, "").replace(/^0+/, "");
  const fullPhoneNumber = `${countryCode}${nationalNumber}`;

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
  };

  const handleSendOtp = async () => {
    if (!nationalNumber) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (!termsAccepted) {
      toast.error("You must accept the Terms & Conditions.");
      return;
    }
    if (fullPhoneNumber.length > 15) {
      toast.error("Invalid phone number length.");
      return;
    }

    setLoading(true);
    try {
      // Check for existing account
      const q = query(
        collection(db, "users"),
        where("phone", "==", fullPhoneNumber)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        toast.success("You already have an account. Redirecting to login…");
        router.push("/login");
        return;
      }

      setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmationResult;
      toast.success(`OTP sent to ${fullPhoneNumber}`);
      setStage("otp");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        phone: fullPhoneNumber,
        role: "supplier",
        agreedToTerms: true,
        createdAt: serverTimestamp(),
        displayName: user.displayName || "",
      });

      toast.success("Phone verified! Welcome aboard.");
      router.push("/supplier-dashboard");
    } catch (err) {
      console.error(err);
      toast.error("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-50 flex flex-col justify-center items-center md:hidden overflow-hidden z-50'>
      <div className='w-full'>
        <h2 className='text-2xl font-bold text-center mb-8'>
          {stage === "phone" ? "Join as a Supplier" : "Enter OTP"}
        </h2>
        {stage === "phone" ? (
          <>
            {/* Phone Input with PH prefix */}
            <div className='flex px-4 mb-4'>
              <span className='inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-white text-gray-500 text-lg'>
                🇵🇭 (+63)
              </span>
              <div className='relative flex-1'>
                <Input
                  type='tel'
                  placeholder='9XXXXXXXXX'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className='block w-full border border-gray-300 rounded-r-md rounded-l-none bg-white text-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition'
                />
                <Phone className='w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className='px-4 mb-2'>
              <label className='flex items-start space-x-2 text-sm'>
                <input
                  type='checkbox'
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className='h-4 w-4 mt-1'
                />
                <div>
                  By proceeding, you accept our{" "}
                  <a href='#' className='text-primary underline'>
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href='#' className='text-primary underline'>
                    Privacy Policy
                  </a>
                  .
                </div>
              </label>
            </div>

            {/* Send OTP Button */}
            <div className='px-4'>
              <Button
                onClick={handleSendOtp}
                disabled={loading}
                className='w-full h-12 text-lg'
              >
                {loading ? "Sending OTP…" : "Send Code & Register"}
              </Button>
            </div>

            {/* Social Login (placeholders only, add handler if needed) */}
            <div className='flex items-center gap-2 text-sm text-muted-foreground mt-6 mb-6 px-4'>
              <Separator className='flex-1' />
              <span>Or sign up with</span>
              <Separator className='flex-1' />
            </div>
            <div className='px-4 flex flex-col space-y-3'>
              <Button variant='outline' className='w-full h-12 text-lg'>
                Sign up with Google
              </Button>
              <Button variant='outline' className='w-full h-12 text-lg'>
                Sign up with Apple
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* OTP Input */}
            <div className='flex justify-center px-4 mb-6'>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup className='flex justify-center space-x-2'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className='w-12 h-12 text-lg text-center border rounded-md'
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className='px-4'>
              <Button
                onClick={handleVerifyOtp}
                disabled={loading}
                className='w-full h-12 text-lg'
              >
                {loading ? "Verifying…" : "Verify OTP & Register"}
              </Button>
            </div>
          </>
        )}
        <div id='recaptcha-container' className='hidden' />
      </div>
    </div>
  );
}
