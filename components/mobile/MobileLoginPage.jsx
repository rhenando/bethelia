"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function MobileLoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("+63");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("phone");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const nationalNumber = phone.replace(/\D/g, "").replace(/^0+/, "");
  const fullPhoneNumber = `${countryCode}${nationalNumber}`;

  // Setup reCAPTCHA once
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
  };

  // After login, redirect by user role
  const redirectByRole = (role) => {
    if (role === "supplier") {
      router.push("/supplier-dashboard");
    } else {
      router.push("/buyer-dashboard");
    }
  };

  // Phone OTP
  const handleSendOtp = async () => {
    if (!nationalNumber) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (fullPhoneNumber.length > 15) {
      toast.error("Invalid phone number length.");
      return;
    }
    setLoading(true);
    try {
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
      const firebaseUser = result.user;
      const snap = await getDoc(doc(db, "users", firebaseUser.uid));
      if (!snap.exists()) {
        toast.error("No account on file. Please register first.");
        await signOut(auth);
        router.push("/signup");
        return;
      }
      const profile = snap.data();
      dispatch(
        setUser({
          uid: firebaseUser.uid,
          phone: profile.phone || fullPhoneNumber,
          displayName: profile.displayName || "",
          role: profile.role,
          ...profile,
        })
      );
      toast.success("Logged in successfully!");
      redirectByRole(profile.role);
    } catch (err) {
      console.error(err);
      toast.error("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Social Login
  const socialLogin = async (provider) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const snap = await getDoc(doc(db, "users", firebaseUser.uid));
      if (!snap.exists()) {
        toast.error("No account on file. Please register first.");
        await signOut(auth);
        router.push("/signup");
        return;
      }
      const profile = snap.data();
      dispatch(
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || profile.displayName || "",
          role: profile.role,
          ...profile,
        })
      );
      toast.success("Logged in successfully!");
      redirectByRole(profile.role);
    } catch (err) {
      console.error(err);
      toast.error("Social login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogle = () => socialLogin(new GoogleAuthProvider());
  const handleApple = () => socialLogin(new OAuthProvider("apple.com"));

  // UI
  return (
    <div className='fixed inset-0 bg-gray-50 flex flex-col justify-center items-center md:hidden overflow-hidden z-50'>
      <div className='w-full'>
        <h2 className='text-2xl font-bold text-center mb-8'>
          {stage === "phone" ? "Log in to your Account" : "Enter OTP"}
        </h2>
        {stage === "phone" ? (
          <>
            <div className='flex px-4 mb-4'>
              {/* Prefix box - styled to match the input */}
              <span className='inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-white text-gray-500 text-lg'>
                🇵🇭 (+63)
              </span>
              {/* Input - with no left rounded corners */}
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

            <div className='px-4'>
              <Button
                className='w-full h-12 text-lg'
                disabled={loading}
                onClick={handleSendOtp}
              >
                {loading ? "Sending OTP…" : "Login"}
              </Button>
              <div className='flex items-center gap-2 text-sm text-muted-foreground mt-6 mb-6'>
                <Separator className='flex-1' />
                <span>Or sign in with</span>
                <Separator className='flex-1' />
              </div>
              <Button
                variant='outline'
                className='w-full h-12 text-lg mb-3'
                disabled={loading}
                onClick={handleGoogle}
              >
                Continue with Google
              </Button>
              <Button
                variant='outline'
                className='w-full h-12 text-lg'
                disabled={loading}
                onClick={handleApple}
              >
                Continue with Apple
              </Button>
              <p className='text-center text-sm mt-6'>
                Don’t have an account?{" "}
                <a
                  href='/signup'
                  className='text-primary font-semibold hover:underline'
                >
                  Register here
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
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
                className='w-full h-12 text-lg'
                disabled={loading}
                onClick={handleVerifyOtp}
              >
                {loading ? "Verifying…" : "Enter OTP"}
              </Button>
            </div>
          </>
        )}
        <div id='recaptcha-container' className='hidden' />
      </div>
    </div>
  );
}
