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
    <div className='md:hidden min-h-screen w-full flex flex-col justify-center items-center bg-gray-50'>
      <div className='w-full max-w-none'>
        <h2 className='text-2xl font-bold text-center mb-8'>
          {stage === "phone" ? "Log in to your Account" : "Enter OTP"}
        </h2>
        {stage === "phone" ? (
          <>
            <div className='flex gap-2 px-4 mb-4'>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className='border rounded px-3 py-3 bg-white w-28'
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
                  className='pl-4 pr-10 py-3 text-lg'
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
                {loading ? "Sending OTP…" : "Send OTP & Login"}
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
                {loading ? "Verifying…" : "Verify OTP & Login"}
              </Button>
            </div>
          </>
        )}
        <div id='recaptcha-container' className='hidden' />
      </div>
    </div>
  );
}
