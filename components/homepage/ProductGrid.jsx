// /components/ProductGrid.jsx
import React from "react";
import Link from "next/link"; // ✅ Import Link from Next.js for client-side navigation
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ Adjust this path if your Skeleton component is located elsewhere

export default function ProductGrid({ products = [], loading = false }) {
  // Helper function to render skeleton loaders
  const renderSkeletons = () => {
    // Renders 6 skeleton cards when loading
    return Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={`skeleton-${idx}`} // Unique key for each skeleton
        className='relative bg-white rounded-xl shadow p-2 flex flex-col items-start' // Ensures content is left-aligned
      >
        {/* Skeleton for the favorite heart icon */}
        <Skeleton className='absolute top-2 right-2 h-6 w-6 rounded-full' />
        {/* Skeleton for the product image - now w-full */}
        <Skeleton className='w-full h-28 rounded-md mb-2 object-cover' />
        {/* Skeletons for product name and price */}
        <Skeleton className='h-4 w-full mb-1' />
        <Skeleton className='h-5 w-1/2' />
        {/* Skeletons for "On Sale" and "Sold" */}
        <Skeleton className='h-3 w-1/3 mt-1' />
        <Skeleton className='h-3 w-1/4 mt-1' />
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
          // ✅ Wrap the entire product card with a Next.js Link component
          <Link
            key={product.id} // Use product ID as the key for efficient rendering
            href={`/product/${product.id}`} // Dynamic link to product details page
            passHref // Pass href to the underlying <a> tag
            className='relative bg-white rounded-xl shadow p-2 flex flex-col items-start cursor-pointer hover:shadow-lg transition-shadow duration-200' // Added cursor-pointer and hover effects
          >
            {/* Favorite button (placeholder functionality) */}
            <button
              className='absolute top-2 right-2 bg-white/90 rounded-full p-1 z-10'
              tabIndex={-1} // Makes it not focusable via tab key
              aria-label='Add to favorites'
              onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior
                e.stopPropagation(); // Stop event from bubbling up to the Link (card click)
                // Add your favorite logic here
                console.log(`Toggled favorite for product: ${product.name}`);
              }}
            >
              <Heart className='w-5 h-5 text-gray-300 hover:text-red-500' />
            </button>

            {/* Product image - now w-full */}
            <img
              src={
                // Prioritize mainImage, then first image in images array, fallback to placeholder
                product.mainImage ||
                product.images?.[0] ||
                "/placeholder-product.png"
              }
              alt={product.name || "Product"} // Alt text for accessibility
              className='w-full h-28 object-cover rounded-md mb-2'
              // Fallback for broken image links
              onError={(e) => (e.target.src = "/placeholder-product.png")}
            />

            {/* Product name - font size adjusted for length */}
            <div className='font-semibold w-full leading-tight'>
              <span
                className={
                  product.name && product.name.length > 25
                    ? "text-xs"
                    : "text-sm"
                }
              >
                {product.name || "Unnamed"}
              </span>
            </div>

            {/* Product price */}
            <div className='text-green-700 font-bold text-lg mt-1'>
              ₱{product.price ?? "N/A"}
            </div>

            {/* "On Sale" and "Sold" indicators - stacked and left-aligned */}
            <div className='flex flex-col items-start text-xs mt-1'>
              <span className='text-primary py-0.5 font-bold mb-0.5'>
                Sale | ₱20 off
              </span>
              <span className='text-gray-500'>
                Sold: <span className='font-semibold'>50+</span>
              </span>
            </div>
          </Link> // ✅ Close Link component
        ))}
      </div>
    </>
  );
}
