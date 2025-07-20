"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import {
  ShoppingCart,
  Store,
  Minus,
  Plus,
  ChevronLeft,
  Truck,
  Clock,
  Star,
  ShieldCheck, // <-- New Icon
  PackageCheck, // <-- New Icon
  Undo2, // <-- New Icon
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Helper functions ---
function formatPrice(amount) {
  return (
    "₱" + Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })
  );
}
function getDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

// --- Main Component ---
export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId;

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [carouselApi, setCarouselApi] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");

  // --- Countdown Effect ---
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(now.getTime() + 36 * 60 * 60 * 1000);
      const interval = setInterval(() => {
        const current = new Date();
        const difference = endTime - current;
        if (difference <= 0) {
          clearInterval(interval);
          setTimeLeft("Order window closed");
          return;
        }
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`
        );
      }, 1000);
      return () => clearInterval(interval);
    };
    const cleanup = calculateTimeLeft();
    return cleanup;
  }, []);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    const fetchProductAndSeller = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const productData = { id: productSnap.id, ...productSnap.data() };
          setProduct(productData);
          if (productData.variants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0]);
          }
          if (productData.sellerId) {
            const sellerRef = doc(db, "sellers", productData.sellerId);
            const sellerSnap = await getDoc(sellerRef);
            if (sellerSnap.exists()) {
              setSeller(sellerSnap.data());
            }
          }
        } else {
          toast.error("Product not found.");
        }
      } catch (err) {
        toast.error("Failed to load product details.");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndSeller();
  }, [productId]);

  // --- Carousel Listener Effect ---
  useEffect(() => {
    if (!carouselApi) return;
    setSlideCount(carouselApi.scrollSnapList().length);
    setCurrentSlide(carouselApi.selectedScrollSnap());
    const onSelect = () => setCurrentSlide(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    return () => carouselApi.off("select", onSelect);
  }, [carouselApi]);

  const handleAddToCart = () => {
    if (!product) return;
    toast.info(`"Add to Cart" functionality is not implemented yet.`);
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    if (variant.image && product.images) {
      const imageIndex = product.images.findIndex(
        (img) => img === variant.image
      );
      if (imageIndex !== -1 && carouselApi) {
        carouselApi.scrollTo(imageIndex);
      }
    }
  };

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen text-gray-500'>
        <p className='text-lg font-semibold'>Product not available.</p>
      </div>
    );
  }

  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const discountedPrice = originalPrice * 0.8;
  const displayStock = selectedVariant ? selectedVariant.stock : product.stock;
  const images = product.images || [];

  const trustBadges = [
    { icon: ShieldCheck, text: "Secure Payment" },
    { icon: PackageCheck, text: "Authentic Product" },
    { icon: Undo2, text: "Easy Returns" },
  ];

  return (
    <>
      <Header />
      <div className='max-w-md mx-auto bg-white min-h-screen'>
        <div className='p-4 pb-24'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-1 text-lg font-bold text-red-500 mb-4'
          >
            <ChevronLeft className='w-4 h-4' /> Back
          </button>
          {seller && (
            <div>
              <p className='font-semibold text-sm text-primary'>
                {seller.storeName || "Anonymous Seller"}
              </p>
            </div>
          )}
          <h1 className='text-xl font-bold mb-4'>{product.name}</h1>
          <div className='mb-4'>
            <Carousel setApi={setCarouselApi} className='w-full'>
              <CarouselContent>
                {images.length > 0 ? (
                  images.map((imgUrl, index) => (
                    <CarouselItem key={index}>
                      <Card className='border-none shadow-none rounded-lg'>
                        <CardContent className='flex aspect-square items-center justify-center p-0'>
                          <img
                            src={imgUrl || "/placeholder-product.png"}
                            alt={`${product.name} image ${index + 1}`}
                            className='w-full h-full object-cover rounded-lg'
                          />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className='flex aspect-square items-center justify-center p-0 bg-gray-100 rounded-lg'>
                      <img
                        src='/placeholder-product.png'
                        alt='Placeholder'
                        className='w-full h-full object-cover rounded-lg'
                      />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
            </Carousel>
            <div className='py-2 flex justify-center gap-2'>
              {Array.from({ length: slideCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index
                      ? "w-4 bg-primary"
                      : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <div className='my-2'>
            <div className='flex items-end gap-2'>
              <p className='text-green-700 font-bold text-3xl'>
                {formatPrice(discountedPrice)}
              </p>
              <p className='text-gray-400 line-through text-lg'>
                {formatPrice(originalPrice)}
              </p>
            </div>
            <p className='text-sm mt-1'>
              You save {formatPrice(originalPrice - discountedPrice)}
              <span className='ml-2 bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-md text-xs'>
                20% OFF
              </span>
            </p>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
            <Truck className='w-4 h-4 text-green-600' />
            <span>Free delivery over ₱500</span>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-800 mb-2'>
            <span className='font-bold text-blue-600'>Bethelia Express</span>
            <span>Get it by {getDeliveryDate()}</span>
          </div>
          <div className='flex items-center gap-2 text-xs text-gray-500 mb-4'>
            <Clock className='w-3.5 h-3.5' />
            <span>
              Order within the next{" "}
              <span className='font-semibold text-red-600'>{timeLeft}</span>
            </span>
          </div>

          {/* --- ADDED: Trust Badges Section --- */}
          <div className='my-6 border-t border-b py-3 flex justify-around items-start text-center'>
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className='flex flex-col items-center text-gray-600 w-1/3'
              >
                <badge.icon className='w-6 h-6 mb-1 text-gray-500' />
                <span className='text-xs font-medium'>{badge.text}</span>
              </div>
            ))}
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className='mb-4'>
              <h2 className='text-sm font-semibold mb-2'>
                Available Variations
              </h2>
              <div className='flex flex-wrap gap-2'>
                {product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleVariantSelect(variant)}
                    className={`px-4 py-2 text-sm rounded-lg border ${
                      selectedVariant === variant
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                  >
                    {variant.option1}{" "}
                    {variant.option2 && `- ${variant.option2}`}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Tabs defaultValue='description' className='w-full mb-6'>
            <TabsList className='grid w-full grid-cols-4 h-auto'>
              <TabsTrigger value='description' className='text-xs px-1'>
                Description
              </TabsTrigger>
              <TabsTrigger value='details' className='text-xs px-1'>
                Details
              </TabsTrigger>
              <TabsTrigger value='reviews' className='text-xs px-1'>
                Reviews
              </TabsTrigger>
              <TabsTrigger value='recommendations' className='text-xs px-1'>
                More
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value='description'
              className='mt-4 text-sm text-gray-700 leading-relaxed'
            >
              {product.description || "No description available."}
            </TabsContent>
            <TabsContent value='details' className='mt-4 text-sm'>
              <ul className='space-y-2'>
                {product.sku && (
                  <li className='flex justify-between'>
                    <span>SKU:</span>{" "}
                    <span className='font-medium'>{product.sku}</span>
                  </li>
                )}
                {product.category && (
                  <li className='flex justify-between'>
                    <span>Category:</span>{" "}
                    <span className='font-medium'>{product.category}</span>
                  </li>
                )}
                {product.weight && (
                  <li className='flex justify-between'>
                    <span>Weight:</span>{" "}
                    <span className='font-medium'>{product.weight} kg</span>
                  </li>
                )}
                {product.length && (
                  <li className='flex justify-between'>
                    <span>Dimensions:</span>{" "}
                    <span className='font-medium'>
                      {product.length} x {product.width} x {product.height} cm
                    </span>
                  </li>
                )}
              </ul>
            </TabsContent>
            <TabsContent
              value='reviews'
              className='mt-4 text-sm text-center text-gray-500'
            >
              <div className='flex justify-center items-center gap-1 mb-2'>
                <Star className='w-5 h-5 text-yellow-400' />
                <Star className='w-5 h-5 text-yellow-400' />
                <Star className='w-5 h-5 text-yellow-400' />
                <Star className='w-5 h-5 text-yellow-400' />
                <Star className='w-5 h-5 text-gray-300' />
              </div>
              <p>No reviews yet for this product.</p>
            </TabsContent>
            <TabsContent
              value='recommendations'
              className='mt-4 text-sm text-center text-gray-500'
            >
              <p>Recommendations are not available yet.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 right-0 w-full bg-white border-t'>
        <div className='max-w-md mx-auto p-3 flex items-center gap-3'>
          <div className='flex items-center border rounded-lg'>
            <button
              onClick={() => handleQuantityChange(-1)}
              className='p-3 text-gray-600'
            >
              <Minus className='w-4 h-4' />
            </button>
            <span className='px-4 font-semibold'>{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className='p-3 text-gray-600'
            >
              <Plus className='w-4 h-4' />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={displayStock <= 0}
            className='flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400'
          >
            <ShoppingCart className='w-5 h-5' />
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}

function ProductSkeleton() {
  return (
    <>
      <Header />
      <div className='max-w-md mx-auto p-4'>
        <Skeleton className='h-6 w-1/3 mb-2' />
        <Skeleton className='h-8 w-3/4 mb-4' />
        <Skeleton className='w-full aspect-square rounded-lg mb-4' />
        <Skeleton className='h-10 w-1/2 mb-2' />
        <Skeleton className='h-6 w-1/4 mb-4' />
        <Skeleton className='h-24 w-full' />
      </div>
    </>
  );
}
