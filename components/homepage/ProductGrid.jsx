import React from "react";
import { Heart } from "lucide-react";

export default function ProductGrid({ products = [], loading = false }) {
  if (loading) {
    return (
      <div className='grid grid-cols-2 gap-4 px-4 mt-2'>
        <div className='col-span-2 text-center text-gray-400'>Loading...</div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className='grid grid-cols-2 gap-4 px-4 mt-2'>
        <div className='col-span-2 text-center text-gray-400'>
          No products found.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='flex items-center justify-between px-4 mt-4'>
        <h2 className='font-semibold text-base'>New Arrivals</h2>
        <a href='#' className='text-sm text-blue-600'>
          See All
        </a>
      </div>

      <div className='grid grid-cols-2 gap-4 px-4 mt-2'>
        {products.map((product) => (
          <div
            key={product.id}
            className='relative bg-white rounded-xl shadow p-2 flex flex-col items-center'
          >
            <button
              className='absolute top-2 right-2 bg-white/90 rounded-full p-1 z-10'
              tabIndex={-1}
              aria-label='Add to favorites'
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
              className='h-28 w-28 object-cover rounded-md mb-2'
              onError={(e) => (e.target.src = "/placeholder-product.png")}
            />

            <div className='font-semibold text-center text-base'>
              {product.name || "Unnamed"}
            </div>

            <div className='text-green-700 font-bold text-lg mt-1'>
              ₱{product.price ?? "N/A"}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
