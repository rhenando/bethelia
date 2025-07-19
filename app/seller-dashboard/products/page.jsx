// /app/seller-dashboard/products/page.jsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SellerProducts from "@/components/seller/SellerProducts";

export default function SellerProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products only when the user object is available
    if (user && user.uid) {
      const fetchProducts = async () => {
        try {
          const productsRef = collection(db, "products");
          // Query to get only the products belonging to the current seller, ordered by creation date
          const q = query(
            productsRef,
            where("sellerId", "==", user.uid),
            orderBy("createdAt", "desc")
          );

          const querySnapshot = await getDocs(q);
          const fetchedProducts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(fetchedProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
          toast.error("Failed to load products.");
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    } else if (!user) {
      // If there's no user after the auth check, stop loading
      setLoading(false);
    }
  }, [user]);

  const handleEditProduct = (product) => {
    // Navigate to a dynamic edit page for the specific product
    router.push(`/seller-dashboard/products/edit/${product.id}`);
  };

  const handleDeleteProduct = async (product) => {
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, "products", product.id));
      // Update the local state to remove the product from the UI instantly
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== product.id)
      );
      // The success toast is already handled inside the SellerProducts component
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-48'>
        <Loader2 className='w-8 h-8 animate-spin text-gray-400' />
      </div>
    );
  }

  return (
    <div>
      {/* This is where your component is used.
        This parent page handles all the logic and passes the results down.
      */}
      <SellerProducts
        products={products}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
}
