"use client";
import React from "react";
import { Heart, ShoppingCart, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const wishCount = 0;
  const cartCount = 0;

  return (
    <header className='flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white'>
      <Link href='/' className='flex items-center gap-2'>
        <Image
          src='/bethelia.png'
          alt='Bethelia Logo'
          width={42}
          height={42}
          className='object-contain'
        />
        <span className='font-extrabold text-lg tracking-tight text-[var(--primary,theme(colors.blue.700))] select-none'>
          Bethelia
        </span>
      </Link>

      <div className='flex items-center gap-4'>
        {/* Search */}
        <button aria-label='Search' className='hover:text-blue-700 transition'>
          <Search className='w-6 h-6' />
        </button>

        {/* Wishlist */}
        <button
          aria-label='Wishlist'
          className='relative hover:text-blue-700 transition'
        >
          <Heart className='w-6 h-6' />
          {wishCount > 0 && (
            <span className='absolute -top-1 -right-1 text-[10px] bg-[var(--primary)] text-white rounded-full px-1.5 font-bold min-w-[1.2em] text-center'>
              {wishCount > 99 ? "99+" : wishCount}
            </span>
          )}
        </button>

        {/* Cart */}
        <button
          aria-label='Cart'
          className='relative hover:text-blue-700 transition'
        >
          <ShoppingCart className='w-6 h-6' />
          {cartCount > 0 && (
            <span className='absolute -top-1 -right-1 text-[10px] bg-[var(--primary)] text-white rounded-full px-1.5 font-bold min-w-[1.2em] text-center'>
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
