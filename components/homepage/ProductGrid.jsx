"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, LayoutGrid, List } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductGrid({
  products = [],
  loading = false,
  category = "New Arrivals",
  viewAllLink = "#",
}) {
  const [viewMode, setViewMode] = useState("grid");

  // Helper to render GRID skeletons
  const renderGridSkeletons = () =>
    Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={`skeleton-grid-${idx}`}
        className='relative bg-white rounded-xl shadow p-2 flex flex-col'
      >
        <Skeleton className='absolute top-2 right-2 h-6 w-6 rounded-full' />
        <Skeleton className='w-full h-28 rounded-md mb-2' />
        <Skeleton className='h-4 w-full mb-1' />
        <Skeleton className='h-5 w-1/2' />
      </div>
    ));

  // Helper to render LIST skeletons
  const renderListSkeletons = () =>
    Array.from({ length: 4 }).map((_, idx) => (
      <div
        key={`skeleton-list-${idx}`}
        className='bg-white rounded-xl shadow p-2 flex items-center gap-4'
      >
        <Skeleton className='w-20 h-20 rounded-md' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-4/5' />
          <Skeleton className='h-5 w-1/3' />
          <Skeleton className='h-3 w-1/4' />
        </div>
      </div>
    ));

  const renderContent = () => {
    if (loading) {
      return viewMode === "grid"
        ? renderGridSkeletons()
        : renderListSkeletons();
    }
    if (!products.length) {
      return (
        <div className='col-span-full text-center text-gray-400 py-10'>
          No products found.
        </div>
      );
    }

    return products.map((product) => (
      <Link
        key={product.id}
        href={`/product/${product.id}`}
        passHref
        className={`bg-white rounded-xl shadow p-2 cursor-pointer hover:shadow-lg transition-shadow duration-200 ${
          viewMode === "grid"
            ? "relative flex flex-col items-start"
            : "flex flex-row items-center gap-4"
        }`}
      >
        <button
          className='absolute top-2 right-2 bg-white/90 rounded-full p-1 z-10'
          aria-label='Add to favorites'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Toggled favorite for product: ${product.name}`);
          }}
        >
          <Heart className='w-5 h-5 text-gray-300 hover:text-red-500' />
        </button>
        <img
          src={
            product.mainImage ||
            product.images?.[0] ||
            "/placeholder-product.png"
          }
          alt={product.name || "Product"}
          className={`object-cover rounded-md ${
            viewMode === "grid" ? "w-full h-28 mb-2" : "w-20 h-20"
          }`}
          onError={(e) => (e.target.src = "/placeholder-product.png")}
        />
        <div className='flex-1 flex flex-col items-start'>
          <div className='font-semibold w-full leading-tight'>
            <span
              className={
                product.name && product.name.length > 25 ? "text-xs" : "text-sm"
              }
            >
              {product.name || "Unnamed"}
            </span>
          </div>
          <div className='text-green-700 font-bold text-lg mt-1'>
            ₱{product.price ?? "N/A"}
          </div>
          <div className='flex flex-col items-start text-xs mt-1'>
            <span className='text-primary py-0.5 font-bold mb-0.5'>
              Sale | ₱20 off
            </span>
            <span className='text-gray-500'>
              Sold: <span className='font-semibold'>50+</span>
            </span>
          </div>
        </div>
      </Link>
    ));
  };

  return (
    <div className='mt-4'>
      <div className='flex items-center justify-between px-4'>
        <h2 className='font-semibold text-base'>{category}</h2>
        <div className='flex items-center gap-2'>
          <Link
            href={viewAllLink}
            className='text-sm text-blue-600 font-medium hover:underline'
          >
            See All
          </Link>
          <div className='flex items-center gap-1 border-l pl-2'>
            <button
              onClick={() => setViewMode("grid")}
              aria-label='Grid View'
              className={`p-1.5 rounded-md ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <LayoutGrid className='w-5 h-5' />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label='List View'
              className={`p-1.5 rounded-md ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <List className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`px-4 mt-2 pb-4 ${
          viewMode === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-3"
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
}
