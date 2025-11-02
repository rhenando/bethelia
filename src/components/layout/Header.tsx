import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  MapPin,
  Menu,
  X,
  Package,
} from "lucide-react";

import LoginDialog from "@/pages/Auth/LoginDialog";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 w-full shadow-md'>
      {/* --- Top Utility Bar --- */}
      <div className='flex justify-between items-center bg-[#2471a3] text-white text-sm md:text-base font-medium py-2 px-6'>
        <span className='flex items-center gap-2'>
          <Package size={16} className='text-white/90' />
          <span>Free shipping on orders over ₱999</span>
        </span>
        <div className='flex gap-6'>
          <Link to='/help' className='hover:underline'>
            Help Center
          </Link>
          <Link to='/track' className='hover:underline'>
            Track Order
          </Link>
        </div>
      </div>

      {/* --- Main Header --- */}
      <div className='bg-linear-to-r from-[#2980b9] to-[#3498db] text-white'>
        <div className='container mx-auto flex items-center justify-between px-4 py-3 md:py-4 gap-3'>
          {/* LEFT: Logo */}
          <div className='flex items-center gap-2'>
            <button
              className='md:hidden text-white hover:text-gray-200'
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label='Toggle menu'
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link
              to='/'
              className='flex items-center gap-2 hover:opacity-90 transition'
            >
              <span className='text-2xl font-extrabold tracking-wide bg-white text-[#2980b9] px-2 py-1 rounded-md shadow-sm'>
                Bethelia
              </span>
            </Link>
          </div>

          {/* LOCATION — beside search bar */}
          <div className='hidden md:flex items-center text-sm bg-white/10 px-3 py-1 rounded-md hover:bg-white/20 transition'>
            <MapPin size={16} className='mr-1 text-white/80' />
            <span className='opacity-80'>Deliver to</span>
            <span className='ml-1 font-semibold'>Bulacan</span>
          </div>

          {/* CENTER: Search Bar */}
          <div className='flex-1 max-w-3xl'>
            <div className='relative w-full'>
              <input
                type='text'
                placeholder='Search Bethelia for products, brands, or categories...'
                className='w-full rounded-md px-5 py-2 pr-10 text-sm text-gray-800 placeholder-gray-500 border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2980b9] focus:shadow-md transition'
              />
              <Search className='absolute right-3 top-2.5 w-5 h-5 text-gray-500 hover:text-[#2980b9] transition-colors cursor-pointer' />
            </div>
          </div>

          {/* RIGHT: User Actions */}
          <div className='flex items-center gap-5'>
            {/* ✅ Login dialog trigger (replaces /login link) */}
            <LoginDialog />

            <Link
              to='/wishlist'
              className='relative hover:text-gray-200 transition-transform hover:scale-110'
              aria-label='Wishlist'
            >
              <Heart size={20} />
            </Link>

            <Link
              to='/cart'
              id='cart-icon'
              className='relative hover:text-gray-200 transition-transform hover:scale-110'
              aria-label='Cart'
            >
              <ShoppingCart size={20} />
              <span className='absolute -top-2 -right-2 bg-red-500 text-xs text-white w-4 h-4 flex items-center justify-center rounded-full animate-bounce'>
                2
              </span>
            </Link>
          </div>
        </div>

        {/* --- Mobile Search --- */}
        <div className='md:hidden border-t border-white/20 bg-[#2e86c1] px-4 py-2'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search for products...'
              className='w-full rounded-md px-4 py-2 pr-10 text-sm text-gray-800 placeholder-gray-500 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2980b9] transition'
            />
            <Search className='absolute right-3 top-2.5 w-5 h-5 text-gray-500 hover:text-[#2980b9]' />
          </div>
        </div>
      </div>
    </header>
  );
}
