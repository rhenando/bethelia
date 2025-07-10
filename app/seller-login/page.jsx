"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { setUser } from "../../store/authSlice";

export default function SellerLogin() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");

  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("seller")) {
      router.replace("/seller");
    }
  }, [isLoggedIn, user, router]);

  const btn =
    "w-full bg-[var(--primary)] text-white text-lg rounded-md py-3 font-semibold hover:brightness-90 transition border-0 focus:outline-none";

  const getOrCreateSellerUser = async (firebaseUser) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      let roles = Array.isArray(data.roles) ? data.roles : [];

      if (!roles.includes("seller")) {
        roles.push("seller");
        await setDoc(userRef, { ...data, roles }, { merge: true });
      }

      return { ...data, roles };
    } else {
      const newUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || "",
        roles: ["seller"],
        createdAt: Date.now(),
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userData = await getOrCreateSellerUser(firebaseUser);

      dispatch(setUser({ ...userData, activeRole: "seller" }));

      router.replace("/seller");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4 py-6 relative'>
      <button
        className='absolute left-4 top-4 p-2'
        onClick={() => router.back()}
        aria-label='Go back'
      >
        <ChevronLeft size={28} />
      </button>
      <div className='w-full max-w-md flex flex-col items-center'>
        <h1 className='text-3xl font-bold mb-8 text-center'>Seller Sign In</h1>

        <label className='block w-full text-gray-900 font-semibold mb-1 text-sm'>
          PHONE NUMBER
        </label>
        <div className='flex w-full mb-6'>
          <div className='flex items-center border border-gray-300 rounded-l-md bg-gray-50 px-4 py-2 text-base font-semibold'>
            PH&nbsp;&nbsp;<span className='font-normal text-gray-600'>+63</span>
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

        <div className='w-full flex items-center mb-4'>
          <div className='flex-1 h-px bg-gray-200' />
          <span className='px-3 text-gray-400 text-base font-semibold'>OR</span>
          <div className='flex-1 h-px bg-gray-200' />
        </div>

        <button className={`${btn} mb-3`} onClick={handleGoogleSignIn}>
          Sign in using Google
        </button>
        <button className={`${btn} mb-3`}>Sign in using Facebook</button>
        <button className={`${btn} mb-10`}>Sign in using Apple</button>

        <div className='text-center text-black text-base w-full'>
          Don't Have An Account?{" "}
          <button
            className='text-[var(--primary)] underline font-semibold mb-4'
            onClick={() => router.push("/signup")}
          >
            Sign Up!
          </button>
          <button
            className='w-full bg-[var(--primary)] text-white text-xl rounded-md py-3 font-bold hover:brightness-90 transition border-0 focus:outline-none'
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
