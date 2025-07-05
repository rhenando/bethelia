"use client";
import { Heart, ShoppingCart, Search } from "lucide-react";

// Category icons (replace with SVG or icon library if you want)
const categories = [
  {
    name: "Shoes",
    icon: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=64&q=80",
  },
  {
    name: "T-shirts",
    icon: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=64&q=80",
  },
  {
    name: "Bags",
    icon: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=64&q=80",
  },
  {
    name: "Jeans",
    icon: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=64&q=80",
  },
  {
    name: "Sunglasses",
    icon: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=64&q=80",
  },
];

const offers = [
  { label: "15% off" },
  { label: "15% off" },
  { label: "10% off" },
  { label: "10% off" },
  { label: "20% off" },
];

const products = [
  {
    id: "1",
    name: "Classic White T-shirt",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    name: "Leather Backpack",
    price: 120.0,
    image:
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "3",
    name: "Leather Backpack",
    price: 120.0,
    image:
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "4",
    name: "Smart Watch",
    price: 199.0,
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
  },
];

export default function HomePage() {
  // Demo counts
  const cartCount = 3;
  const wishCount = 2;

  return (
    <div className='max-w-md mx-auto px-0 bg-white min-h-screen relative'>
      {/* Header */}
      <header className='flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white'>
        <span className='font-extrabold text-lg tracking-tight text-[var(--primary,theme(colors.blue.700))] select-none'>
          Bethelia PH
        </span>
        <div className='flex items-center gap-4'>
          {/* Search */}
          <button
            aria-label='Search'
            className='hover:text-blue-700 transition'
          >
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
      {/* Promo Banner */}
      <div className='mx-4 mt-3 mb-3 rounded-xl overflow-hidden bg-blue-100 flex items-center p-4 relative'>
        <div className='flex-1'>
          <div className='text-sm text-blue-900 font-medium mb-1'>
            End of season sale
          </div>
          <div className='text-2xl font-bold text-blue-700 mb-1'>
            20% discount on all products
          </div>
          <button className='mt-2 px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition'>
            Shop Now
          </button>
        </div>
        <img
          src='https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=140&q=80'
          alt='model'
          className='h-28 w-20 object-cover rounded-xl ml-2'
        />
      </div>
      {/* Tabs / Section Indicator */}
      <div className='w-full flex justify-center py-2'>
        <div className='h-1 w-24 rounded bg-blue-400'></div>
      </div>
      {/* Categories */}
      <h2 className='font-semibold text-base px-4 mt-2 mb-1'>Categories</h2>
      <div className='flex overflow-x-auto gap-4 px-4 pb-2'>
        {categories.map((cat, i) => (
          <div
            key={cat.name}
            className='flex flex-col items-center min-w-[60px]'
          >
            <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1'>
              <img
                src={cat.icon}
                alt={cat.name}
                className='h-7 w-7 object-contain'
              />
            </div>
            <span className='text-xs font-medium text-gray-700'>
              {cat.name}
            </span>
          </div>
        ))}
      </div>
      {/* Brand Offers */}
      <h2 className='font-semibold text-base px-4 mt-4 mb-1'>Brand Offers</h2>
      <div className='flex overflow-x-auto gap-3 px-4 pb-2'>
        {offers.map((offer, i) => (
          <div
            key={i}
            className='bg-gray-100 rounded-lg w-24 h-14 flex items-center justify-center text-base font-bold text-blue-600'
          >
            {offer.label}
          </div>
        ))}
      </div>
      {/* New Arrivals */}
      <div className='flex items-center justify-between px-4 mt-4'>
        <h2 className='font-semibold text-base'>New Arrivals</h2>
        <a href='#' className='text-sm text-blue-600'>
          See All
        </a>
      </div>
      <div className='grid grid-cols-2 gap-4 px-4 mt-2'>
        {products.map((product) => (
          <div
            key={product.id}
            className='relative bg-white rounded-xl shadow p-2 flex flex-col items-center'
          >
            <button
              className='absolute top-2 right-2 bg-white/90 rounded-full p-1 z-10'
              tabIndex={-1}
              aria-label='Add to favorites'
            >
              <Heart className='w-5 h-5 text-gray-300 hover:text-red-500' />
            </button>
            <img
              src={product.image}
              alt={product.name}
              className='h-28 w-28 object-cover rounded-md mb-2'
            />
            <div className='font-semibold text-center text-base'>
              {product.name}
            </div>
            <div className='text-green-700 font-bold text-lg mt-1'>
              ₱{product.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
