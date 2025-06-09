"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SearchBar from "./SearchBar";
import Link from "next/link";
import { headerIcons } from "@/lib/headerIconsConfig";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "@/lib/firebase";
import { clearUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";

const Header = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [showSuppliers, setShowSuppliers] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const categoriesRef = useRef(null);
  const suppliersRef = useRef(null);
  const dropdownRef = useRef(null);
  const cartCount = useSelector((state) => state.badge.cartCount);
  const messagesCount = useSelector((state) => state.badge.messagesCount);
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    dispatch(clearUser());
    router.push("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
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
    <header className='relative z-40 w-full border-b border-gray-200 text-sm text-gray-800'>
      {/* Top Bar */}
      <div className='container mx-auto px-4 py-2 flex flex-wrap justify-between items-center gap-y-2'>
        <div className='flex items-center gap-3'>
          <span>Welcome to Bethelia</span>
          <Separator orientation='vertical' className='h-4 hidden sm:inline' />
          <span className='hidden sm:inline'>English</span>
          <Separator orientation='vertical' className='h-4 hidden sm:inline' />
          <span className='hidden sm:inline'>USD</span>
        </div>
        <div className='flex items-center gap-4 text-xs'>
          <span className='hover:underline cursor-pointer'>Supplier Zone</span>
          <span className='hover:underline cursor-pointer'>Help Center</span>
          <span className='hover:underline cursor-pointer'>App Download</span>
        </div>
      </div>

      {/* Main Header */}
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        {/* Left: Logo + SearchBar */}
        <div className='flex items-center gap-4 flex-1 min-w-0'>
          <Link
            href='/'
            className='text-2xl font-bold text-blue-600 whitespace-nowrap'
          >
            <span className='text-blue-700'>Bethelia</span>
          </Link>
          <div className='flex-1 min-w-0 hidden sm:block'>
            <SearchBar />
          </div>
        </div>

        {/* Right: Icons and Menu */}
        <div className='flex items-center gap-4'>
          {/* Desktop icons */}
          <div className='hidden sm:flex items-center gap-4 relative'>
            {headerIcons.map(({ label, icon: Icon, href }) => {
              const badge =
                label === "Messages"
                  ? messagesCount
                  : label === "Cart"
                  ? cartCount
                  : undefined;

              if (
                currentUser &&
                (label === "Sign In" || label === "Join Free")
              ) {
                return null;
              }

              return (
                <Link
                  key={label}
                  href={href || "#"}
                  className='relative flex flex-col items-center text-xs text-gray-700'
                >
                  <Icon className='w-5 h-5' />
                  <span>{label}</span>
                  {badge > 0 && (
                    <span className='absolute -top-1 -right-2 bg-red-600 text-white text-[10px] rounded-full px-1'>
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* User Dropdown */}
            {currentUser && (
              <div
                className='relative flex flex-col items-center text-xs text-gray-700 cursor-pointer'
                onClick={() => setDropdownOpen((prev) => !prev)}
                ref={dropdownRef}
              >
                <span className='w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm'>
                  {currentUser.displayName?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <span className='max-w-[60px] truncate'>
                  {currentUser.displayName?.split(" ")[0] || "Profile"}
                </span>

                {dropdownOpen && (
                  <div className='absolute top-full mt-2 right-0 bg-white border rounded-md shadow-md w-40 z-50'>
                    <Link
                      href='/dashboard'
                      className='flex items-center px-4 py-2 hover:bg-gray-100 gap-2 text-sm'
                    >
                      <LayoutDashboard className='w-4 h-4' />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='w-full text-left flex items-center px-4 py-2 hover:bg-gray-100 gap-2 text-sm'
                    >
                      <LogOut className='w-4 h-4' />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className='sm:hidden' onClick={() => setMobileMenuOpen(true)}>
            <Menu className='w-6 h-6' />
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className='bg-gray-100 py-3 relative z-10 hidden sm:block'>
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

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-50 sm:hidden'>
          <div className='bg-white w-72 h-full shadow-lg p-4 relative'>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className='absolute top-4 right-4'
            >
              <X className='w-5 h-5' />
            </button>

            {/* Auth / Icons */}
            <div className='mt-8 space-y-4'>
              {!currentUser &&
                headerIcons.map(({ label, icon: Icon, href }) => {
                  if (label !== "Sign In" && label !== "Join Free") return null;
                  return (
                    <Link
                      key={label}
                      href={href || "#"}
                      className='flex items-center gap-3 text-gray-700'
                    >
                      <Icon className='w-5 h-5' />
                      {label}
                    </Link>
                  );
                })}

              {currentUser && (
                <>
                  <div className='flex items-center gap-3 text-gray-700'>
                    <span className='w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm'>
                      {currentUser.displayName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                    {currentUser.displayName?.split(" ")[0] || "Profile"}
                  </div>
                  <Link
                    href='/dashboard'
                    className='flex items-center gap-3 text-gray-700'
                  >
                    <LayoutDashboard className='w-5 h-5' />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='flex items-center gap-3 text-gray-700 w-full text-left'
                  >
                    <LogOut className='w-5 h-5' />
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Divider and Nav Links */}
            <hr className='my-4 border-gray-300' />
            <ul className='flex flex-col gap-3 text-sm'>
              <li>
                <Link href='/supplier-registration' className='text-gray-700'>
                  Become a Supplier
                </Link>
              </li>
              <li>
                <span className='text-gray-700'>Request for Quotation</span>
              </li>
              <li>
                <span className='text-gray-700'>Get App</span>
              </li>
              <li>
                <span className='text-gray-700'>New Arrivals</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
