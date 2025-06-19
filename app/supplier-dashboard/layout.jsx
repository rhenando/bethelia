"use client";

import React from "react";
import { ShoppingBag, Package, MessageCircle, User } from "lucide-react";
import Link from "next/link";

export default function SupplierDashboardLayout({ children }) {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-800'>
            Supplier Dashboard
          </h1>
          {/* you can move Sign Out here too */}
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Sidebar */}
        <aside className='lg:col-span-1 space-y-3'>
          <Link
            href='/supplier-dashboard/profile'
            className='flex items-center p-3 bg-white rounded shadow hover:bg-primary/10'
          >
            <User className='h-5 w-5 text-primary mr-2' />
            My Profile
          </Link>
          <Link
            href='/supplier-dashboard/products'
            className='flex items-center p-3 bg-white rounded shadow hover:bg-primary/10'
          >
            <Package className='h-5 w-5 text-primary mr-2' />
            Products
          </Link>
          <Link
            href='/supplier-dashboard/orders'
            className='flex items-center p-3 bg-white rounded shadow hover:bg-primary/10'
          >
            <ShoppingBag className='h-5 w-5 text-primary mr-2' />
            Orders
          </Link>
          <Link
            href='/supplier-dashboard/messages'
            className='flex items-center p-3 bg-white rounded shadow hover:bg-primary/10'
          >
            <MessageCircle className='h-5 w-5 text-primary mr-2' />
            Messages
          </Link>
        </aside>

        {/* Main content injected here */}
        <main className='lg:col-span-3 space-y-6'>{children}</main>
      </div>
    </div>
  );
}
