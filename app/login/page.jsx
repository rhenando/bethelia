"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../lib/firebase"; // update path if needed
import { doc, getDoc, setDoc } from "firebase/firestore";
import { setUser } from "../../store/authSlice"; // update path if needed

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");

  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === "supplier") {
        router.replace("/supplier");
      } else if (user.role === "buyer") {
        router.replace("/buyer");
      } else {
        router.replace("/signup");
      }
    }
  }, [isLoggedIn, user, router]);

  // Uniform button classes
  const btn =
    "w-full bg-[var(--primary)] text-white text-lg rounded-md py-3 font-semibold hover:brightness-90 transition border-0 focus:outline-none";

  // Get or create user in Firestore, return the user object with role
  const getOrCreateUser = async (firebaseUser) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      // Default new users to "buyer"
      const newUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || "",
        role: "buyer",
        createdAt: Date.now(),
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
  };

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Get or create user in Firestore, get their role
      const userData = await getOrCreateUser(firebaseUser);

      // Store in Redux using setUser
      dispatch(setUser(userData));

      // Redirect based on role
      if (userData.role === "supplier") {
        router.replace("/supplier");
      } else if (userData.role === "buyer") {
        router.replace("/buyer");
      } else {
        router.replace("/signup");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4 py-6 relative'>
      {/* Back Button */}
      <button
        className='absolute left-4 top-4 p-2'
        onClick={() => router.back()}
        aria-label='Go back'
      >
        <ChevronLeft size={28} />
      </button>
      <div className='w-full max-w-md flex flex-col items-center'>
        <h1 className='text-3xl font-bold mb-8 text-center'>
          Sign In To Continue
        </h1>

        {/* Phone Input */}
        <label className='block w-full text-gray-900 font-semibold mb-1 text-sm'>
          PHONE NUMBER
        </label>
        <div className='flex w-full mb-6'>
          <div className='flex items-center border border-gray-300 rounded-l-md bg-gray-50 px-4 py-2 text-base font-semibold'>
            PH&nbsp;&nbsp;{" "}
            <span className='font-normal text-gray-600'>+63</span>
          </div>
          <input
            type='tel'
            placeholder='9XXXXXXXXX'
            className='flex-1 border-t border-b border-r border-gray-300 rounded-r-md px-4 py-2 outline-none text-lg'
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
            inputMode='numeric'
          />
        </div>

        {/* OR Divider */}
        <div className='w-full flex items-center mb-4'>
          <div className='flex-1 h-px bg-gray-200' />
          <span className='px-3 text-gray-400 text-base font-semibold'>OR</span>
          <div className='flex-1 h-px bg-gray-200' />
        </div>

        {/* Social Buttons */}
        <button className={`${btn} mb-3`} onClick={handleGoogleSignIn}>
          Sign in using Google
        </button>
        <button className={`${btn} mb-3`}>Sign in using Facebook</button>
        <button className={`${btn} mb-10`}>Sign in using Apple</button>

        {/* Sign Up Section */}
        <div className='text-center text-black text-base w-full'>
          Don't Have An Account?{" "}
          <button
            className='text-[var(--primary)] underline font-semibold mb-4'
            onClick={() => router.push("/signup")}
          >
            Sign Up!
          </button>
          <button
            className='w-full bg-[var(--primary)] text-white text-xl rounded-md py-3  font-bold hover:brightness-90 transition border-0 focus:outline-none'
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
