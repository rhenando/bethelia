"use client";
import React, { useState } from "react";
import Header from "@/components/homepage/Header";
import PromoBannerCarousel from "@/components/homepage/PromoBannerCarousel";
import CategoriesMarquee from "@/components/homepage/CategoriesMarquee";
import ProductGrid from "@/components/homepage/ProductGrid";
import SellBanner from "@/components/homepage/SellBanner";
import LogoutDialog from "@/components/homepage/LogoutDialog";

import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { promoBanners } from "@/data/promoBanners";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUser } from "@/store/authSlice";

export default function HomePage() {
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const { categories, loading: loadingCategories } = useCategories();
  const { products, loading: loadingProducts } = useProducts();

  const handleStartSelling = (e) => {
    e.preventDefault();
    const roles = authUser?.roles || [];
    if (!roles.length) return router.push("/seller-login");
    const isSeller = roles.includes("seller");
    const isBuyer = roles.includes("buyer");
    if ((isSeller && isBuyer) || isBuyer) return setShowLogoutDialog(true);
    setInfoMessage("You are already logged in as a Seller. Redirecting...");
    return router.push("/seller");
  };

  const handleConfirmLogout = () => {
    setShowLogoutDialog(false);
    dispatch(clearUser());
    router.push("/seller-login");
  };

  return (
    <div className='max-w-md mx-auto bg-white min-h-screen relative'>
      <Header />
      <PromoBannerCarousel banners={promoBanners} />
      <SellBanner />

      <section className='px-4 mt-2'>
        <h2 className='font-semibold text-base mb-1'>Categories</h2>
        {loadingCategories ? (
          <p className='text-gray-400'>Loading...</p>
        ) : (
          <CategoriesMarquee categories={categories} />
        )}
      </section>
      <ProductGrid products={products} loading={loadingProducts} />
    </div>
  );
}
