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
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Phone } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  // 1) All hooks first
  const [mounted, setMounted] = useState(false);
  const [countryCode, setCountryCode] = useState("+63");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("phone");
  const [otp, setOtp] = useState("");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

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
    // Basic validation
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
      // --- NEW: check for existing account ---
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

      // Send OTP
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

      // Create user record keyed by UID
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
    <div className='grid grid-cols-1 lg:grid-cols-5 h-[80vh]'>
      {/* Left: OTP Form */}
      <div className='lg:col-span-2 flex items-center justify-center bg-gray-50 p-6'>
        <Card className='w-full max-w-md shadow-lg'>
          <CardContent className='space-y-6'>
            <h2 className='text-2xl font-bold text-center'>
              {stage === "phone" ? "Join as a Supplier" : "Enter OTP"}
            </h2>

            {stage === "phone" ? (
              <>
                <div className='flex gap-2'>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className='border rounded px-3 py-2 bg-white'
                  >
                    <option value='+63'>🇵🇭 (+63)</option>
                    <option value='+966'>🇸🇦 (+966)</option>
                    <option value='+971'>🇦🇪 (+971)</option>
                  </select>
                  <div className='relative flex-1'>
                    <Input
                      type='tel'
                      placeholder='512345678'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className='pl-4 pr-10 border rounded-md'
                    />
                    <Phone className='w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' />
                  </div>
                </div>

                <label className='flex items-start space-x-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className='h-4 w-4 mt-1'
                  />
                  <div>
                    By proceeding, you accept our{" "}
                    <a href='#' className='text-blue-600 underline'>
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href='#' className='text-blue-600 underline'>
                      Privacy Policy
                    </a>
                    .
                  </div>
                </label>

                <Button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className='w-full bg-blue-600 text-white'
                >
                  {loading ? "Sending OTP…" : "Send Code & Register"}
                </Button>
              </>
            ) : (
              <>
                <div className='flex justify-center'>
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup className='flex justify-center space-x-2'>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className='w-10 h-10 text-center border rounded-md'
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className='w-full bg-blue-600 text-white'
                >
                  {loading ? "Verifying…" : "Verify OTP & Register"}
                </Button>
              </>
            )}

            {stage === "phone" && (
              <>
                <div className='flex items-center gap-2 text-sm text-muted-foreground mt-4'>
                  <Separator className='flex-1' />
                  <span>Or sign up with</span>
                  <Separator className='flex-1' />
                </div>
                <div className='flex flex-col space-y-3'>
                  <Button variant='outline' className='w-full'>
                    Sign up with Google
                  </Button>
                  <Button variant='outline' className='w-full'>
                    Sign up with Apple
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          <div id='recaptcha-container' className='hidden' />
        </Card>
      </div>

      {/* Right: Branding */}
      <div className='hidden lg:col-span-3 lg:flex bg-gradient-to-br from-blue-400 to-[#0000ff] text-white items-center justify-center p-10'>
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
  );
}
