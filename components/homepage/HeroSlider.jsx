"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

// Swiper CSS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const categories = [
  { id: 1, label: "Global Store", image: "/icons/global.svg" },
  { id: 2, label: "Deals", image: "/icons/deals.svg" },
  { id: 3, label: "Automotive", image: "/icons/auto.svg" },
  // …
];

const rightPromos = [
  {
    id: 1,
    image: "/promos/fashion-women.jpg",
    title: "Top fashion deals",
    subtitle: "From ₱8",
    link: "/fashion/women",
    cta: "Shop Women →",
  },
  {
    id: 2,
    image: "/promos/fashion-men.jpg",
    title: "Top fashion deals",
    subtitle: "From ₱8",
    link: "/fashion/men",
    cta: "Shop Men →",
  },
  {
    id: 3,
    image: "/promos/tech.jpg",
    title: "Gadget bargains",
    subtitle: "Up to 60% off",
    link: "/electronics",
    cta: "Browse Tech →",
  },
];

export default function Hero({ slides }) {
  return (
    <section className='min-h-screen grid grid-rows-[50vh_auto]'>
      {/* slider + promos occupies 50vh */}
      <div className='container mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-4'>
        {/* Main slider (fills the 50vh row) */}
        <div className='lg:col-span-9 h-full'>
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 5000 }}
            loop
            className='h-full rounded-lg overflow-hidden'
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div
                  className='h-full bg-cover bg-center'
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className='h-full bg-black/20 flex items-center'>
                    <div className='max-w-md text-white p-6'>
                      <h1 className='text-4xl font-bold mb-2'>{slide.title}</h1>
                      <p className='text-lg mb-4'>{slide.subtitle}</p>
                      <a
                        href={slide.ctaLink}
                        className='inline-block bg-primary px-5 py-2 font-semibold rounded hover:bg-primary-dark transition'
                      >
                        {slide.cta}
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Three stacked promos sharing the 50vh row */}
        <div className='lg:col-span-3 flex flex-col gap-4 h-full'>
          {rightPromos.map((promo) => (
            <a
              key={promo.id}
              href={promo.link}
              className='relative flex-1 rounded-lg overflow-hidden'
            >
              <img
                src={promo.image}
                alt={promo.title}
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4'>
                <h2 className='text-xl font-bold text-white'>{promo.title}</h2>
                <span className='text-sm text-white'>{promo.subtitle}</span>
                <span className='mt-2 inline-block text-primary font-semibold'>
                  {promo.cta}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* always‐visible category carousel below */}
      <div className='border-t py-4 bg-white'>
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView='auto'
          spaceBetween={16}
        >
          {categories.map((cat) => (
            <SwiperSlide
              key={cat.id}
              className='w-auto flex-shrink-0 text-center'
            >
              <div className='mx-auto mb-1 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden'>
                <img
                  src={cat.image}
                  alt={cat.label}
                  className='h-10 w-10 object-contain'
                />
              </div>
              <span className='text-xs text-gray-700'>{cat.label}</span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className='border-t py-4 bg-white'>
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView='auto'
          spaceBetween={16}
        >
          {categories.map((cat) => (
            <SwiperSlide
              key={cat.id}
              className='w-auto flex-shrink-0 text-center'
            >
              <div className='mx-auto mb-1 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden'>
                <img
                  src={cat.image}
                  alt={cat.label}
                  className='h-10 w-10 object-contain'
                />
              </div>
              <span className='text-xs text-gray-700'>{cat.label}</span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
