"use client";

import React from "react";
import {
  ShoppingBag,
  Package,
  MessageCircle,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";

// Static placeholder data
const STATIC_STATS = {
  products: 12,
  orders: 5,
  messages: 3,
  profileComplete: true,
};

const STATIC_ORDERS = [
  { id: "1001", date: "2025-06-01", total: "₱1500.00", status: "Processing" },
  { id: "1002", date: "2025-06-03", total: "₱3200.00", status: "Shipped" },
];

export default function SupplierDashboard() {
  const stats = STATIC_STATS;
  const recentOrders = STATIC_ORDERS;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-800'>
            Supplier Dashboard
          </h1>
          <button className='flex items-center text-sm text-gray-600 hover:text-gray-800'>
            <LogOut className='h-5 w-5 mr-1' />
            Sign out
          </button>
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

        {/* Main Content */}
        <section className='lg:col-span-3 space-y-6'>
          {/* Quick Stats */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='p-4 bg-white rounded shadow flex items-center'>
              <Package className='h-6 w-6 text-primary mr-3' />
              <div>
                <p className='text-sm text-gray-500'>Products</p>
                <p className='text-xl font-semibold'>{stats.products}</p>
              </div>
            </div>
            <div className='p-4 bg-white rounded shadow flex items-center'>
              <ShoppingBag className='h-6 w-6 text-primary mr-3' />
              <div>
                <p className='text-sm text-gray-500'>Orders</p>
                <p className='text-xl font-semibold'>{stats.orders}</p>
              </div>
            </div>
            <div className='p-4 bg-white rounded shadow flex items-center'>
              <MessageCircle className='h-6 w-6 text-primary mr-3' />
              <div>
                <p className='text-sm text-gray-500'>Messages</p>
                <p className='text-xl font-semibold'>{stats.messages}</p>
              </div>
            </div>
            <div className='p-4 bg-white rounded shadow flex items-center'>
              <User className='h-6 w-6 text-primary mr-3' />
              <div>
                <p className='text-sm text-gray-500'>Profile Complete</p>
                <p className='text-xl font-semibold'>
                  {stats.profileComplete ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className='bg-white rounded shadow overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                    Order #
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                    Date
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                    Total
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                    Status
                  </th>
                  <th className='px-4 py-2 text-right text-sm font-medium text-gray-600'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className='px-4 py-2 text-sm'>#{order.id}</td>
                    <td className='px-4 py-2 text-sm'>{order.date}</td>
                    <td className='px-4 py-2 text-sm'>{order.total}</td>
                    <td className='px-4 py-2 text-sm'>
                      {order.status === "Shipped" ? (
                        <span className='text-green-600'>{order.status}</span>
                      ) : (
                        <span className='text-yellow-600'>{order.status}</span>
                      )}
                    </td>
                    <td className='px-4 py-2 text-sm text-right'>
                      <Link
                        href={`/supplier-dashboard/orders/${order.id}`}
                        className='underline hover:text-primary'
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
