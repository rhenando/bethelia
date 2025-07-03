"use client";
import React, { useEffect, useState } from "react";
import {
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
import { motion, AnimatePresence } from "framer-motion";

export default function AccountPage() {
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    displayName: "",
    phone: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [showFullHelp, setShowFullHelp] = useState(true);

  // Animate help button: shrink after 2s
  useEffect(() => {
    const timeout = setTimeout(() => setShowFullHelp(false), 2000);
    return () => clearTimeout(timeout);
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

  const displayName = user.displayName?.trim() || user.phone || "User";
  const initials = displayName
    .replace(/[^A-Z0-9]/gi, " ")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    dispatch(clearUser());
    window.location.href = "/login";
  };

  return (
    <div className='w-full max-w-full min-h-screen bg-[var(--muted)] flex flex-col relative'>
      <div className='flex flex-col h-full w-full'>
        {/* Profile Header */}
        <div className='px-4 pt-4 pb-2'>
          <div className='bg-white rounded-xl shadow flex items-center p-3 gap-4'>
            <div className='flex items-center justify-center h-12 w-12 rounded-full bg-[var(--muted)] text-[var(--primary)] font-bold text-lg'>
              {initials}
            </div>
            <div className='flex-1 min-w-0'>
              <div className='font-bold text-base text-gray-900 truncate'>
                {loading ? (
                  <span className='animate-pulse bg-gray-100 w-20 h-5 rounded block'></span>
                ) : (
                  displayName
                )}
              </div>
              {user.phone && displayName !== user.phone && (
                <div className='text-gray-500 text-xs truncate'>
                  {user.phone}
                </div>
              )}
              {user.role && (
                <div className='text-gray-400 text-xs mt-0.5 capitalize'>
                  {user.role}
                </div>
              )}
            </div>
            {/* Pencil and Logout Icons */}
            <div className='flex items-center gap-2 ml-1'>
              <button
                className='flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50'
                aria-label='Edit Profile'
                type='button'
              >
                <Pencil className='h-4 w-4' />
              </button>
              <button
                onClick={handleLogout}
                className='flex items-center p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 transition'
                aria-label='Log out'
                title='Log out'
                type='button'
              >
                <LogOut className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className='px-4 mt-3 grid grid-cols-2 gap-3'>
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
        {/* My Account Links */}
        <div className='mt-6 px-4'>
          <div className='font-bold text-gray-900 mb-2 text-sm'>My account</div>
          <div className='bg-white rounded-xl divide-y'>
            {accountLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className='flex items-center px-4 py-3 gap-3 hover:bg-[var(--muted)] transition'
              >
                {item.icon}
                <span className='flex-1 text-gray-900 text-sm'>
                  {item.label}
                </span>
                <ChevronRight className='h-5 w-5 text-gray-400' />
              </a>
            ))}
          </div>
        </div>
        {/* Spacer for visual separation */}
        <div className='flex-1' />
        {/* Help Button (right aligned) */}
        <div className='w-full flex flex-col items-end gap-3 pb-3 pr-4'>
          <AnimatedHelpButton showFull={showFullHelp} />
          {/* Logout button removed from here */}
        </div>
      </div>
    </div>
  );
}

// Animated "Need Help" Button (right aligned above logout)
function AnimatedHelpButton({ showFull }) {
  return (
    <motion.a
      href='/help'
      initial={false}
      animate={
        showFull
          ? {
              width: 160,
              borderRadius: "9999px",
              backgroundColor: "var(--primary)",
              paddingLeft: 24,
              paddingRight: 24,
            }
          : {
              width: 48,
              borderRadius: "9999px",
              backgroundColor: "var(--primary)",
              paddingLeft: 0,
              paddingRight: 0,
            }
      }
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 35,
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 700,
        boxShadow:
          "0 6px 16px 0 rgba(33, 150, 243, 0.16), 0 1.5px 8px 0 rgba(33, 150, 243, 0.12)",
        height: 48,
        overflow: "hidden",
        gap: showFull ? 8 : 0,
        marginBottom: 8,
      }}
    >
      <MailQuestion className='h-6 w-6' />
      <AnimatePresence>
        {showFull && (
          <motion.span
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{ duration: 0.2 }}
            style={{ whiteSpace: "nowrap" }}
          >
            Need Help?
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}
