"use client";

import React from "react";
import {
  User,
  Pencil,
  Package,
  RotateCcw,
  CreditCard,
  Heart,
  ChevronRight,
  MapPin,
  BadgeDollarSign,
  QrCode,
  LifeBuoy,
  MailQuestion,
} from "lucide-react";

export default function AccountPage() {
  const user = {
    name: "Hala Fernando",
    email: "rdasho11@gmail.com",
  };

  const quickActions = [
    {
      label: "Orders",
      icon: <Package className='h-5 w-5 text-[var(--primary)]' />,
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
    },
  ];

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

  return (
    <div className='bg-[var(--muted)] pb-24 min-h-screen'>
      {/* Profile Card */}
      <div className='p-4'>
        <div className='bg-white rounded-xl shadow flex items-center p-4 gap-4'>
          <div className='flex items-center justify-center h-14 w-14 rounded-full bg-[var(--muted)] text-[var(--primary)] font-bold text-xl'>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className='flex-1'>
            <div className='font-bold text-lg text-gray-900'>{user.name}</div>
            <div className='text-gray-500 text-sm'>{user.email}</div>
          </div>
          <button className='ml-2 flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50'>
            Edit <Pencil className='h-4 w-4' />
          </button>
        </div>
        {/* (Promo/Membership) */}
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
          <a
            key={action.label}
            href={action.href}
            className='bg-white rounded-xl p-4 flex flex-col gap-2 items-start shadow hover:shadow-md transition'
          >
            {action.icon}
            <span className='font-bold text-gray-900'>{action.label}</span>
            <span className='text-xs text-gray-500'>{action.subtitle}</span>
          </a>
        ))}
      </div>

      {/* Banner - optional */}
      {/* <div className="px-4 mt-4">
        <div className="rounded-xl overflow-hidden">
          <img
            src="/your-brand-banner.png"
            alt="Banner"
            className="w-full h-28 object-cover"
          />
        </div>
      </div> */}

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

      {/* Floating Help Button */}
      <a
        href='/help'
        className='fixed bottom-20 right-5 bg-[var(--primary)] hover:bg-[var(--primary-foreground)] text-white font-bold px-5 py-3 rounded-full flex items-center gap-2 shadow z-50'
      >
        <MailQuestion className='h-5 w-5' />
        <span>Need Help?</span>
      </a>
    </div>
  );
}
