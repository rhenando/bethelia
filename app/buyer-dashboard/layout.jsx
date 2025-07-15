"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, BarChart2, Package, ShoppingBag, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  useUser,
  useClerk,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";

// --- Buyer Tabs ---
const tabs = [
  {
    label: "Dashboard",
    href: "/buyer",
    icon: <BarChart2 className='w-5 h-5' />,
  },
  {
    label: "My Orders",
    href: "/buyer/orders",
    icon: <ShoppingBag className='w-5 h-5' />,
  },
  {
    label: "Saved Products",
    href: "/buyer/saved-products",
    icon: <Package className='w-5 h-5' />,
  },
  {
    label: "Support",
    href: "/buyer/support",
    icon: <Mail className='w-5 h-5' />,
  },
];

export default function BuyerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setBuyer(null);
      setLoading(false);
      return;
    }

    const fetchBuyer = async () => {
      try {
        const docRef = doc(db, "users", user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.roles?.includes("buyer")) {
            setBuyer(data);
          } else {
            console.warn("User does not have 'buyer' role.");
            setBuyer(null);
          }
        } else {
          setBuyer(null);
        }
      } catch (err) {
        console.error("Error fetching buyer:", err);
        setBuyer(null);
      }

      setLoading(false);
    };

    fetchBuyer();
  }, [isLoaded, isSignedIn, user]);

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[90vh] text-gray-400'>
        Loading...
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className='flex justify-center items-center h-[90vh] text-gray-400'>
        Buyer info not found.
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <div className='max-w-md mx-auto h-[90vh] bg-white shadow-md flex flex-col overflow-hidden'>
          {/* Header */}
          <div className='px-4 py-5 border-b border-gray-200 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  `${buyer.firstName ?? "Buyer"} ${buyer.lastName ?? ""}`
                )}&background=2563eb&color=fff`}
                alt={`${buyer.firstName} ${buyer.lastName}`}
                className='w-14 h-14 rounded-full border shadow'
              />
              <div>
                <div className='font-bold text-lg'>
                  {`${buyer.firstName ?? "Unknown"} ${buyer.lastName ?? ""}`}
                </div>
                <div className='text-xs text-gray-500'>
                  {buyer.email || "No email"}
                </div>
              </div>
            </div>
            <button
              className='text-[var(--primary)] hover:underline flex items-center gap-1'
              onClick={handleLogout}
            >
              <LogOut className='w-5 h-5' />
              Logout
            </button>
          </div>

          {/* Tabs/Nav */}
          <nav className='flex justify-around border-b border-gray-200 bg-gray-50 overflow-x-auto'>
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 ${
                  pathname === tab.href
                    ? "text-[var(--primary)] border-b-2 border-[var(--primary)] bg-white"
                    : "text-gray-600"
                }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            ))}
          </nav>

          {/* Content */}
          <div className='p-5 flex-1 overflow-y-auto'>{children}</div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
