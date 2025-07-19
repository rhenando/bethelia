"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, BarChart2, Package, ShoppingBag, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebase";

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

  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);

      // You'll need to implement logout logic with your auth solution
      // clearUserState();

      router.replace("/");
    } catch (error) {
      // Handle error silently or show user-friendly message
    }
  };

  useEffect(() => {
    // Placeholder effect - Replace with your auth logic
    setBuyer({
      firstName: "Buyer",
      lastName: "User",
      email: "buyer@example.com",
    });
    setLoading(false);
  }, []);

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

      {/* Navigation Tabs */}
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

      {/* Page Content */}
      <div className='p-5 flex-1 overflow-y-auto'>{children}</div>
    </div>
  );
}
