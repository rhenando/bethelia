"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { setUser } from "../../store/authSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");

  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn && user) {
      router.replace("/buyer");
    }
  }, [isLoggedIn, user, router]);

  const btn =
    "w-full bg-[var(--primary)] text-white text-lg rounded-md py-3 font-semibold hover:brightness-90 transition border-0 focus:outline-none";

  // Get or create user in Firestore, always add "buyer" to roles array
  const getOrCreateUser = async (firebaseUser) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // Existing user: add "buyer" to roles if not already present
      const data = userSnap.data();
      let roles = data.roles || [];
      if (!roles.includes("buyer")) {
        roles = [...roles, "buyer"];
        await setDoc(userRef, { ...data, roles }, { merge: true });
      }
      return { ...data, roles };
    } else {
      // New user: create with "buyer" role
      const newUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || "",
        roles: ["buyer"],
        createdAt: Date.now(),
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const userData = await getOrCreateUser(firebaseUser);
      dispatch(setUser(userData));
      router.replace("/buyer");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-white px-4 relative overflow-y-auto w-full max-w-[430px] mx-auto'>
      {/* Back Button */}
      <button
        className='absolute left-3 top-3 p-2 z-10'
        onClick={() => router.back()}
        aria-label='Go back'
      >
        <ChevronLeft size={28} />
      </button>

      <div className='w-full flex flex-col items-center'>
        <h1 className='text-2xl font-bold mb-6 text-center tracking-tight'>
          Sign In To Continue
        </h1>

        {/* Phone Input */}
        <label className='block w-full text-gray-900 font-semibold mb-1 text-xs'>
          PHONE NUMBER
        </label>
        <div className='flex w-full mb-5'>
          <div className='flex items-center border border-gray-300 rounded-l-md bg-gray-50 px-3 py-2 text-base font-semibold'>
            PH <span className='font-normal text-gray-600 ml-2'>+63</span>
          </div>
          <input
            type='tel'
            placeholder='9XXXXXXXXX'
            className='flex-1 border-t border-b border-r border-gray-300 rounded-r-md px-3 py-2 outline-none text-base'
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
            inputMode='numeric'
          />
        </div>

        {/* OR Divider */}
        <div className='w-full flex items-center mb-4'>
          <div className='flex-1 h-px bg-gray-200' />
          <span className='px-2 text-gray-400 text-sm font-semibold'>OR</span>
          <div className='flex-1 h-px bg-gray-200' />
        </div>

        {/* Social Buttons */}
        <button className={`${btn} mb-3`} onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
        <button className={`${btn} mb-3`}>Sign in with Facebook</button>
        <button className={`${btn} mb-7`}>Sign in with Apple</button>

        {/* Sign Up Section */}
        <div className='text-center text-black text-sm w-full mt-auto'>
          Don't Have An Account?
          <button
            className='block w-full text-[var(--primary)] underline font-semibold mt-2'
            onClick={() => router.push("/signup")}
          >
            Sign Up!
          </button>
          <button
            className='w-full bg-[var(--primary)] text-white text-lg rounded-md py-3 font-bold hover:brightness-90 transition mt-2'
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
