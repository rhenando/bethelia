// /components/ProductGrid.jsx
import React from "react";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ Adjust this path if your Skeleton component is located elsewhere

export default function ProductGrid({ products = [], loading = false }) {
  // Helper function to render skeleton loaders
  const renderSkeletons = () => {
    // Renders 6 skeleton cards when loading
    return Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={`skeleton-${idx}`} // Unique key for each skeleton
        className='relative bg-white rounded-xl shadow p-2 flex flex-col items-center'
      >
        {/* Skeleton for the favorite heart icon */}
        <Skeleton className='absolute top-2 right-2 h-6 w-6 rounded-full' />

        {/* Skeleton for the product image */}
        <Skeleton className='h-28 w-28 rounded-md mb-2' />

        {/* Skeletons for product name and price */}
        <Skeleton className='h-4 w-24 mb-1' />
        <Skeleton className='h-5 w-16' />
      </div>
    ));
  };

  // Display skeletons and a "Loading..." message if data is still loading
  if (loading) {
    return (
      <>
        <div className='flex items-center justify-between px-4 mt-4'>
          <h2 className='font-semibold text-base'>New Arrivals</h2>
          <span className='text-sm text-gray-400'>Loading...</span>
        </div>

        <div className='grid grid-cols-2 gap-4 px-4 mt-2'>
          {renderSkeletons()}
        </div>
      </>
    );
  }

  // Display a "No products found." message if loading is complete and no products are available
  if (!products.length) {
    return (
      <div className='grid grid-cols-2 gap-4 px-4 mt-2'>
        <div className='col-span-2 text-center text-gray-400'>
          No products found.
        </div>
      </div>
    );
  }

  // Render the actual product grid if products are available and not loading
  return (
    <>
      <div className='flex items-center justify-between px-4 mt-4'>
        <h2 className='font-semibold text-base'>New Arrivals</h2>
        {/* Link to see all products (currently a placeholder) */}
        <a href='#' className='text-sm text-blue-600'>
          See All
        </a>
      </div>

      <div className='grid grid-cols-2 gap-4 px-4 mt-2'>
        {products.map((product) => (
          <div
            key={product.id} // Use product ID as the key for efficient rendering
            className='relative bg-white rounded-xl shadow p-2 flex flex-col items-center'
          >
            {/* Favorite button (placeholder functionality) */}
            <button
              className='absolute top-2 right-2 bg-white/90 rounded-full p-1 z-10'
              tabIndex={-1} // Makes it not focusable via tab key
              aria-label='Add to favorites'
            >
              <Heart className='w-5 h-5 text-gray-300 hover:text-red-500' />
            </button>

            {/* Product image */}
            <img
              src={
                // Prioritize mainImage, then first image in images array, fallback to placeholder
                product.mainImage ||
                product.images?.[0] ||
                "/placeholder-product.png"
              }
              alt={product.name || "Product"} // Alt text for accessibility
              className='h-28 w-28 object-cover rounded-md mb-2'
              // Fallback for broken image links
              onError={(e) => (e.target.src = "/placeholder-product.png")}
            />

            {/* Product name */}
            <div className='font-semibold text-center text-base'>
              {product.name || "Unnamed"}
            </div>

            {/* Product price */}
            <div className='text-green-700 font-bold text-lg mt-1'>
              ₱{product.price ?? "N/A"}{" "}
              {/* Display price or "N/A" if null/undefined */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
