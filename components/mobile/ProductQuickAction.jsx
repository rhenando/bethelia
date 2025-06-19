"use client";

import React from "react";
import { Boxes } from "lucide-react";

/**
 * Quick Action Card for Products
 * Props:
 * - count (optional): Number of products to display (badge)
 */
export default function ProductQuickAction({ count }) {
  return (
    <a
      href='/products'
      className='bg-white rounded-xl p-4 flex flex-col gap-2 items-start shadow hover:shadow-md transition w-full'
    >
      <div className='relative'>
        <Boxes className='h-5 w-5 text-[var(--primary)]' />
        {typeof count === "number" && (
          <span className='absolute -top-2 -right-2 bg-[var(--primary)] text-white text-xs px-2 py-0.5 rounded-full'>
            {count}
          </span>
        )}
      </div>
      <span className='font-bold text-gray-900'>Products</span>
      <span className='text-xs text-gray-500'>View your products</span>
    </a>
  );
}
