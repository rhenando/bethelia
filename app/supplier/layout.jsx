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
import { db, auth } from "@/lib/firebase"; // Make sure auth is exported from your firebase config!
import { signOut } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "@/store/authSlice"; // <-- Correct action

// Nav tabs (keep as static array unless you want them role-based)
const tabs = [
  {
    label: "Dashboard",
    href: "/seller",
    icon: <BarChart2 className='w-5 h-5' />,
  },
  {
    label: "Documents",
    href: "/seller/documents",
    icon: <FileText className='w-5 h-5' />,
  },
  {
    label: "Products",
    href: "/seller/products",
    icon: <Package className='w-5 h-5' />,
  },
  {
    label: "Orders",
    href: "/seller/orders",
    icon: <ShoppingBag className='w-5 h-5' />,
  },
  {
    label: "Team",
    href: "/seller/team",
    icon: <Users className='w-5 h-5' />,
  },
  {
    label: "Support",
    href: "/seller/support",
    icon: <Mail className='w-5 h-5' />,
  },
];

export default function sellerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  // This assumes your redux auth state holds the user's uid
  const uid = authUser?.uid;

  const [seller, setseller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    const fetchseller = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setseller(docSnap.data());
        } else {
          setseller(null);
        }
      } catch (err) {
        setseller(null);
      }
      setLoading(false);
    };
    fetchseller();
  }, [uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase logout
      dispatch(clearUser()); // Redux: clear user state
      router.replace("/seller-login"); // Redirect to login page
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

  if (!seller) {
    return (
      <div className='flex justify-center items-center min-h-screen text-gray-400'>
        seller info not found.
      </div>
    );
  }

  return (
    <div className='max-w-md mx-auto min-h-screen bg-white rounded-2xl shadow-md'>
      {/* Top Banner */}
      <div className='w-full bg-[var(--primary)] text-white text-center font-extrabold tracking-wide py-3 text-xl shadow mb-2'>
        Bethelia Business Partner Account
      </div>
      {/* Header */}
      <div className='px-4 py-5 border-b border-gray-200 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <img
            src={
              seller.logo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                seller.displayName || "seller"
              )}&background=2563eb&color=fff`
            }
            alt={seller.displayName || "seller"}
            className='w-14 h-14 rounded-full border shadow'
          />
          <div>
            <div className='font-bold text-lg'>
              {seller.displayName || "Unknown Company"}
            </div>
            <div className='text-xs text-gray-500'>
              {seller.email || "No email"}
            </div>
            <div className='text-xs text-gray-400'>
              Role: {seller.role || "N/A"}
            </div>
            {/* You can display phone, createdAt, or other fields as needed */}
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
