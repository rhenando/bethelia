"use client";
import React from "react";
import { Search, Heart, ShoppingCart } from "lucide-react";

// Category and recommendation data
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

// MAIN PAGE COMPONENT
export default function MobileHomePage() {
  return (
    <div className='h-[90vh] bg-[var(--background)] flex flex-col pb-16 md:hidden'>
      <SearchBar />
      <BannerCarousel />
      <CategoryScroll />
      <Recommendations />
    </div>
  );
}

// MOBILE SEARCH BAR
function SearchBar() {
  return (
    <div className='sticky top-0 z-10 bg-[var(--card)] px-4 py-2 flex items-center gap-3 shadow-sm'>
      <div className='flex-1 flex items-center bg-[var(--muted)] rounded-lg px-2 py-1'>
        <Search className='h-5 w-5 text-[var(--muted-foreground)]' />
        <input
          type='text'
          className='bg-transparent border-none flex-1 px-2 py-1 outline-none text-sm text-[var(--foreground)]'
          placeholder='Search Bethelia…'
        />
      </div>
      <button className='ml-1 p-2'>
        <Heart className='h-6 w-6 text-[var(--primary)]' />
      </button>
      <button className='relative ml-1 p-2'>
        <ShoppingCart className='h-6 w-6 text-[var(--primary)]' />
        <span className='absolute -top-1.5 -right-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold shadow'>
          2
        </span>
      </button>
    </div>
  );
}

// BANNER CAROUSEL
function BannerCarousel() {
  return (
    <div className='px-3 pt-4 space-y-3'>
      <img
        src='https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80'
        alt='Barangay Sale'
        className='rounded-2xl w-full object-cover h-32'
        draggable={false}
      />
      <img
        src='https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80'
        alt='Local Heroes Promo'
        className='rounded-2xl w-full object-cover h-24'
        draggable={false}
      />
    </div>
  );
}

// CATEGORY HORIZONTAL SCROLL
function CategoryScroll() {
  return (
    <section className='mt-4 px-2 overflow-x-auto'>
      <div className='flex gap-4 min-w-max pb-1'>
        {categories.map((cat) => (
          <button
            key={cat.label}
            className='flex flex-col items-center min-w-[72px] group outline-none focus:ring-2 focus:ring-[var(--primary)]'
          >
            <div className='w-14 h-14 bg-[var(--card)] rounded-full flex items-center justify-center shadow-md mb-1'>
              <img
                src={cat.icon}
                alt={cat.label}
                className='w-8 h-8 object-contain'
                draggable={false}
              />
            </div>
            <span className='text-xs text-[var(--muted-foreground)] text-center whitespace-nowrap'>
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

// RECOMMENDATIONS SECTION
function Recommendations() {
  return (
    <section className='mt-6 px-3'>
      <div className='font-semibold text-base mb-3 text-[var(--foreground)]'>
        Recommended for you
      </div>
      <div className='flex gap-3 overflow-x-auto pb-2'>
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className='min-w-[150px] bg-[var(--card)] rounded-xl shadow flex flex-col items-center px-3 py-2'
          >
            <img
              src={rec.img}
              alt={rec.label}
              className='w-20 h-20 object-cover mb-2 rounded'
              draggable={false}
            />
            <span className='text-xs font-bold bg-[var(--primary)] text-[var(--primary-foreground)] px-3 py-1 rounded-full'>
              {rec.label}
            </span>
          </div>
        ))}
      </div>
      {/* PROMO BAR */}
      <div className='mt-5 bg-gradient-to-r from-[#2196f3] via-[#a1c4fd] to-[#c2e9fb] flex items-center justify-between rounded-xl px-3 py-4'>
        <div className='flex flex-col'>
          <span className='text-xs text-[var(--card-foreground)] font-bold'>
            🎉 Limited-Time Welcome Promo!
          </span>
          <span className='text-xs text-[var(--card-foreground)] mt-1'>
            Enjoy <b>FREE shipping</b> & <b>₱100 off</b> your first barangay
            order.
          </span>
        </div>
        <button className='bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold rounded px-4 py-2 ml-3 shadow active:scale-95 transition'>
          GET CODE
        </button>
      </div>
    </section>
  );
}
