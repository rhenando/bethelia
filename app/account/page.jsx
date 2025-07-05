"use client";
import { useState } from "react";
import { LogOut, User, MapPin, ShoppingBag, Heart, Lock } from "lucide-react";

const user = {
  name: "Juan dela Cruz",
  email: "juan@email.com",
  avatar:
    "https://ui-avatars.com/api/?name=Juan+Cruz&background=0D8ABC&color=fff",
};

const addresses = [
  {
    id: 1,
    label: "Home",
    detail: "Unit 302, Bethelia Tower, Makati City, Philippines",
    isDefault: true,
  },
  {
    id: 2,
    label: "Office",
    detail: "16th Floor, Global One Building, BGC, Taguig",
    isDefault: false,
  },
];

const orders = [
  {
    id: "ORD-2024-0001",
    date: "2025-07-04",
    status: "Delivered",
    total: 4999.0,
    items: 2,
  },
  {
    id: "ORD-2024-0002",
    date: "2025-07-02",
    status: "Processing",
    total: 950.0,
    items: 1,
  },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className='max-w-md mx-auto min-h-screen bg-white'>
      {/* Header */}
      <div className='px-4 py-5 border-b border-gray-200 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <img
            src={user.avatar}
            alt={user.name}
            className='w-14 h-14 rounded-full border shadow'
          />
          <div>
            <div className='font-bold text-lg'>{user.name}</div>
            <div className='text-sm text-gray-500'>{user.email}</div>
          </div>
        </div>
        <button className='text-[var(--primary)] hover:underline flex items-center gap-1'>
          <LogOut className='w-5 h-5' />
          Logout
        </button>
      </div>
      {/* Tabs */}
      <nav className='flex justify-around border-b border-gray-200 bg-gray-50'>
        <button
          className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 ${
            activeTab === "profile"
              ? "text-[var(--primary)] border-b-2 border-[var(--primary)] bg-white"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <User className='w-5 h-5' />
          Profile
        </button>
        <button
          className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 ${
            activeTab === "addresses"
              ? "text-[var(--primary)] border-b-2 border-[var(--primary)] bg-white"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("addresses")}
        >
          <MapPin className='w-5 h-5' />
          Addresses
        </button>
        <button
          className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 ${
            activeTab === "orders"
              ? "text-[var(--primary)] border-b-2 border-[var(--primary)] bg-white"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          <ShoppingBag className='w-5 h-5' />
          Orders
        </button>
        <button
          className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 ${
            activeTab === "wishlist"
              ? "text-[var(--primary)] border-b-2 border-[var(--primary)] bg-white"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("wishlist")}
        >
          <Heart className='w-5 h-5' />
          Wishlist
        </button>
        <button
          className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 ${
            activeTab === "security"
              ? "text-[var(--primary)] border-b-2 border-[var(--primary)] bg-white"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("security")}
        >
          <Lock className='w-5 h-5' />
          Security
        </button>
      </nav>
      {/* Tab Content */}
      <div className='p-5'>
        {activeTab === "profile" && (
          <div>
            <h2 className='font-bold text-lg mb-2'>Profile Info</h2>
            <div className='space-y-2'>
              <div>
                <span className='font-medium'>Full Name: </span>
                {user.name}
              </div>
              <div>
                <span className='font-medium'>Email: </span>
                {user.email}
              </div>
            </div>
            <button className='mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded shadow hover:bg-blue-700 transition'>
              Edit Profile
            </button>
          </div>
        )}
        {activeTab === "addresses" && (
          <div>
            <h2 className='font-bold text-lg mb-2'>Saved Addresses</h2>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`mb-3 p-3 border rounded-lg ${
                  addr.isDefault
                    ? "border-[var(--primary)] bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className='flex justify-between items-center'>
                  <div>
                    <span className='font-medium'>{addr.label}:</span>{" "}
                    {addr.detail}
                  </div>
                  {addr.isDefault && (
                    <span className='ml-2 text-xs bg-[var(--primary)] text-white px-2 rounded-full'>
                      Default
                    </span>
                  )}
                </div>
                <div className='flex gap-2 mt-2'>
                  <button className='text-xs text-blue-700 underline'>
                    Edit
                  </button>
                  <button className='text-xs text-red-500 underline'>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button className='mt-2 px-4 py-2 border border-[var(--primary)] text-[var(--primary)] rounded hover:bg-blue-50 transition'>
              + Add New Address
            </button>
          </div>
        )}
        {activeTab === "orders" && (
          <div>
            <h2 className='font-bold text-lg mb-2'>Order History</h2>
            {orders.length === 0 && (
              <p className='text-gray-500'>No orders found.</p>
            )}
            <div className='space-y-3'>
              {orders.map((order) => (
                <div key={order.id} className='border rounded-lg p-3'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium'>{order.id}</span>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className='text-sm text-gray-600 mt-1'>
                    {order.items} item{order.items > 1 ? "s" : ""} |{" "}
                    {new Date(order.date).toLocaleDateString()} |{" "}
                    <span className='font-semibold'>
                      ₱{order.total.toFixed(2)}
                    </span>
                  </div>
                  <button className='mt-2 text-xs text-blue-700 underline'>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "wishlist" && (
          <div>
            <h2 className='font-bold text-lg mb-2'>Wishlist</h2>
            <p className='text-gray-500'>Your saved items will appear here.</p>
          </div>
        )}
        {activeTab === "security" && (
          <div>
            <h2 className='font-bold text-lg mb-2'>Security & Login</h2>
            <button className='px-4 py-2 border border-[var(--primary)] text-[var(--primary)] rounded hover:bg-blue-50 transition'>
              Change Password
            </button>
            {/* You can add 2FA, recent logins, etc. */}
          </div>
        )}
      </div>
    </div>
  );
}
