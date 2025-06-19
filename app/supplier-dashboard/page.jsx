"use client";
import React from "react";
import { Package, ShoppingBag, MessageCircle, User } from "lucide-react";
import Link from "next/link";

const STATIC_STATS = {
  /* ... */
};
const STATIC_ORDERS = [
  /* ... */
];

export default function SupplierDashboardHome() {
  const stats = STATIC_STATS;
  const recentOrders = STATIC_ORDERS;

  return (
    <>
      {/* Quick Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        {/* ... your 4 stat cards ... */}
      </div>

      {/* Recent Orders Table */}
      <div className='bg-white rounded shadow overflow-x-auto'>
        {/* ... your table markup ... */}
      </div>
    </>
  );
}
