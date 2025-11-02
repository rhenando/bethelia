// src/components/home/CategoryIcons.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { products } from "../../../data/products";

export default function CategoryIcons() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // ✅ Dynamically generate unique categories from products
  const categories = useMemo(() => {
    const unique = new Map<string, string>();
    products.forEach((p) => {
      if (!unique.has(p.category)) unique.set(p.category, p.image);
    });
    return Array.from(unique, ([name, image]) => ({ name, image }));
  }, []);

  return (
    <section className='py-8 bg-white border-t overflow-visible'>
      <div className='container mx-auto px-8 overflow-visible'>
        <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-1'>
          Shop by Category
        </h2>

        {/* ✅ Added wider padding + taller min height for safe hover zone */}
        <div className='relative overflow-x-auto overflow-visible scrollbar-hide py-5 px-4 -mx-4'>
          <div className='flex gap-8 snap-x snap-mandatory items-start overflow-visible min-h-[140px]'>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <motion.div
                  key={cat.name}
                  role='button'
                  tabIndex={0}
                  aria-label={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{
                    duration: 0.22,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className='flex flex-col items-center text-center shrink-0 snap-start cursor-pointer group focus:outline-none relative z-0 hover:z-10'
                >
                  {/* Circle container */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{
                      duration: 0.22,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className={`w-20 h-20 flex items-center justify-center rounded-full shadow-sm border transition-all duration-200
                      ${
                        isActive
                          ? "bg-linear-to-br from-[#2980b9]/30 to-[#2980b9]/10 border-[#2980b9] shadow-md"
                          : "bg-gray-100 border-gray-200 hover:border-[#2980b9]/60 hover:shadow-md"
                      }`}
                  >
                    <motion.img
                      src={cat.image}
                      alt={cat.name}
                      loading='lazy'
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        duration: 0.22,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className='w-14 h-14 object-cover rounded-full'
                    />
                  </motion.div>

                  {/* Label */}
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    transition={{
                      duration: 0.22,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className={`mt-3 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-[#2980b9]"
                        : "text-gray-700 group-hover:text-[#2980b9]"
                    }`}
                  >
                    {cat.name}
                  </motion.span>

                  {/* Active underline */}
                  {isActive && (
                    <motion.div
                      layoutId='underline'
                      transition={{
                        duration: 0.25,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className='w-6 h-1 rounded-full bg-[#2980b9] mt-1'
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
