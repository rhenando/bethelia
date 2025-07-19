// /app/products/page.jsx
// This is a client component as it uses useState, useEffect, etc.
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  orderBy,
  // 'where' and 'doc' are not needed for an "all products" page
  // where,
  // doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // Make sure this path is correct for your Firebase instance
import { toast } from "sonner"; // For user notifications (e.g., from shadcn/ui)
import { Loader2 } from "lucide-react"; // For a loading spinner icon

// Import your ProductGrid component
// ✅ Double-check this path to ensure it correctly points to your ProductGrid.jsx file
import ProductGrid from "@/components/ProductGrid";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      // --- Start Debugging Logs ---
      console.log("AllProductsPage: Starting fetchAllProducts...");
      // Optional: Check if db is initialized. This is a common point of failure.
      if (!db) {
        console.error(
          "AllProductsPage: Firestore DB is not initialized! Check '@/lib/firebase'."
        );
        toast.error("Firebase connection error. Please check your setup.");
        setLoading(false);
        return; // Exit if db is not available
      }
      // --- End Debugging Logs ---

      try {
        const productsRef = collection(db, "products");
        console.log("AllProductsPage: Products collection reference created.");

        // Construct the query to get ALL products.
        // We order by 'createdAt' in descending order to show newest products first.
        // Ensure 'createdAt' field exists in your Firestore documents and is a Firestore Timestamp.
        const q = query(productsRef, orderBy("createdAt", "desc"));
        console.log(
          "AllProductsPage: Firestore query constructed (orderBy createdAt desc)."
        );

        // Execute the query to get documents
        const querySnapshot = await getDocs(q);
        console.log("AllProductsPage: Firestore query snapshot received.");
        console.log(
          "AllProductsPage: Number of documents in snapshot:",
          querySnapshot.docs.length
        );

        // Map the documents to a more usable array of product objects
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID
          ...doc.data(), // Spread all other fields from the document
        }));

        // --- Start Debugging Logs ---
        console.log("AllProductsPage: Mapped products data:", fetchedProducts);
        // --- End Debugging Logs ---

        setProducts(fetchedProducts); // Update state with fetched products
      } catch (error) {
        // Catch any errors during the fetch operation
        console.error("AllProductsPage: Error fetching all products:", error);
        toast.error("Failed to load products. Check console for details.");
      } finally {
        // Always set loading to false once the operation completes (success or failure)
        setLoading(false);
        console.log("AllProductsPage: Loading state set to false.");
      }
    };

    // Call the fetch function when the component mounts
    fetchAllProducts();
  }, []); // Empty dependency array means this useEffect runs only once after the initial render

  // Render loading state while data is being fetched
  if (loading) {
    return (
      <div className='flex justify-center items-center h-48'>
        <Loader2 className='w-8 h-8 animate-spin text-gray-400' />
      </div>
    );
  }

  // Render the ProductGrid component, passing the fetched products and loading status
  // ProductGrid is designed to handle the 'No products found' message if the array is empty
  return (
    <div className='container mx-auto px-4 py-6'>
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
