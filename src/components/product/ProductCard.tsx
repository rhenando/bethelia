import React from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { flyToCartAnimation } from "@/utils/flyToCart";
import { useCartStore } from "@/store/useCartStore"; // ✅ import the store

type ProductCardProps = {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  variant?: "flash-deal" | "trending";
};

export default function ProductCard({
  id,
  name,
  image,
  price,
  oldPrice,
  discount,
  rating,
  variant,
}: ProductCardProps) {
  const navigate = useNavigate();
  const isFlashDeal = variant === "flash-deal";
  const isTrending = variant === "trending";
  const brandColor = "#2980b9";

  const addToCart = useCartStore((state) => state.addToCart); // ✅ from store

  // 🛍 Add-to-cart with fly animation + sound
  const handleAddToCart = () => {
    flyToCartAnimation(id);
    setTimeout(() => {
      addToCart({
        id: id.toString(), // store expects string id
        name,
        price,
        quantity: 1,
      });
    }, 900);
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 ease-out overflow-visible border flex flex-col h-full hover:-translate-y-1`}
      style={{
        borderColor: isFlashDeal
          ? "#dc2626"
          : isTrending
          ? "#f97316"
          : brandColor,
      }}
    >
      {/* 🔖 Badges */}
      <div className='absolute top-2 left-2 z-20'>
        {isFlashDeal && (
          <div className='bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow'>
            ⚡ Flash Deal
          </div>
        )}
        {isTrending && !isFlashDeal && (
          <div className='bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow'>
            🔥 Trending
          </div>
        )}
      </div>

      {/* Discount Tag */}
      {isFlashDeal && discount && (
        <div className='absolute top-2 right-2 z-20 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded-md shadow'>
          -{discount}%
        </div>
      )}

      {/* 🖼 Image */}
      <div
        className='relative cursor-pointer group'
        onClick={() => navigate(`/product/${id}`)}
      >
        <div className='overflow-hidden rounded-t-xl'>
          <img
            src={image}
            alt={name}
            data-product-id={id}
            className='w-full h-48 object-cover transition-transform duration-300 ease-out group-hover:scale-105 will-change-transform'
          />
        </div>
      </div>

      {/* 📄 Info */}
      <div className='p-3 flex flex-col grow justify-between'>
        <div>
          <h3
            className='text-sm font-semibold text-gray-800 truncate cursor-pointer hover:text-(--brand-color)'
            style={{ "--brand-color": brandColor } as React.CSSProperties}
            onClick={() => navigate(`/product/${id}`)}
          >
            {name}
          </h3>

          {/* 💰 Price */}
          <div className='mt-2 flex items-center gap-2'>
            <span
              className={`text-lg font-bold ${
                isFlashDeal
                  ? "text-red-600"
                  : isTrending
                  ? "text-orange-500"
                  : "text-(--brand-color)"
              }`}
              style={{ "--brand-color": brandColor } as React.CSSProperties}
            >
              ₱{price.toLocaleString()}
            </span>

            {oldPrice && (
              <span className='text-sm text-gray-400 line-through'>
                ₱{oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* ⭐ Rating */}
          {rating && (
            <div className='mt-1 text-xs text-yellow-500'>
              {"★".repeat(Math.round(rating)) +
                "☆".repeat(5 - Math.round(rating))}
              <span className='text-gray-500 ml-1'>({rating.toFixed(1)})</span>
            </div>
          )}
        </div>

        {/* 🧱 Bottom Section */}
        <div className='mt-3 min-h-12 flex flex-col justify-between'>
          {isFlashDeal ? (
            <div className='text-xs text-red-600 font-semibold'>
              Hurry! Limited time offer ⏰
            </div>
          ) : isTrending ? (
            <div className='text-xs text-orange-500 font-medium'>
              Popular choice among shoppers ✨
            </div>
          ) : (
            <div className='text-xs text-gray-500 italic'>
              Discover great deals every day 💎
            </div>
          )}

          {/* 🛒 Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className='mt-2 w-full flex items-center justify-center gap-1 py-1.5 bg-(--brand-color) text-white text-sm rounded-md hover:bg-[#2471a3] transition-all'
            style={{ "--brand-color": brandColor } as React.CSSProperties}
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
