"use client";
import React from "react";
import { Search, Heart, ShoppingCart } from "lucide-react";

// Example Bethelia categories with public image URLs
const categories = [
  {
    label: "Barangay Bazaar",
    icon: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
  },
  {
    label: "Pinoy Food",
    icon: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
  },
  {
    label: "School Supplies",
    icon: "https://cdn-icons-png.flaticon.com/512/2224/2224527.png",
  },
  {
    label: "Home Decor",
    icon: "https://cdn-icons-png.flaticon.com/512/3075/3075894.png",
  },
  {
    label: "Apparel",
    icon: "https://cdn-icons-png.flaticon.com/512/892/892458.png",
  },
  {
    label: "Gadgets",
    icon: "https://cdn-icons-png.flaticon.com/512/2920/2920386.png",
  },
  {
    label: "Crafts",
    icon: "https://cdn-icons-png.flaticon.com/512/1979/1979461.png",
  },
  {
    label: "Beauty",
    icon: "https://cdn-icons-png.flaticon.com/512/2738/2738899.png",
  },
];

const recommendations = [
  {
    label: "Best Seller",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80",
  },
  {
    label: "Local Pick",
    img: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=facearea&w=400&q=80",
  },
  {
    label: "New Arrival",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&q=80",
  },
  {
    label: "Promo",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&q=80",
  },
];

export default function MobileHomePage() {
  return (
    <div className='bg-[var(--background)] min-h-screen flex flex-col pb-16'>
      <HeaderBar />
      <BannerCarousel />
      <CategoryScroll />
      <Recommendations />
      {/* BottomTabNav is omitted */}
    </div>
  );
}

// Header Bar
function HeaderBar() {
  return (
    <div className='bg-[var(--card)] px-4 py-2 flex items-center gap-3 shadow'>
      <div className='flex-1 flex items-center bg-[var(--muted)] rounded-lg px-2'>
        <Search className='h-5 w-5 text-[var(--muted-foreground)]' />
        <input
          type='text'
          className='bg-transparent border-none flex-1 px-2 py-1 outline-none text-sm text-[var(--foreground)]'
          placeholder='Search Bethelia…'
        />
      </div>
      <Heart className='h-6 w-6 text-[var(--primary)]' />
      <div className='relative'>
        <ShoppingCart className='h-6 w-6 text-[var(--primary)]' />
        <span className='absolute -top-2 -right-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold shadow'>
          2
        </span>
      </div>
    </div>
  );
}

// Banner Carousel with sample public images
function BannerCarousel() {
  return (
    <div className='px-2 pt-3 space-y-2'>
      <img
        src='https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80'
        alt='Barangay Sale'
        className='rounded-xl w-full object-cover h-28'
      />
      <img
        src='https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80'
        alt='Local Heroes Promo'
        className='rounded-xl w-full object-cover h-20'
      />
    </div>
  );
}

// Categories (Horizontal Scroll)
function CategoryScroll() {
  return (
    <div className='mt-4 px-2 overflow-x-auto'>
      <div className='flex gap-4 min-w-max'>
        {categories.map((cat, i) => (
          <div
            key={cat.label}
            className='flex flex-col items-center min-w-[68px] group'
          >
            <div className='w-14 h-14 bg-[var(--card)] rounded-full flex items-center justify-center shadow'>
              <img
                src={cat.icon}
                alt={cat.label}
                className='w-8 h-8 object-contain'
              />
            </div>
            <span className='text-xs text-[var(--muted-foreground)] mt-1 text-center whitespace-nowrap'>
              {cat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Recommendations Section
function Recommendations() {
  return (
    <div className='mt-5 px-4'>
      <div className='font-semibold text-base mb-2 text-[var(--foreground)]'>
        Recommended for you
      </div>
      <div className='flex gap-2 overflow-x-auto pb-1'>
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className='min-w-[140px] bg-[var(--card)] rounded-xl shadow flex flex-col items-center px-3 py-2 mr-2'
          >
            <img
              src={rec.img}
              alt={rec.label}
              className='w-20 h-20 object-cover mb-2 rounded'
            />
            <span className='text-xs font-bold bg-[var(--primary)] text-[var(--primary-foreground)] px-2 rounded-full'>
              {rec.label}
            </span>
          </div>
        ))}
      </div>
      {/* Promo bar - now filled with a real, bold message */}
      <div className='mt-3 bg-gradient-to-r from-[#0000ff]/70 to-[#86b7f9]/80 flex items-center justify-between rounded-lg px-3 py-3'>
        <div className='flex flex-col'>
          <span className='text-xs text-[var(--card-foreground)] font-bold'>
            🎉 Limited-Time Welcome Promo!
          </span>
          <span className='text-xs text-[var(--card-foreground)] mt-1'>
            Enjoy <b>FREE shipping</b> & <b>₱100 off</b> your first barangay
            order.
          </span>
        </div>
        <span className='bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold rounded px-3 py-1 ml-3 shadow'>
          GET CODE
        </span>
      </div>
    </div>
  );
}
