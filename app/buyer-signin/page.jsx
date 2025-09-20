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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const recaptchaRef = useRef(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isBuyer = useSelector(selectIsBuyer);

  useEffect(() => {
    if (isAuthenticated && isBuyer) {
      router.push("/");
    }
  }, [isAuthenticated, isBuyer, router]);

  // Test Firebase Auth configuration on component mount
  useEffect(() => {
    const auth = getAuth(app);
    console.log("🔧 Firebase Auth Configuration Check:", {
      app: !!auth.app,
      config: auth.config ? "✅ Present" : "❌ Missing",
      settings: !!auth.settings,
      authDomain: auth.app?.options?.authDomain,
      projectId: auth.app?.options?.projectId,
    });
  }, []);

  // Clean up recaptcha on component unmount or auth type change
  useEffect(() => {
    return () => {
      if (recaptchaRef.current) {
        try {
          recaptchaRef.current.clear();
          recaptchaRef.current = null;
        } catch (error) {
          console.warn("Error clearing recaptcha:", error);
        }
      }
    };
  }, [authType]);

  // Reset phone auth state when switching auth types
  useEffect(() => {
    if (authType !== "phone") {
      setOtpSent(false);
      setOtp("");
      setConfirmationResult(null);
      if (recaptchaRef.current) {
        try {
          recaptchaRef.current.clear();
          recaptchaRef.current = null;
        } catch (error) {
          console.warn("Error clearing recaptcha:", error);
        }
      }
    }
  }, [authType]);

  const handleAuthSuccess = async (user, authMethod) => {
    console.log("🎯 handleAuthSuccess called with:", {
      uid: user.uid,
      email: user.email,
      authMethod: authMethod,
    });

    try {
      sessionStorage.setItem("preferredRole", "buyer");
      console.log("✅ Set preferredRole to buyer");

      console.log("🔄 Calling getOrCreateBuyer...");
      const { data: buyerData, isNew } = await getOrCreateBuyer(user);
      console.log("✅ getOrCreateBuyer completed:", {
        isNew,
        buyerData: !!buyerData,
      });

      console.log("🔄 Dispatching buyerLoginSuccess...");
      dispatch(buyerLoginSuccess(buyerData));
      console.log("✅ Redux state updated");

      const identifier = user.email || user.phoneNumber || "User";
      const message = isNew
        ? `Welcome to our marketplace, ${identifier}! (via ${authMethod})`
        : `Welcome back, ${identifier}! (via ${authMethod})`;

      console.log("🔄 Showing success toast...");
      toast.success(message);

      console.log("🔄 Redirecting to home page...");
      router.push("/");
      console.log("✅ handleAuthSuccess completed successfully");
    } catch (error) {
      console.error("❌ Error in handleAuthSuccess:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      dispatch(loginFailure(error.message));
      toast.error(`Authentication error: ${error.message}`);
      throw error; // Re-throw to handle in calling function
    }
  };

  const handleEmailAuth = async () => {
    // Input validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password length validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const auth = getAuth(app);
    setEmailLoading(true);
    setLoading(true);
    dispatch(loginStart());

    console.log(`🔍 Starting ${mode} with email:`, email);
    console.log("🔧 Auth domain:", auth.app.options.authDomain);
    console.log("🔧 Project ID:", auth.app.options.projectId);

    try {
      let userCredential;

      if (mode === "signup") {
        console.log("📝 Attempting to create new user...");

        // Direct signup attempt
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        console.log("✅ Successfully created new user:", {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          emailVerified: userCredential.user.emailVerified,
          isNewUser: true,
        });
      } else {
        console.log("🔑 Attempting to sign in existing user...");

        // Direct signin attempt
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        console.log("✅ Successfully signed in user:", {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          emailVerified: userCredential.user.emailVerified,
          lastSignInTime: userCredential.user.metadata.lastSignInTime,
        });
      }

      // Verify we have a valid user
      if (!userCredential || !userCredential.user) {
        throw new Error("Authentication succeeded but no user data received");
      }

      console.log("🎯 Calling handleAuthSuccess...");
      await handleAuthSuccess(userCredential.user, "Email");
    } catch (error) {
      console.error("❌ Email auth error details:", {
        code: error.code,
        message: error.message,
        email: email,
        mode: mode,
        stack: error.stack?.split("\n").slice(0, 3), // First 3 lines of stack
      });

      dispatch(loginFailure(error.message));
      let errorMessage = "Authentication failed";

      // Handle specific Firebase error codes
      switch (error.code) {
        case "auth/email-already-in-use":
          console.log("📧 Email already exists, switching to signin mode");
          errorMessage = "This email is already registered.";
          setMode("signin");
          toast.info(
            "Email already exists! Switched to sign-in mode. Please enter your password."
          );
          setPassword(""); // Clear password field
          return;

        case "auth/weak-password":
          errorMessage = "Password must be at least 6 characters long.";
          break;

        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;

        case "auth/user-not-found":
          console.log("👤 User not found, switching to signup mode");
          errorMessage = "No account found with this email.";
          setMode("signup");
          toast.info(
            "No account found. Switched to sign-up mode to create a new account."
          );
          return;

        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;

        case "auth/invalid-credential":
          if (mode === "signin") {
            errorMessage = "Invalid email or password combination.";
          } else {
            errorMessage =
              "Unable to create account. Please verify your email and password.";
          }
          break;

        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;

        case "auth/too-many-requests":
          errorMessage =
            "Too many failed attempts. Please wait before trying again.";
          break;

        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;

        case "auth/operation-not-allowed":
          errorMessage =
            "Email/password authentication is not enabled for this project.";
          console.error(
            "🚨 Email/password auth not enabled in Firebase Console!"
          );
          break;

        case "auth/app-deleted":
          errorMessage = "Firebase app configuration error.";
          break;

        case "auth/api-key-not-valid":
          errorMessage = "Invalid Firebase API key.";
          break;

        default:
          errorMessage = error.message || "An unexpected error occurred.";
          console.error("🚨 Unhandled Firebase error code:", error.code);
      }

      toast.error(errorMessage);
    } finally {
      setEmailLoading(false);
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    const auth = getAuth(app);

    // Ensure auth is properly initialized
    if (!auth || !auth.app) {
      throw new Error("Firebase auth not properly initialized");
    }

    if (typeof window !== "undefined" && !recaptchaRef.current) {
      try {
        console.log("🔧 Setting up RecaptchaVerifier...");

        // Clear any existing recaptcha container content
        const container = document.getElementById("recaptcha-container");
        if (container) {
          container.innerHTML = "";
        }

        recaptchaRef.current = new RecaptchaVerifier(
          auth, // Pass auth as first parameter (newer Firebase v9+ syntax)
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              console.log("✅ Recaptcha solved:", response);
            },
            "expired-callback": () => {
              console.warn("⚠️ Recaptcha expired");
              toast.error("Recaptcha expired. Please try again.");
              if (recaptchaRef.current) {
                recaptchaRef.current.clear();
                recaptchaRef.current = null;
              }
            },
            "error-callback": (error) => {
              console.error("❌ Recaptcha error:", error);
              toast.error("Recaptcha error. Please refresh and try again.");
              if (recaptchaRef.current) {
                recaptchaRef.current.clear();
                recaptchaRef.current = null;
              }
            },
          }
        );

        console.log("✅ RecaptchaVerifier created successfully");
        return recaptchaRef.current.render();
      } catch (error) {
        console.error("❌ Recaptcha setup error:", error);
        toast.error(
          "Failed to initialize phone verification. Please refresh the page and try again."
        );
        throw error;
      }
    }
    return Promise.resolve();
  };

  const handleSendOtp = async () => {
    if (!phone) {
      toast.error("Please enter a phone number");
      return;
    }

    // Philippines phone number validation
    let formattedPhone = phone.trim();

    // Auto-format Philippines numbers
    if (formattedPhone.startsWith("09")) {
      // Convert 09XXXXXXXXX to +639XXXXXXXXX
      formattedPhone = "+63" + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith("9") && formattedPhone.length === 10) {
      // Convert 9XXXXXXXXX to +639XXXXXXXXX
      formattedPhone = "+63" + formattedPhone;
    } else if (formattedPhone.startsWith("639")) {
      // Convert 639XXXXXXXXX to +639XXXXXXXXX
      formattedPhone = "+" + formattedPhone;
    } else if (!formattedPhone.startsWith("+63")) {
      toast.error(
        "Please enter a valid Philippines phone number (e.g., 09123456789 or +639123456789)"
      );
      return;
    }

    // Validate Philippines phone number format
    const phoneRegex = /^\+639\d{9}$/;
    if (!phoneRegex.test(formattedPhone)) {
      toast.error(
        "Please enter a valid Philippines mobile number (11 digits starting with 09)"
      );
      return;
    }

    // Update the phone state with formatted number
    setPhone(formattedPhone);

    const auth = getAuth(app);
    setPhoneLoading(true);
    setLoading(true);

    console.log(
      "📱 Starting OTP process for Philippines number:",
      formattedPhone
    );

    try {
      // Clear any existing recaptcha
      if (recaptchaRef.current) {
        try {
          recaptchaRef.current.clear();
        } catch (e) {
          console.warn("Error clearing existing recaptcha:", e);
        }
        recaptchaRef.current = null;
      }

      console.log("🔧 Setting up recaptcha...");
      await setupRecaptcha();

      if (!recaptchaRef.current) {
        throw new Error("Failed to initialize recaptcha verifier");
      }

      console.log("📨 Sending OTP to Philippines number:", formattedPhone);
      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaRef.current
      );

      console.log("✅ OTP sent successfully to Philippines number");
      setConfirmationResult(result);
      setOtpSent(true);
      toast.success(
        "OTP sent successfully! Please check your phone for the verification code."
      );
    } catch (error) {
      console.error("❌ OTP send error:", error);
      let errorMessage = "Failed to send OTP";

      switch (error.code) {
        case "auth/invalid-phone-number":
          errorMessage =
            "Invalid Philippines phone number. Please use format: 09123456789 or +639123456789";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Too many OTP requests. Please try again in a few minutes.";
          break;
        case "auth/quota-exceeded":
          errorMessage = "SMS quota exceeded. Please try again later.";
          break;
        case "auth/captcha-check-failed":
          errorMessage = "Captcha verification failed. Please try again.";
          break;
        case "auth/missing-phone-number":
          errorMessage = "Phone number is required.";
          break;
        case "auth/invalid-app-credential":
          errorMessage = "Invalid app credential. Please contact support.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage);

      // Reset recaptcha on error
      if (recaptchaRef.current) {
        try {
          recaptchaRef.current.clear();
        } catch (clearError) {
          console.warn("Error clearing recaptcha:", clearError);
        }
        recaptchaRef.current = null;
      }
    } finally {
      setPhoneLoading(false);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (!confirmationResult) {
      toast.error("No OTP session found. Please request a new OTP.");
      setOtpSent(false);
      return;
    }

    setPhoneLoading(true);
    setLoading(true);
    dispatch(loginStart());

    console.log("🔑 Verifying OTP:", otp);

    try {
      const result = await confirmationResult.confirm(otp);
      console.log("✅ OTP verification successful:", {
        uid: result.user.uid,
        phoneNumber: result.user.phoneNumber,
      });

      await handleAuthSuccess(result.user, "Phone");
    } catch (error) {
      console.error("❌ OTP verification error:", error);
      dispatch(loginFailure(error.message));
      let errorMessage = "Invalid OTP";

      switch (error.code) {
        case "auth/invalid-verification-code":
          errorMessage = "Invalid OTP. Please check the code and try again.";
          break;
        case "auth/code-expired":
          errorMessage = "OTP has expired. Please request a new one.";
          setOtpSent(false);
          setConfirmationResult(null);
          setOtp("");
          break;
        case "auth/session-expired":
          errorMessage = "Verification session expired. Please start over.";
          setOtpSent(false);
          setConfirmationResult(null);
          setOtp("");
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Too many verification attempts. Please try again later.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setPhoneLoading(false);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth(app);
    setGoogleLoading(true);
    setLoading(true);
    dispatch(loginStart());

    try {
      const provider = new GoogleAuthProvider();
      // Add additional scopes if needed
      provider.addScope("email");
      provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);
      await handleAuthSuccess(result.user, "Google");
    } catch (error) {
      dispatch(loginFailure(error.message));
      let errorMessage = "Google login failed";

      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in was cancelled. Please try again.";
          break;
        case "auth/popup-blocked":
          errorMessage =
            "Popup was blocked. Please allow popups and try again.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please try again later.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
      setLoading(false);
    }
  };

  const resetPhoneAuth = () => {
    setOtpSent(false);
    setOtp("");
    setConfirmationResult(null);
    setPhone("");
  };

  return (
    <div className='flex justify-center items-center h-[100dvh]'>
      <div className='w-full max-w-md p-6 space-y-4'>
        <h2 className='text-center text-2xl font-semibold'>
          {mode === "signup" ? "Create a Buyer Account" : "Buyer Sign In"}
        </h2>

        {/* Google Auth - Separate Section */}
        <Button
          variant='outline'
          onClick={handleGoogleSignIn}
          disabled={loading}
          className='w-full'
        >
          {googleLoading ? (
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

        {/* Alternative Auth Methods */}
        <Tabs value={authType} onValueChange={setAuthType} className='w-full'>
          <TabsList className='grid grid-cols-2 w-full'>
            <TabsTrigger value='email'>Email & Password</TabsTrigger>
            <TabsTrigger value='phone'>Phone & OTP</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Email Auth */}
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
                disabled={loading}
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
                disabled={loading}
                required
              />
            </div>
            <Button
              onClick={handleEmailAuth}
              disabled={loading || !email || !password}
              className='w-full'
            >
              {emailLoading ? (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              ) : mode === "signup" ? (
                <UserPlus className='w-4 h-4 mr-2' />
              ) : (
                <LogIn className='w-4 h-4 mr-2' />
              )}
              {mode === "signup" ? "Sign Up with Email" : "Log In with Email"}
            </Button>
          </>
        )}

        {/* Phone Auth */}
        {authType === "phone" && (
          <>
            {!otpSent ? (
              <>
                <div className='space-y-2'>
                  <Label htmlFor='phone'>Philippines Mobile Number</Label>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='09123456789'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />
                  <p className='text-xs text-muted-foreground'>
                    Enter your 11-digit mobile number (e.g., 09123456789)
                    <br />
                    Supported networks: Globe, Smart, Sun, DITO
                  </p>
                </div>
                <Button
                  onClick={handleSendOtp}
                  disabled={loading || !phone}
                  className='w-full'
                >
                  {phoneLoading ? (
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
                    disabled={loading}
                    maxLength={6}
                  />
                  <p className='text-xs text-muted-foreground'>
                    OTP sent to{" "}
                    {phone.startsWith("+63")
                      ? phone.replace("+63", "0")
                      : phone}
                  </p>
                </div>
                <Button
                  onClick={handleVerifyOtp}
                  disabled={loading || !otp}
                  className='w-full'
                >
                  {phoneLoading ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <LogIn className='w-4 h-4 mr-2' />
                  )}
                  Verify & Sign In
                </Button>
                <Button
                  variant='outline'
                  onClick={resetPhoneAuth}
                  disabled={loading}
                  className='w-full'
                >
                  Use Different Number
                </Button>
              </>
            )}
            <div id='recaptcha-container' />
          </>
        )}

        {/* Mode Toggle */}
        <div className='text-center text-sm space-y-2'>
          <button
            type='button'
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className='text-primary hover:underline'
            disabled={loading}
          >
            {mode === "signup"
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>

          {/* Debug helper */}
          {process.env.NODE_ENV === "development" && (
            <div className='text-xs text-muted-foreground mt-2'>
              <p>
                💡 Testing tip: Use a fresh email like test123@example.com for
                signup
              </p>
              <p>
                📱 Philippines phone: Use format 09123456789 (will auto-convert
                to +639123456789)
              </p>
            </div>
          )}
        </div>

        {/* Seller Link */}
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
