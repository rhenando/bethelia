"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, LockKeyhole, Apple, Chrome } from "lucide-react";
import { auth, provider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function SignInPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("m@example.com");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );

      toast.success(`Welcome back, ${user.displayName || "user"}!`);
      router.push("/");
    } catch (error) {
      console.error("Email login error:", error);
      setErrorMsg("Invalid email or password.");
      toast.error("Login failed. Check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );

      toast.success(`Logged in as ${user.displayName || "user"}`);
      router.push("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErrorMsg("Google sign-in failed. Please try again.");
      toast.error("Google login failed. Try again.");
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8'>
      <div className='w-full max-w-md bg-white rounded-xl shadow p-6 md:p-8 space-y-6'>
        {/* Logo and Title */}
        <div className='text-center flex flex-col items-center'>
          <Link href='/' className='text-2xl font-bold text-blue-600 mb-2'>
            <span className='text-blue-700'>Bethelia</span>
          </Link>
          <h2 className='text-2xl font-bold'>Welcome back</h2>
          <p className='text-sm text-muted-foreground text-center'>
            Login with your Apple or Google account
          </p>
        </div>

        {/* Social Login */}
        <div className='space-y-2'>
          <Button
            variant='outline'
            className='w-full flex gap-2 justify-center items-center'
            disabled
          >
            <Apple className='w-4 h-4' />
            Login with Apple
          </Button>
          <Button
            variant='outline'
            className='w-full flex gap-2 justify-center items-center'
            onClick={handleGoogleLogin}
          >
            <Chrome className='w-4 h-4' />
            Login with Google
          </Button>
        </div>

        {/* Divider */}
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Separator className='flex-1' />
          <span>Or continue with</span>
          <Separator className='flex-1' />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='email' className='text-sm font-medium'>
              Email
            </label>
            <div className='relative'>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='m@example.com'
                required
                className='pl-10'
              />
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <label htmlFor='password' className='text-sm font-medium'>
                Password
              </label>
              <Link
                href='/forgot-password'
                className='text-sm text-blue-600 underline'
              >
                Forgot your password?
              </Link>
            </div>
            <div className='relative'>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                required
                className='pl-10'
              />
              <LockKeyhole className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            </div>
          </div>

          {errorMsg && (
            <p className='text-sm text-red-600 font-medium'>{errorMsg}</p>
          )}

          <Button type='submit' className='w-full'>
            Login
          </Button>
        </form>

        {/* Footer */}
        <p className='text-sm text-center text-muted-foreground'>
          Don’t have an account?{" "}
          <Link href='/signup' className='text-blue-600 underline'>
            Sign up
          </Link>
        </p>

        <p className='text-xs text-center text-muted-foreground'>
          By clicking continue, you agree to our{" "}
          <a href='#' className='underline'>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href='#' className='underline'>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
