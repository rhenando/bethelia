"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Button } from "@/components/ui/button";

// Swiper CSS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Hero = ({ slides }) => {
  return (
    <section className='relative'>
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{ clickable: true }}
        navigation
        autoplay={{ delay: 5000 }}
        loop
        className='w-full'
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className='relative h-[500px] w-full overflow-hidden bg-cover bg-center'
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className='absolute inset-0 bg-black/0' />
              <div className='container mx-auto flex items-center h-full px-4'>
                <div className='max-w-lg text-white'>
                  <h1 className='text-4xl font-bold mb-4'>{slide.title}</h1>
                  <p className='text-xl mb-8'>{slide.subtitle}</p>
                  <Button className='bg-blue-600 text-white px-8 py-6 text-lg'>
                    {slide.cta} <i className='fas fa-arrow-right ml-2' />
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
