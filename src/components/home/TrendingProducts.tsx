import { useState } from "react";
import { Heart } from "lucide-react";
import { products } from "../../../data/products";
import ProductCard from "@/components/product/ProductCard";
import { flyToCartAnimation } from "@/utils/flyToCart"; // ✅ ensure this utility exists

const categories = ["All", "Fashion", "Electronics", "Home", "Beauty"];

export default function TrendingProducts() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState<number[]>([]);

  // ✅ Filter logic: show ALL products and apply category filter only
  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter((p) =>
          p.category.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ✅ Stable Add-to-Cart handler with delay for animation
  const handleAddToCart = (id: number) => {
    flyToCartAnimation(id); // trigger animation
    // simulate cart update logic after animation completes
    setTimeout(() => {
      console.log("Added product:", id);
    }, 900);
  };

  return (
    <section className='container mx-auto px-4 py-12 overflow-visible'>
      {/* Title */}
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>Trending Now</h2>
        <p className='text-sm text-gray-500'>
          Hand-picked favorites by shoppers
        </p>
      </div>

      {/* Filter Tabs */}
      <div className='flex gap-4 mb-8 overflow-x-auto pb-2'>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? "bg-[#2980b9] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 overflow-visible'>
        {filtered.map((item) => (
          <div key={item.id} className='relative group overflow-visible'>
            {/* ❤️ Wishlist Button */}
            <button
              onClick={() => toggleWishlist(item.id)}
              className='absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:scale-110 transition z-10'
            >
              <Heart
                size={18}
                className={`${
                  wishlist.includes(item.id)
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400"
                }`}
              />
            </button>

            {/* ✅ ProductCard with working animation */}
            <ProductCard
              {...item}
              oldPrice={item.price + 300}
              variant={
                item.variants?.includes("trending")
                  ? "trending"
                  : item.variants?.includes("flash-deal")
                  ? "flash-deal"
                  : undefined
              }
              onAddToCart={handleAddToCart}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
