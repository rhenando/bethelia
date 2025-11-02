import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { products } from "../../../data/products";
import ProductCard from "@/components/product/ProductCard";

export default function FlashDeals() {
  // ⏱ 4-hour countdown timer
  const [timeLeft, setTimeLeft] = useState(4 * 3600);

  useEffect(() => {
    const timer = setInterval(
      () => setTimeLeft((t) => Math.max(t - 1, 0)),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // ✅ Only include tagged products
  const flashDealProducts = products.filter((p) =>
    p.variants?.includes("flash-deal")
  );

  // 🚫 Hide section entirely if no flash-deal products exist
  if (flashDealProducts.length === 0) return null;

  return (
    <section className='container mx-auto px-4 py-10'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-1'>
            Flash Deals
          </h2>
          <span className='bg-[#2980b9] text-white text-sm px-3 py-1 rounded-md font-semibold'>
            Ends in {hours}:{minutes}:{seconds}
          </span>
        </div>
        <button className='text-sm font-medium text-[#2980b9] hover:underline'>
          View All
        </button>
      </div>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={4}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {flashDealProducts.map((item) => {
          const discount = item.discount ?? Math.floor(Math.random() * 20 + 10);
          const oldPrice = Math.round(item.price * (1 + discount / 100));

          return (
            <SwiperSlide key={item.id}>
              <ProductCard
                {...item}
                discount={discount}
                oldPrice={oldPrice}
                variant='flash-deal'
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
