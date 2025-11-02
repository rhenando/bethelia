import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { products } from "../../data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Truck, ShieldCheck, MessageCircle, Star } from "lucide-react"; // ✅ Lucide icons

interface Product {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  category: string;
  supplier: string;
  image: string;
}

export default function ProductDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = products.find((p) => p.id === Number(id));
      setProduct(found || null);
      if (found) {
        const related = products
          .filter((p) => p.category === found.category && p.id !== found.id)
          .slice(0, 8);
        setRelatedProducts(related);
      }
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id]);

  // ✅ Skeleton Loader
  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8 animate-pulse'>
        <div className='h-4 bg-gray-200 w-40 mb-6 rounded'></div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          <div className='space-y-4'>
            <div className='aspect-square bg-gray-200 rounded-lg'></div>
            <div className='flex gap-2 justify-center'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='w-20 h-20 bg-gray-200 rounded-md'></div>
              ))}
            </div>
          </div>
          <div className='space-y-4'>
            <div className='h-8 bg-gray-200 w-3/4 rounded'></div>
            <div className='h-4 bg-gray-200 w-1/3 rounded'></div>
            <div className='h-4 bg-gray-200 w-1/2 rounded'></div>
            <div className='h-6 bg-gray-200 w-24 rounded'></div>
            <div className='space-y-2 mt-4'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='h-3 bg-gray-200 rounded'></div>
              ))}
            </div>
            <div className='flex gap-4 mt-6'>
              <div className='h-10 bg-gray-200 flex-1 rounded'></div>
              <div className='h-10 bg-gray-200 flex-1 rounded'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product)
    return (
      <div className='p-10 text-center text-gray-600'>
        Product not found.{" "}
        <Link to='/' className='text-primary underline'>
          Go back
        </Link>
      </div>
    );

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Breadcrumb */}
      <nav className='text-sm text-gray-500 mb-4'>
        <Link to='/' className='hover:text-primary'>
          Home
        </Link>{" "}
        / <span className='text-gray-700 font-medium'>{product.name}</span>
      </nav>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* Left: Product Images */}
        <div className='space-y-4'>
          <div className='aspect-square bg-gray-50 rounded-lg overflow-hidden shadow-sm'>
            <img
              src={product.image}
              alt={product.name}
              className='w-full h-full object-contain hover:scale-105 transition-transform duration-300'
            />
          </div>

          <div className='flex gap-2 justify-center'>
            {[product.image, product.image, product.image].map((thumb, i) => (
              <img
                key={i}
                src={thumb}
                alt={`Thumbnail ${i}`}
                className='w-20 h-20 object-cover rounded-md border cursor-pointer hover:ring-2 hover:ring-primary transition'
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className='md:sticky md:top-24 self-start'>
          <h1 className='text-3xl font-bold mb-3'>{product.name}</h1>

          {/* Rating & Reviews */}
          <div className='flex items-center gap-2 mb-2 text-yellow-400'>
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={18} fill='currentColor' stroke='none' />
            ))}
            <Star size={18} className='text-gray-300' />
            <span className='text-sm text-gray-500 ml-1'>(128 reviews)</span>
          </div>

          {/* Availability */}
          <p className='text-sm text-green-600 font-medium mb-3'>
            ✅ In stock • Ships from Bulacan
          </p>

          {/* Price & Seller */}
          <div className='flex items-center justify-between mb-4'>
            <p className='text-3xl font-bold text-primary'>₱{product.price}</p>
            <p className='text-sm text-gray-500'>
              Sold by <span className='font-medium'>{product.supplier}</span>
            </p>
          </div>

          <p className='text-gray-600 leading-relaxed mb-6'>
            {product.description}
          </p>

          {/* CTA Buttons */}
          <div className='flex items-center gap-4 mb-6'>
            <button className='flex-1 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-[#2471a3] transition shadow-sm'>
              Add to Cart
            </button>
            <button className='flex-1 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition shadow-sm'>
              Buy Now
            </button>
          </div>

          {/* Trust Indicators with Lucide Icons */}
          <div className='space-y-3 text-sm text-gray-500'>
            <div className='flex items-center gap-2'>
              <Truck size={16} className='text-primary' />
              <span>Fast delivery within 2–4 days</span>
            </div>
            <div className='flex items-center gap-2'>
              <ShieldCheck size={16} className='text-primary' />
              <span>Secure payment via Bethelia PH</span>
            </div>
            <div className='flex items-center gap-2'>
              <MessageCircle size={16} className='text-primary' />
              <span>24/7 Customer support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className='mt-12 border-t pt-8'>
        <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
          Product Details
        </h2>
        <p className='text-gray-600 leading-relaxed'>
          {product.longDescription ||
            "This product combines quality craftsmanship and durability. Perfect for daily use or gifting. Imported and tested for safety and reliability."}
        </p>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className='mt-16 border-t pt-10'>
          <h2 className='text-2xl font-bold mb-6 text-gray-800'>
            You May Also Like
          </h2>
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {relatedProducts.map((related) => (
              <SwiperSlide key={related.id}>
                <div className='group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition duration-300'>
                  <Link
                    to={`/product/${related.id}`}
                    className='block relative'
                  >
                    <img
                      src={related.image}
                      alt={related.name}
                      className='w-full h-56 object-contain p-4 bg-gray-50 group-hover:scale-105 transition-transform duration-300'
                    />
                  </Link>
                  <div className='p-4'>
                    <h3 className='text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-primary transition'>
                      {related.name}
                    </h3>
                    <p className='text-lg font-semibold text-primary'>
                      ₱{related.price}
                    </p>
                    <p className='text-xs text-gray-500 mb-3'>
                      Sold by {related.supplier}
                    </p>
                    <button className='w-full py-2 rounded-md bg-primary text-white text-sm font-semibold hover:bg-[#2471a3] transition'>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
