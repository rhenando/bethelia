"use client";
import React, { useState, useEffect, useRef } from "react";
import { Heart, ShoppingCart, Search } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

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

// --- Offers ---
const offers = [
  { label: "15% off" },
  { label: "15% off" },
  { label: "10% off" },
  { label: "10% off" },
  { label: "20% off" },
];

// --- PromoBannerCarousel (unchanged) ---
function PromoBannerCarousel({ banners }) {
  const timer = useRef();
  const [pause, setPause] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const imageRefs = useRef([]);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    drag: true,
    slides: { perView: 1 },
    animation: {
      duration: 1200,
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
  const wishCount = 2;
  const cartCount = 3;

  // Auth logic for Sell With Us banner (doesn't block page render)
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // ---- FETCH CATEGORIES from Firestore ----
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ---- FETCH PRODUCTS from Firestore ----
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const q = query(collection(db, "categories"), orderBy("order"));
        const snap = await getDocs(q);
        const cats = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(cats);
      } catch (err) {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Most recent first by createdAt (optional)
        const q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const items = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  const handleStartSelling = (e) => {
    e.preventDefault();

    if (!authUser || !Array.isArray(authUser.roles)) {
      // Not logged in, just go to seller-login (no dialog, UX for guest)
      router.push("/seller-login");
      return;
    }

    const isSeller = authUser.roles.includes("seller");
    const isBuyer = authUser.roles.includes("buyer");

    if (isBuyer && isSeller) {
      setShowLogoutDialog(true);
    } else if (isSeller) {
      router.push("/seller");
    } else if (isBuyer) {
      setShowLogoutDialog(true);
    } else {
      router.push("/seller-login");
    }
  };

  const handleConfirmLogout = async () => {
    setShowLogoutDialog(false);
    dispatch(clearUser());
    router.push("/seller-login");
  };

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
            href='/seller-login'
            className='inline-block bg-white text-blue-700 px-4 py-2 rounded-full font-semibold shadow hover:bg-blue-50 transition mt-2 self-end'
            onClick={handleStartSelling}
          >
            Start Selling
          </a>
        </div>
      </div>

      {/* Logout Dialog */}
      {showLogoutDialog && (
        <div className='fixed inset-0 z-50 bg-black/30 flex items-center justify-center'>
          <div className='bg-white rounded-xl shadow-xl p-6 max-w-xs w-full flex flex-col items-center'>
            <div className='text-lg font-semibold mb-2 text-center'>
              You will be logged out as buyer.
            </div>
            <div className='text-gray-500 text-sm mb-4 text-center'>
              To continue as a seller, we need to log you out of your buyer
              account. Continue?
            </div>
            <div className='flex gap-4'>
              <button
                className='bg-blue-600 text-white px-4 py-2 rounded-md'
                onClick={handleConfirmLogout}
              >
                Yes
              </button>
              <button
                className='bg-gray-100 text-gray-700 px-4 py-2 rounded-md'
                onClick={() => setShowLogoutDialog(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <h2 className='font-semibold text-base px-4 mt-2 mb-1'>Categories</h2>
      <div className='flex overflow-x-auto gap-4 px-4 pb-2'>
        {loadingCategories ? (
          <div className='text-gray-400'>Loading...</div>
        ) : categories.length === 0 ? (
          <div className='text-gray-400'>No categories found.</div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id || cat.name}
              className='flex flex-col items-center min-w-[60px]'
            >
              <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1'>
                <img
                  src={cat.icon || cat.imageUrl || "/placeholder-category.png"}
                  alt={cat.name}
                  className='h-7 w-7 object-contain'
                  onError={(e) => (e.target.src = "/placeholder-category.png")}
                />
              </div>
              <span className='text-xs font-medium text-gray-700'>
                {cat.name || "Unnamed"}
              </span>
            </div>
          ))
        )}
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
        {loadingProducts ? (
          <>
            <div className='col-span-2 text-center text-gray-400'>
              Loading...
            </div>
          </>
        ) : products.length === 0 ? (
          <>
            <div className='col-span-2 text-center text-gray-400'>
              No products found.
            </div>
          </>
        ) : (
          products.map((product) => (
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
                src={
                  product.mainImage ||
                  (product.images?.[0] ?? "/placeholder-product.png")
                }
                alt={product.name || "Product"}
                className='h-28 w-28 object-cover rounded-md mb-2'
                onError={(e) => (e.target.src = "/placeholder-product.png")}
              />
              <div className='font-semibold text-center text-base'>
                {product.name || "Unnamed"}
              </div>
              <div className='text-green-700 font-bold text-lg mt-1'>
                ₱{product.price ?? "N/A"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
