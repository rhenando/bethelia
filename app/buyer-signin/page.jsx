"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, LogIn, Phone, UserPlus } from "lucide-react";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "@/lib/firebase";
import {
  loginStart,
  buyerLoginSuccess,
  loginFailure,
} from "@/store/slices/authSlice";
import { selectIsAuthenticated, selectIsBuyer } from "@/store/slices/authSlice";
import { getOrCreateBuyer } from "@/helpers/authHelpers";

export default function BuyerAuthPage() {
  const [authType, setAuthType] = useState("email");
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const recaptchaRef = useRef(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isBuyer = useSelector(selectIsBuyer);

  useEffect(() => {
    if (isAuthenticated && isBuyer) {
      router.push("/buyer-dashboard");
    }
  }, [isAuthenticated, isBuyer, router]);

  const handleAuthSuccess = async (user) => {
    try {
      // Set the preferred role for this session
      sessionStorage.setItem("preferredRole", "buyer");

      const { data: buyerData, isNew } = await getOrCreateBuyer(user);
      dispatch(buyerLoginSuccess(buyerData));

      toast.success(
        isNew
          ? `Welcome to our marketplace, ${user.email || user.phoneNumber}!`
          : `Welcome back, ${user.email || user.phoneNumber}!`
      );

      router.push("/buyer-dashboard");
    } catch (error) {
      dispatch(loginFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleEmailAuth = async () => {
    const auth = getAuth(app);
    setLoading(true);
    dispatch(loginStart());
    try {
      const userCredential =
        mode === "signup"
          ? await createUserWithEmailAndPassword(auth, email, password)
          : await signInWithEmailAndPassword(auth, email, password);

      await handleAuthSuccess(userCredential.user);
    } catch (error) {
      dispatch(loginFailure(error.message));
      let errorMessage = "Authentication failed";
      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please sign in instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage =
          "No account found with this email. Please sign up first.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    const auth = getAuth(app);
    if (typeof window !== "undefined" && !recaptchaRef.current) {
      try {
        recaptchaRef.current = new RecaptchaVerifier(
          "recaptcha-container",
          { size: "invisible", callback: () => {} },
          auth
        );
        recaptchaRef.current.render();
      } catch (error) {
        toast.error("Recaptcha failed to initialize.");
      }
    }
  };

  const handleSendOtp = async () => {
    const auth = getAuth(app);
    setLoading(true);
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaRef.current
      );
      setConfirmationResult(result);
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    dispatch(loginStart());
    try {
      const result = await confirmationResult.confirm(otp);
      await handleAuthSuccess(result.user);
    } catch (error) {
      dispatch(loginFailure(error.message));
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth(app);
    setLoading(true);
    dispatch(loginStart());
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleAuthSuccess(result.user);
    } catch (error) {
      dispatch(loginFailure(error.message));
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center h-[100dvh]'>
      <div className='w-full max-w-md p-6 space-y-4'>
        <h2 className='text-center text-2xl font-semibold'>
          {mode === "signup" ? "Create a Buyer Account" : "Buyer Sign In"}
        </h2>
        <Button
          variant='outline'
          onClick={handleGoogleSignIn}
          disabled={loading}
          className='w-full'
        >
          {loading ? (
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
          ) : (
            <img
              src='https://www.svgrepo.com/show/475656/google-color.svg'
              alt='Google'
              className='w-5 h-5 mr-2'
            />
          )}
          Continue with Google
        </Button>
        <div className='flex items-center'>
          <div className='flex-grow h-px bg-gray-200' />
          <span className='px-3 text-muted-foreground text-sm'>OR</span>
          <div className='flex-grow h-px bg-gray-200' />
        </div>
        <Tabs value={authType} onValueChange={setAuthType} className='w-full'>
          <TabsList className='grid grid-cols-2 w-full'>
            <TabsTrigger value='email'>Email & Password</TabsTrigger>
            <TabsTrigger value='phone'>Phone & OTP</TabsTrigger>
          </TabsList>
        </Tabs>
        {authType === "email" && (
          <>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='********'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              onClick={handleEmailAuth}
              disabled={loading || !email || !password}
              className='w-full'
            >
              {loading ? (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              ) : mode === "signup" ? (
                <UserPlus className='w-4 h-4 mr-2' />
              ) : (
                <LogIn className='w-4 h-4 mr-2' />
              )}
              {mode === "signup" ? "Sign Up" : "Log In"}
            </Button>
          </>
        )}
        {authType === "phone" && (
          <>
            {!otpSent ? (
              <>
                <div className='space-y-2'>
                  <Label htmlFor='phone'>Phone Number</Label>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='+966501234567'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSendOtp}
                  disabled={loading || !phone}
                  className='w-full'
                >
                  {loading ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <Phone className='w-4 h-4 mr-2' />
                  )}
                  Send OTP
                </Button>
              </>
            ) : (
              <>
                <div className='space-y-2'>
                  <Label htmlFor='otp'>Enter OTP</Label>
                  <Input
                    id='otp'
                    type='text'
                    placeholder='123456'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleVerifyOtp}
                  disabled={loading || !otp}
                  className='w-full'
                >
                  {loading ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <LogIn className='w-4 h-4 mr-2' />
                  )}
                  Verify & Sign In
                </Button>
              </>
            )}
            <div id='recaptcha-container' />
          </>
        )}
        <div className='text-center text-sm'>
          <button
            type='button'
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className='text-primary hover:underline'
          >
            {mode === "signup"
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
        <p className='text-center text-sm text-muted-foreground'>
          Are you a seller?{" "}
          <a href='/seller-signin' className='text-primary hover:underline'>
            Seller sign in
          </a>
        </p>
      </div>
    </div>
  );
}
