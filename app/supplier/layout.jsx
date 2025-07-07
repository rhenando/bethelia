"use client";
import { usePathname } from "next/navigation";
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
import { db } from "@/lib/firebase";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice"; // update if you use different logout

// Nav tabs (keep as static array unless you want them role-based)
const tabs = [
  {
    label: "Dashboard",
    href: "/supplier",
    icon: <BarChart2 className='w-5 h-5' />,
  },
  {
    label: "Documents",
    href: "/supplier/documents",
    icon: <FileText className='w-5 h-5' />,
  },
  {
    label: "Products",
    href: "/supplier/products",
    icon: <Package className='w-5 h-5' />,
  },
  {
    label: "Orders",
    href: "/supplier/orders",
    icon: <ShoppingBag className='w-5 h-5' />,
  },
  {
    label: "Team",
    href: "/supplier/team",
    icon: <Users className='w-5 h-5' />,
  },
  {
    label: "Support",
    href: "/supplier/support",
    icon: <Mail className='w-5 h-5' />,
  },
];

export default function SupplierLayout({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  // This assumes your redux auth state holds the user's uid
  const uid = authUser?.uid;

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    const fetchSupplier = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSupplier(docSnap.data());
        } else {
          setSupplier(null);
        }
      } catch (err) {
        setSupplier(null);
      }
      setLoading(false);
    };
    fetchSupplier();
  }, [uid]);

  const handleLogout = () => {
    dispatch(logout());
    // You can redirect to login or homepage here if needed
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen text-gray-400'>
        Loading...
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className='flex justify-center items-center min-h-screen text-gray-400'>
        Supplier info not found.
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
              supplier.logo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                supplier.displayName || "Supplier"
              )}&background=2563eb&color=fff`
            }
            alt={supplier.displayName || "Supplier"}
            className='w-14 h-14 rounded-full border shadow'
          />
          <div>
            <div className='font-bold text-lg'>
              {supplier.displayName || "Unknown Company"}
            </div>
            <div className='text-xs text-gray-500'>
              {supplier.email || "No email"}
            </div>
            <div className='text-xs text-gray-400'>
              Role: {supplier.role || "N/A"}
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
