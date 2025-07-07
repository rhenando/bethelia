"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  BarChart2,
  Package,
  ShoppingBag,
  FileText,
  Users,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase"; // Ensure these are exported!
import { signOut } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "@/store/authSlice";

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
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  const uid = authUser?.uid;
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    const fetchBuyer = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBuyer(docSnap.data());
        } else {
          setBuyer(null);
        }
      } catch (err) {
        setBuyer(null);
      }
      setLoading(false);
    };
    fetchBuyer();
  }, [uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase logout
      dispatch(clearUser()); // Redux: clear user state
      router.replace("/"); // Redirect to login page
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen text-gray-400'>
        Loading...
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className='flex justify-center items-center min-h-screen text-gray-400'>
        Buyer info not found.
      </div>
    );
  }

  return (
    <div className='max-w-md mx-auto min-h-screen bg-white rounded-2xl shadow-md'>
      {/* Header */}
      <div className='px-4 py-5 border-b border-gray-200 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <img
            src={
              buyer.logo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                buyer.displayName || "Buyer"
              )}&background=2563eb&color=fff`
            }
            alt={buyer.displayName || "Buyer"}
            className='w-14 h-14 rounded-full border shadow'
          />
          <div>
            <div className='font-bold text-lg'>
              {buyer.displayName || "Unknown Buyer"}
            </div>
            <div className='text-xs text-gray-500'>
              {buyer.email || "No email"}
            </div>
            <div className='text-xs text-gray-400'>
              Role: {buyer.role || "N/A"}
            </div>
            {/* More fields if needed */}
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
            className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1
              ${
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
      <div className='p-5'>{children}</div>
    </div>
  );
}
