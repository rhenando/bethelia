"use client";
import React from "react";
import { Heart, ShoppingCart, Search } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

// --- Promo banners for the carousel ---
const promoBanners = [
  {
    title: "End of season sale",
    subtitle: "20% discount on all products",
    button: "Shop Now",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=140&q=80",
    bg: "bg-blue-100",
    color: "text-blue-700",
  },
  {
    title: "Back to School",
    subtitle: "Save 30% on backpacks",
    button: "Browse Bags",
    image:
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=140&q=80",
    bg: "bg-pink-100",
    color: "text-pink-700",
  },
  {
    title: "Summer Essentials",
    subtitle: "Up to 25% off sunglasses",
    button: "Shop Shades",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=140&q=80",
    bg: "bg-yellow-100",
    color: "text-yellow-700",
  },
];

// --- Categories ---
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

// --- Offers ---
const offers = [
  { label: "15% off" },
  { label: "15% off" },
  { label: "10% off" },
  { label: "10% off" },
  { label: "20% off" },
];

// --- Products ---
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

// --- PromoBannerCarousel with Keen Slider Parallax & Slide Bar ---
function PromoBannerCarousel({ banners }) {
  const timer = React.useRef();
  const [pause, setPause] = React.useState(false);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const imageRefs = React.useRef([]);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    drag: true,
    slides: { perView: 1 },
    animation: {
      duration: 1200, // 1.2s for slomo
      easing: (t) => t,
    },
    detailsChanged(s) {
      s.slides.forEach((slide, idx) => {
        const img = imageRefs.current[idx];
        if (img) {
          const translate = 40 * slide.progress;
          img.style.transform = `translateX(${translate}px) scale(1.08)`;
        }
      });
      setCurrentSlide(s.track.details.rel);
    },
    created: (slider) => {
      autoplay(slider);
      slider.container.addEventListener("mouseover", () => setPause(true));
      slider.container.addEventListener("mouseout", () => setPause(false));
    },
    dragStarted: () => setPause(true),
    dragEnded: () => setPause(false),
    updated: (slider) => autoplay(slider),
    animationEnded: (slider) => autoplay(slider),
  });

  function autoplay(slider) {
    clearTimeout(timer.current);
    if (pause) return;
    timer.current = setTimeout(() => {
      if (slider) slider.next();
    }, 3000);
  }

  React.useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  React.useEffect(() => {
    if (instanceRef.current) {
      autoplay(instanceRef.current);
    }
  }, [pause, instanceRef]);

  imageRefs.current = [];

  return (
    <div className='mx-4 mt-3 mb-0 rounded-xl overflow-hidden'>
      <div ref={sliderRef} className='keen-slider rounded-xl'>
        {banners.map((banner, idx) => (
          <div className='keen-slider__slide flex min-w-full' key={idx}>
            <div
              className={`flex items-center p-4 w-full relative rounded-xl ${banner.bg}`}
            >
              <div className='flex-1'>
                <div className={`text-sm font-medium mb-1 ${banner.color}`}>
                  {banner.title}
                </div>
                <div className={`text-2xl font-bold mb-1 ${banner.color}`}>
                  {banner.subtitle}
                </div>
                <button className='mt-2 px-5 py-2 bg-black text-white rounded-full font-semibold shadow hover:bg-opacity-90 transition'>
                  {banner.button}
                </button>
              </div>
              <img
                ref={(el) => (imageRefs.current[idx] = el)}
                src={banner.image}
                alt='model'
                className='h-28 w-20 object-cover rounded-xl ml-2 transition-transform duration-500 will-change-transform'
                style={{ transform: "scale(1.08)" }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Slide Indicator Bar */}
      <div className='w-full flex justify-center py-2 gap-2'>
        {banners.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 w-28 rounded transition-all duration-300
              ${currentSlide === idx ? "bg-blue-400" : "bg-blue-100"}
            `}
          ></div>
        ))}
      </div>
    </div>
  );
}

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

      {/* Promo Banner Carousel */}
      <PromoBannerCarousel banners={promoBanners} />

      {/* Sell With Us Banner */}
      <div className='mx-4 my-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white p-5 flex items-center shadow'>
        <div className='flex-1 flex flex-col'>
          <div>
            <div className='text-lg font-bold mb-1'>
              Have something to sell?
            </div>
            <div className='mb-2 text-sm'>
              Open your shop on Bethelia and reach thousands of customers across
              the country!
            </div>
          </div>
          <a
            href='/supplier-login'
            className='inline-block bg-white text-blue-700 px-4 py-2 rounded-full font-semibold shadow hover:bg-blue-50 transition mt-2 self-end'
          >
            Start Selling
          </a>
        </div>
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
