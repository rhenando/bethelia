"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, UserPlus, Mail, ShoppingCart, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SearchBar from "./SearchBar";
import Link from "next/link";

const Header = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [showSuppliers, setShowSuppliers] = useState(false);
  const categoriesRef = useRef(null);
  const suppliersRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        setShowCategories(false);
      }
      if (
        suppliersRef.current &&
        !suppliersRef.current.contains(event.target)
      ) {
        setShowSuppliers(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className='w-full border-b border-gray-200 text-sm text-gray-800'>
      {/* Top Bar */}
      <div className='container mx-auto px-4 py-2 flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <span>Welcome to Bethelia</span>
          <Separator orientation='vertical' className='h-4' />
          <span>English</span>
          <Separator orientation='vertical' className='h-4' />
          <span>USD</span>
        </div>
        <div className='flex items-center gap-4'>
          <span className='hover:underline cursor-pointer'>Supplier Zone</span>
          <span className='hover:underline cursor-pointer'>Help Center</span>
          <span className='hover:underline cursor-pointer'>App Download</span>
        </div>
      </div>

      {/* Main Header */}
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <div className='text-2xl font-bold text-blue-600 mr-8'>
            <span className='text-blue-700'>Bethelia</span>
          </div>
          <SearchBar />
        </div>

        <div className='flex items-center gap-6'>
          <div className='flex flex-col items-center text-xs text-gray-700'>
            <User className='w-5 h-5' />
            <span>Sign In</span>
          </div>
          <div className='flex flex-col items-center text-xs text-gray-700'>
            <UserPlus className='w-5 h-5' />
            <span>Join Free</span>
          </div>
          <div className='relative flex flex-col items-center text-xs text-gray-700'>
            <Mail className='w-5 h-5' />
            <span>Messages</span>
            <span className='absolute -top-1 -right-2 bg-red-600 text-white text-[10px] rounded-full px-1'>
              3
            </span>
          </div>
          <div className='relative flex flex-col items-center text-xs text-gray-700'>
            <ShoppingCart className='w-5 h-5' />
            <span>Cart</span>
            <span className='absolute -top-1 -right-2 bg-red-600 text-white text-[10px] rounded-full px-1'>
              2
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='bg-gray-100 py-3 relative z-50'>
        <ul className='container mx-auto flex gap-8 text-sm font-medium text-gray-700'>
          {/* All Categories Dropdown */}
          <li className='relative' ref={categoriesRef}>
            <button
              onClick={() => setShowCategories((prev) => !prev)}
              className='flex items-center gap-1 hover:text-blue-600 focus:outline-none'
            >
              <span>All Categories</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  showCategories ? "rotate-180" : ""
                }`}
              />
            </button>
            {showCategories && (
              <div className='absolute top-full left-0 mt-2 flex flex-col bg-white shadow-lg rounded-md border w-56 z-50'>
                {[
                  "Electronics",
                  "Machinery",
                  "Apparel",
                  "Home & Garden",
                  "Automotive",
                  "Beauty & Personal Care",
                  "Sports & Outdoors",
                  "Health & Medical",
                ].map((cat) => (
                  <div
                    key={cat}
                    className='px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer'
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </li>

          {/* All Suppliers Dropdown */}
          <li className='relative' ref={suppliersRef}>
            <button
              onClick={() => setShowSuppliers((prev) => !prev)}
              className='flex items-center gap-1 hover:text-blue-600 focus:outline-none'
            >
              <span>All Suppliers</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  showSuppliers ? "rotate-180" : ""
                }`}
              />
            </button>
            {showSuppliers && (
              <div className='absolute top-full left-0 mt-2 flex flex-col bg-white shadow-lg rounded-md border w-56 z-50'>
                {[
                  "Verified Suppliers",
                  "Top Rated",
                  "New Suppliers",
                  "Local Suppliers",
                  "Global Manufacturers",
                  "OEM/ODM Providers",
                ].map((sup) => (
                  <div
                    key={sup}
                    className='px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer'
                  >
                    {sup}
                  </div>
                ))}
              </div>
            )}
          </li>

          <li className='hover:text-blue-600 cursor-pointer'>
            <Link href='/supplier-registration'>Become a Supplier</Link>
          </li>

          <li className='hover:text-blue-600 cursor-pointer'>
            Request for Quotation
          </li>
          <li className='hover:text-blue-600 cursor-pointer'>Get App</li>
          <li className='hover:text-blue-600 cursor-pointer'>New Arrivals</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
