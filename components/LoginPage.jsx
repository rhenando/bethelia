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

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Phone } from "lucide-react";
import MobileLoginPage from "@/components/mobile/MobileLoginPage";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Hooks
  const [mounted, setMounted] = useState(false);
  const [countryCode, setCountryCode] = useState("+63");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("phone"); // "phone" or "otp"
  const [otp, setOtp] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  // Helpers
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

  // Shared post-login redirect
  const redirectByRole = (role) => {
    if (role === "supplier") {
      router.push("/supplier-dashboard");
    } else {
      router.push("/buyer-dashboard");
    }
  };

  // Phone OTP Flow
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

      // Check Firestore record
      const snap = await getDoc(doc(db, "users", firebaseUser.uid));
      if (!snap.exists()) {
        toast.error("No account on file. Please register first.");
        await signOut(auth);
        router.push("/signup");
        return;
      }

      const profile = snap.data();
      // Dispatch to Redux
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

  // Social OAuth Flow
  const socialLogin = async (provider) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Check Firestore record
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

  return (
    <div className='hidden md:grid grid-cols-1 lg:grid-cols-5 h-[80vh]'>
      {/* Left: Login Form */}
      <div className='lg:col-span-2 flex items-center justify-center bg-gray-50 p-6'>
        <Card className='w-full max-w-md shadow-lg'>
          <CardContent className='space-y-6'>
            <h2 className='text-2xl font-bold text-center'>
              {stage === "phone" ? "Log in to your Account" : "Enter OTP"}
            </h2>

            {stage === "phone" ? (
              <>
                {/* Phone Input */}
                <div className='flex px-4 mb-4'>
                  {/* Prefix box - styled to match the input */}
                  <span className='inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-white text-gray-500 text-lg'>
                    🇵🇭 (+63)
                  </span>
                  {/* Input - with no left rounded corners */}
                  <div className='relative flex-1'>
                    <Input
                      type='tel'
                      placeholder='512345678'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className='block w-full border border-gray-300 rounded-r-md rounded-l-none bg-white text-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition'
                    />
                    <Phone className='w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' />
                  </div>
                </div>

                {/* Send OTP */}
                <Button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className='w-full'
                >
                  {loading ? "Sending OTP…" : "Login"}
                </Button>

                {/* Social Login */}
                <div className='flex items-center gap-2 text-sm text-muted-foreground mt-4'>
                  <Separator className='flex-1' />
                  <span>Or sign in with</span>
                  <Separator className='flex-1' />
                </div>
                <div className='flex flex-col space-y-3'>
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={handleGoogle}
                    disabled={loading}
                  >
                    Continue with Google
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={handleApple}
                    disabled={loading}
                  >
                    Continue with Apple
                  </Button>
                </div>

                <p className='text-center text-sm mt-4'>
                  Don’t have an account?{" "}
                  <a href='/signup' className='text-primary hover:underline'>
                    Register here
                  </a>
                </p>
              </>
            ) : (
              <>
                {/* OTP Input */}
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
                  className='w-full'
                >
                  {loading ? "Verifying…" : "Enter OTP"}
                </Button>
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
