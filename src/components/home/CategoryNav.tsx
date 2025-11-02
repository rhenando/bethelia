// src/components/home/CategoryNav.tsx
import { Link } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const categories = [
  "Electronics",
  "Men’s Fashion",
  "Women’s Fashion",
  "Kids’ Fashion",
  "Home & Kitchen",
  "Beauty & Fragrance",
  "Baby",
  "Toys",
  "Sports & Outdoors",
  "Appliances",
  "Health & Nutrition",
  "Automotive",
  "Pet Supplies",
  "Books & Stationery",
];

export default function CategoryNav() {
  const [index, setIndex] = useState(0);
  const texts = ["Try Free", "Free Delivery"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % texts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: "precision",
    dragSpeed: 0.8,
    slides: {
      perView: 6,
      spacing: 10,
    },
    breakpoints: {
      "(max-width: 1024px)": { slides: { perView: 5, spacing: 10 } },
      "(max-width: 768px)": { slides: { perView: 3.5, spacing: 8 } },
    },
  });

  return (
    <nav className='bg-transparent border-b border-gray-100'>
      <div className='container mx-auto flex items-center justify-between py-2 relative'>
        {/* LEFT ARROW */}
        <button
          aria-label='Previous'
          onClick={() => instanceRef.current?.prev()}
          className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-sm border border-gray-200 rounded-full p-2 hover:bg-[#2980b9] hover:text-white text-gray-700 transition hidden md:flex'
        >
          <ChevronLeft size={16} />
        </button>

        {/* SLIDER */}
        <div className='flex-1 mx-12 overflow-hidden'>
          <div ref={sliderRef} className='keen-slider'>
            {categories.map((cat) => (
              <div
                key={cat}
                className='keen-slider__slide flex justify-center items-center px-2'
                style={{
                  width: "calc(100% / 7 - 10px)", // ✅ ensures 7 visible slides
                  flex: "0 0 auto",
                }}
              >
                <Link
                  to={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className='block text-sm font-medium text-gray-800 hover:text-[#2980b9] transition whitespace-nowrap'
                  title={cat}
                >
                  {cat}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: NEXT + CTA */}
        <div className='flex items-center gap-2'>
          <button
            aria-label='Next'
            onClick={() => instanceRef.current?.next()}
            className='bg-white shadow-sm border border-gray-200 rounded-full p-2 hover:bg-[#2980b9] hover:text-white text-gray-700 transition hidden md:flex'
          >
            <ChevronRight size={16} />
          </button>

          {/* BETHELIA PLUS CTA */}
          <button
            className='flex items-center border border-[#2980b9] text-[#2980b9] font-bold text-xs sm:text-sm tracking-tight 
             px-3 sm:px-4 py-1.5 rounded-full bg-white'
          >
            <span className='mr-2 whitespace-nowrap'>Bethelia Plus</span>

            <div className='w-20 h-4 sm:h-5 relative flex items-center justify-center'>
              <AnimatePresence mode='wait'>
                <motion.span
                  key={index}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className='absolute text-[11px] sm:text-xs font-semibold'
                >
                  {texts[index]}
                </motion.span>
              </AnimatePresence>
            </div>

            <ChevronRight size={14} strokeWidth={2} className='ml-1' />
          </button>
        </div>
      </div>
    </nav>
  );
}
