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
      // ✅ TEMPORARY LOG: Log the user's UID here
      console.log("SellerProductsPage: Current User UID:", user.uid);

      const fetchProducts = async () => {
        console.log(
          "SellerProductsPage: Starting fetchProducts for user:",
          user.uid
        );
        if (!db) {
          console.error("SellerProductsPage: Firestore DB is not initialized!");
          toast.error("Firebase connection error.");
          setLoading(false);
          return;
        }

        try {
          const productsRef = collection(db, "products");
          // Query to get only the products belonging to the current seller, ordered by creation date
          const q = query(
            productsRef,
            where("sellerId", "==", user.uid),
            orderBy("createdAt", "desc")
          );

          const querySnapshot = await getDocs(q);
          console.log(
            "SellerProductsPage: Fetched products snapshot. Docs found:",
            querySnapshot.docs.length
          );
          const fetchedProducts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(fetchedProducts);
          console.log("SellerProductsPage: Mapped products:", fetchedProducts);
        } catch (error) {
          console.error("SellerProductsPage: Error fetching products:", error);
          toast.error("Failed to load products.");
        } finally {
          setLoading(false);
          console.log("SellerProductsPage: Loading state set to false.");
        }
      };

      fetchProducts();
    } else if (!user) {
      // If there's no user after the auth check, stop loading
      console.log("SellerProductsPage: No user found, stopping loading.");
      setLoading(false);
    }
  }, [user]);

  const handleEditProduct = (product) => {
    // Navigate to a dynamic edit page for the specific product
    router.push(`/seller-dashboard/products/edit/${product.id}`);
  };

  const handleDeleteProduct = async (product) => {
    console.log(
      `SellerProductsPage: Attempting to delete product: ${product.id}`
    );
    if (!db) {
      console.error(
        "SellerProductsPage: Firestore DB is not initialized for delete!"
      );
      toast.error("Firebase connection error. Cannot delete.");
      return;
    }

    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, "products", product.id));
      console.log(
        `SellerProductsPage: Product ${product.id} deleted from Firestore.`
      );

      // Update the local state to remove the product from the UI instantly
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== product.id)
      );
      toast.success(
        `Product "${product.name || product.id}" deleted successfully!`
      );
      console.log("SellerProductsPage: Local state updated after deletion.");
    } catch (error) {
      console.error("SellerProductsPage: Error deleting product:", error);
      toast.error(`Failed to delete product "${product.name || product.id}".`);
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
      <SellerProducts
        products={products}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
}
