// app/product/[productId]/page.jsx
"use client"; // This component needs to be a client component to use hooks

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions for single document fetch
import { db } from "@/lib/firebase"; // Make sure this path is correct for your Firebase instance
import { toast } from "sonner"; // For user notifications
import { Loader2 } from "lucide-react"; // For loading spinner icon
import { useParams } from "next/navigation"; // ✅ Import useParams for App Router

export default function ProductDetailsPage() {
  // useParams hook to get dynamic route segments (e.g., productId)
  const params = useParams();
  const productId = params.productId; // Get the productId from the URL

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setLoading(false);
        setError("Product ID is missing.");
        return;
      }

      console.log(
        `ProductDetailsPage: Attempting to fetch product with ID: ${productId}`
      );
      if (!db) {
        console.error(
          "ProductDetailsPage: Firestore DB is not initialized! Check '@/lib/firebase'."
        );
        toast.error("Firebase connection error.");
        setLoading(false);
        return;
      }

      try {
        const productRef = doc(db, "products", productId); // Create a reference to the specific product document
        const productSnap = await getDoc(productRef); // Fetch the document snapshot

        if (productSnap.exists()) {
          // If the document exists, set the product data
          const fetchedProduct = { id: productSnap.id, ...productSnap.data() };
          setProduct(fetchedProduct);
          console.log(
            "ProductDetailsPage: Fetched product data:",
            fetchedProduct
          );
        } else {
          // Document does not exist
          console.log(
            `ProductDetailsPage: No such product found with ID: ${productId}`
          );
          setError("Product not found.");
          toast.error("Product not found.");
        }
      } catch (err) {
        // Handle any errors during fetching
        console.error(
          "ProductDetailsPage: Error fetching product details:",
          err
        );
        setError("Failed to load product details.");
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false); // Always set loading to false when done
      }
    };

    fetchProductDetails();
  }, [productId]); // Re-run effect if productId changes

  // --- Render Logic ---

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='w-10 h-10 animate-spin text-gray-400' />
        <p className='ml-2 text-gray-600'>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen text-red-600'>
        <p className='text-lg font-semibold'>Error: {error}</p>
        <p className='text-sm text-gray-500 mt-2'>
          Please try again later or check the product ID.
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen text-gray-500'>
        <p className='text-lg font-semibold'>Product not available.</p>
        <p className='text-sm mt-2'>
          The product you are looking for might not exist or has been removed.
        </p>
      </div>
    );
  }

  // Render product details once data is loaded
  return (
    <div className='max-w-md mx-auto bg-white min-h-screen p-4'>
      <h1 className='text-2xl font-bold mb-4'>{product.name}</h1>

      {/* Main Image */}
      <div className='w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center'>
        <img
          src={
            product.mainImage ||
            product.images?.[0] ||
            "/placeholder-product.png"
          }
          alt={product.name || "Product Image"}
          className='w-full h-full object-cover'
          onError={(e) => (e.currentTarget.src = "/placeholder-product.png")}
        />
      </div>

      {/* Price */}
      <div className='text-green-700 font-bold text-3xl mb-4'>
        ₱{product.price ?? "N/A"}
      </div>

      {/* Static Sale and Sold Indicators (as per ProductGrid) */}
      <div className='flex flex-col items-start text-sm mb-4'>
        <span className='text-primary py-0.5 font-bold mb-0.5'>
          Sale | ₱20 off
        </span>
        <span className='text-gray-500'>
          Sold: <span className='font-semibold'>50+</span>
        </span>
      </div>

      {/* Description */}
      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Description</h2>
        <p className='text-gray-700 leading-relaxed'>
          {product.description || "No description available."}
        </p>
      </div>

      {/* Category */}
      {product.category && (
        <div className='mb-4'>
          <h2 className='text-lg font-semibold mb-2'>Category</h2>
          <span className='bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full'>
            {product.category}
          </span>
        </div>
      )}

      {/* Other details (example: SKU, Stock) */}
      <div className='grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4'>
        {product.sku && (
          <div>
            <span className='font-semibold'>SKU:</span> {product.sku}
          </div>
        )}
        {typeof product.stock === "number" && (
          <div>
            <span className='font-semibold'>Stock:</span> {product.stock} units
          </div>
        )}
      </div>

      {/* You can add more details here like barcode, dimensions, tags, variants, etc. */}
      {/* Example:
      {product.barcode && (
        <div className='text-sm text-gray-700 mb-2'>
          <span className='font-semibold'>Barcode:</span> {product.barcode}
        </div>
      )}
      */}

      {/* Back button or Add to Cart button can go here */}
      <div className='mt-6 flex justify-center'>
        <button className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
