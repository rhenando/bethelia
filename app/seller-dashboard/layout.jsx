"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  BarChart2,
  Package,
  ShoppingBag,
  FileText,
  Users,
  Mail,
} from "lucide-react";
import { useAuth, useAuthGuard } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const tabs = [
  {
    label: "Dashboard",
    href: "/seller",
    icon: <BarChart2 className='w-5 h-5' />,
  },
  {
    label: "Documents",
    href: "/seller-dashboard/documents",
    icon: <FileText className='w-5 h-5' />,
  },
  {
    label: "Products",
    href: "/seller-dashboard/products",
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

export default function SellerLayout({ children }) {
  // This hook protects the route, ensuring only logged-in sellers can access it.
  useAuthGuard("seller");

  const pathname = usePathname();
  const { user } = useAuth();

  const storeName = user?.storeName || user?.displayName || "Business Partner";
  const email = user?.email || "No email found";

  // Use the stored logo if it exists, otherwise generate one.
  const logoUrl =
    user?.storeLogo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      storeName
    )}&background=2563eb&color=fff`;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The `useAuth` listener will automatically clear the Redux state,
      // and the `useAuthGuard` will handle redirecting the user.
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Prevent rendering anything until the auth state is confirmed.
  if (!user) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <BarChart2 className='w-8 h-8 animate-pulse text-gray-400' />
      </div>
    );
  }

  return (
    <div className='max-w-md mx-auto min-h-screen bg-white rounded-2xl shadow-md'>
      <header className='w-full bg-blue-600 text-white text-center font-extrabold tracking-wide py-3 text-xl shadow mb-2'>
        Bethelia Business Partner Account
      </header>

      <section className='px-4 py-5 border-b border-gray-200 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <img
            src={logoUrl}
            alt={storeName}
            className='w-14 h-14 rounded-full border shadow object-cover'
          />
          <div>
            <div className='font-bold text-lg'>{storeName}</div>
            <div className='text-xs text-gray-500'>{email}</div>
          </div>
        </div>
        <button
          className='text-blue-600 hover:underline flex items-center gap-1 font-medium'
          onClick={handleLogout}
        >
          <LogOut className='w-5 h-5' />
          Logout
        </button>
      </section>

      <nav className='flex justify-around border-b border-gray-200 bg-gray-50 overflow-x-auto'>
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 ${
              pathname === tab.href
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-gray-600"
            }`}
          >
            {tab.icon}
            {tab.label}
          </Link>
        ))}
      </nav>

      <main className='p-5'>{children}</main>
    </div>
  );
}
