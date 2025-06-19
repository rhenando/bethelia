"use client";

import React from "react";
import { Home, Layers, Users, ShoppingCart, User } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Layers,
  },
  {
    label: "Suppliers",
    href: "/suppliers",
    icon: Users,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingCart,
    badge: 3, // Example static cart count
  },
  {
    label: "Account",
    href: "/account",
    icon: User,
  },
];

export default function MobileBottomNav() {
  return (
    <nav className='fixed bottom-0 inset-x-0 z-40 bg-white border-t flex justify-between items-center px-2 py-1 shadow md:hidden'>
      {navItems.map(({ label, href, icon: Icon, badge }) => (
        <a
          key={label}
          href={href}
          className='flex-1 flex flex-col items-center justify-center py-1 relative text-gray-500 hover:text-primary transition'
        >
          <div className='relative'>
            <Icon className='h-7 w-7' />
            {badge && (
              <span className='absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1 rounded-full'>
                {badge}
              </span>
            )}
          </div>
        </a>
      ))}
    </nav>
  );
}
