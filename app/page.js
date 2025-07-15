"use client";
import React from "react";
import Header from "@/components/homepage/Header";
import PromoBannerCarousel from "@/components/homepage/PromoBannerCarousel";
import CategoriesMarquee from "@/components/homepage/CategoriesMarquee";
import ProductGrid from "@/components/homepage/ProductGrid";
import SellBanner from "@/components/homepage/SellBanner";
import { promoBanners } from "@/data/promoBanners"; // ✅ Import banners

export default function HomePage() {
  return (
    <div className='max-w-md mx-auto bg-white min-h-screen relative'>
      <Header />
      <PromoBannerCarousel banners={promoBanners} /> {/* ✅ Pass banners */}
      <SellBanner />
      <section className='px-4 mt-2'>
        <h2 className='font-semibold text-base mb-1'>Categories</h2>
        <CategoriesMarquee />
      </section>
      <ProductGrid />
    </div>
  );
}
