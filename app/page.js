// /app/products/page.jsx (or wherever your HomePage component is located)
"use client"; // This component needs to be a client component to use hooks

import React, { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Make sure this path is correct
import { toast } from "sonner"; // For notifications
import { Loader2 } from "lucide-react"; // For loading spinner

import Header from "@/components/homepage/Header";
import PromoBannerCarousel from "@/components/homepage/PromoBannerCarousel";
import CategoriesMarquee from "@/components/homepage/CategoriesMarquee";
import ProductGrid from "@/components/homepage/ProductGrid"; // This is your presentational grid
import SellBanner from "@/components/homepage/SellBanner";
import { promoBanners } from "@/data/promoBanners"; // Import banners

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      console.log("HomePage: Starting fetchNewArrivals...");
      if (!db) {
        console.error(
          "HomePage: Firestore DB is not initialized! Check '@/lib/firebase'."
        );
        toast.error("Firebase connection error.");
        setLoading(false);
        return;
      }

      try {
        const productsRef = collection(db, "products");
        // Query to get all products, ordered by creation date (descending) for "New Arrivals"
        const q = query(productsRef, orderBy("createdAt", "desc"));

        const querySnapshot = await getDocs(q);
        console.log("HomePage: New Arrivals query snapshot received.");
        console.log(
          "HomePage: Number of New Arrivals documents:",
          querySnapshot.docs.length
        );

        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("HomePage: Mapped New Arrivals data:", fetchedProducts);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("HomePage: Error fetching New Arrivals:", error);
        toast.error("Failed to load new arrivals.");
      } finally {
        setLoading(false);
        console.log("HomePage: New Arrivals loading state set to false.");
      }
    };

    fetchNewArrivals();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className='max-w-md mx-auto bg-white min-h-screen relative mb-4'>
      <Header />
      <PromoBannerCarousel banners={promoBanners} />
      <SellBanner />
      <section className='px-4 mt-2'>
        <h2 className='font-semibold text-base mb-1'>Categories</h2>
        <CategoriesMarquee />
      </section>
      {/* Pass fetched products and loading state to ProductGrid */}
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
