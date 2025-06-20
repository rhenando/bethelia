"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Pencil,
  RotateCcw,
  CreditCard,
  Heart,
  ChevronRight,
  MapPin,
  BadgeDollarSign,
  QrCode,
  LifeBuoy,
  MailQuestion,
  Boxes,
  ClipboardList,
  LogOut,
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { clearUser } from "@/store/authSlice";
import QuickActionCard from "@/components/mobile/QuickActionCard";

export default function AccountPage() {
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    displayName: "",
    phone: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);

  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Document scroll position
      const scrollTop = window.scrollY;
      // Document height minus viewport height
      const docHeight = document.body.scrollHeight - window.innerHeight;
      // Scroll percent (guard against division by zero)
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      setShowHelp(scrollPercent >= 0.2); // 0.2 = 20%
    };

    window.addEventListener("scroll", handleScroll);
    // Run once to set initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!authUser?.uid) return;

    setLoading(true);
    getDoc(doc(db, "users", authUser.uid))
      .then((snap) => {
        if (snap.exists()) {
          const profile = snap.data();
          setUser({
            displayName: profile.displayName || "",
            phone: profile.phone || "",
            role: profile.role || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [authUser]);

  // Use displayName if available, else fallback to phone, else "User"
  const displayName =
    user.displayName && user.displayName.trim()
      ? user.displayName
      : user.phone
      ? user.phone
      : "User";

  // Initials helper
  const initials = displayName
    .replace(/[^A-Z0-9]/gi, " ")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Quick actions for dashboard (Products only for supplier)
  const quickActions = [];

  if (user.role === "supplier") {
    quickActions.push({
      label: "Products",
      icon: <Boxes className='h-5 w-5 text-[var(--primary)]' />,
      subtitle: "View your products",
      href: "/products",
    });
  }

  quickActions.push(
    {
      label: "Orders",
      icon: <ClipboardList className='h-5 w-5 text-[var(--primary)]' />,
      subtitle: "Manage & track",
      href: "/orders",
    },
    {
      label: "Returns",
      icon: <RotateCcw className='h-5 w-5 text-[var(--primary)]' />,
      subtitle: "0 active requests",
      href: "/returns",
    },
    {
      label: "Credits",
      icon: <CreditCard className='h-5 w-5 text-[var(--primary)]' />,
      subtitle: "₱ 0.00",
      href: "/credits",
    },
    {
      label: "Wishlist",
      icon: <Heart className='h-5 w-5 text-[var(--primary)]' />,
      subtitle: "26 saved items",
      href: "/wishlist",
    }
  );

  const accountLinks = [
    {
      label: "Addresses",
      icon: <MapPin className='h-5 w-5 text-[var(--primary)]' />,
      href: "/addresses",
    },
    {
      label: "Payment",
      icon: <BadgeDollarSign className='h-5 w-5 text-[var(--primary)]' />,
      href: "/payment",
    },
    {
      label: "Warranty Claims",
      icon: <LifeBuoy className='h-5 w-5 text-[var(--primary)]' />,
      href: "/warranty-claims",
    },
    {
      label: "QR Code",
      icon: <QrCode className='h-5 w-5 text-[var(--primary)]' />,
      href: "/qr",
    },
  ];

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase logout
    } catch (e) {
      // Optionally: show a toast/error message
    }
    dispatch(clearUser());
    window.location.href = "/login"; // Or use router.push("/login")
  };

  return (
    <div className='bg-[var(--muted)] pb-24 min-h-screen'>
      {/* Profile Card */}
      <div className='p-4'>
        <div className='bg-white rounded-xl shadow flex items-center p-4 gap-4'>
          <div className='flex items-center justify-center h-14 w-14 rounded-full bg-[var(--muted)] text-[var(--primary)] font-bold text-xl'>
            {initials}
          </div>
          <div className='flex-1'>
            <div className='font-bold text-lg text-gray-900'>
              {loading ? (
                <span className='animate-pulse bg-gray-100 w-24 h-6 rounded'></span>
              ) : (
                displayName
              )}
            </div>
            {/* Show phone if not already in displayName */}
            {user.phone && displayName !== user.phone && (
              <div className='text-gray-500 text-sm'>{user.phone}</div>
            )}
            {/* Show role for reference, optional */}
            {user.role && (
              <div className='text-gray-400 text-xs mt-1 capitalize'>
                {user.role}
              </div>
            )}
          </div>
          <button className='ml-2 flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50'>
            Edit <Pencil className='h-4 w-4' />
          </button>
        </div>
        <div className='bg-white rounded-xl mt-4 flex items-center justify-between p-4'>
          <span className='text-gray-500 font-semibold text-sm'>
            Welcome to your account!
          </span>
          <a
            href='#'
            className='flex items-center gap-2 bg-[var(--primary)] text-white font-semibold px-3 py-1 rounded-full hover:bg-[var(--primary-foreground)] transition'
          >
            Upgrade
            <ChevronRight className='h-4 w-4' />
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='px-4 mt-2 grid grid-cols-2 gap-4'>
        {quickActions.map((action) => (
          <QuickActionCard
            key={action.label}
            label={action.label}
            icon={action.icon}
            subtitle={action.subtitle}
            href={action.href}
            count={action.count}
          />
        ))}
      </div>

      {/* My Account Section */}
      <div className='mt-6 px-4'>
        <div className='font-bold text-gray-900 mb-2 text-base'>My account</div>
        <div className='bg-white rounded-xl divide-y'>
          {accountLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className='flex items-center px-4 py-4 gap-3 hover:bg-[var(--muted)] transition'
            >
              {item.icon}
              <span className='flex-1 text-gray-900'>{item.label}</span>
              <ChevronRight className='h-5 w-5 text-gray-400' />
            </a>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className='mt-6 px-4'>
        <button
          onClick={handleLogout}
          className='w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow transition'
        >
          <LogOut className='h-5 w-5' />
          Log out
        </button>
      </div>

      {showHelp && (
        <a
          href='/help'
          className='fixed bottom-12 right-5 bg-[var(--primary)] hover:bg-[var(--primary-foreground)] text-white font-bold px-5 py-3 rounded-full flex items-center gap-2 shadow z-50'
        >
          <MailQuestion className='h-5 w-5' />
          <span>Need Help?</span>
        </a>
      )}
    </div>
  );
}
