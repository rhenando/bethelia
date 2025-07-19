// /components/homepage/CategoriesMarquee.jsx
"use client"; // This component needs to be a client component to use hooks

import React, { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase"; // ✅ Make sure this path is correct for your Firebase instance
import { toast } from "sonner"; // For user notifications
import { Skeleton } from "@/components/ui/skeleton"; // ✅ Make sure this path is correct
import { Loader2 } from "lucide-react"; // For a loading spinner icon if needed for initial fetch

export default function CategoriesMarquee() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Manage loading state internally

  useEffect(() => {
    const fetchCategories = async () => {
      console.log("CategoriesMarquee: Starting fetchCategories...");
      if (!db) {
        console.error(
          "CategoriesMarquee: Firestore DB is not initialized! Check '@/lib/firebase'."
        );
        toast.error("Firebase connection error for categories.");
        setIsLoading(false);
        return;
      }

      try {
        const categoriesRef = collection(db, "categories");
        console.log(
          "CategoriesMarquee: Categories collection reference created."
        );

        // Query to get all categories. You might want to add orderBy if you have a specific sort order.
        // For example: orderBy("name", "asc") if categories have a 'name' field and you want to sort them.
        const q = query(categoriesRef, orderBy("name", "asc")); // Assuming categories have a 'name' field

        const querySnapshot = await getDocs(q);
        console.log("CategoriesMarquee: Firestore query snapshot received.");
        console.log(
          "CategoriesMarquee: Number of documents in snapshot:",
          querySnapshot.docs.length
        );

        const fetchedCategories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(
          "CategoriesMarquee: Mapped categories data:",
          fetchedCategories
        );
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("CategoriesMarquee: Error fetching categories:", error);
        toast.error("Failed to load categories.");
      } finally {
        setIsLoading(false);
        console.log("CategoriesMarquee: Loading state set to false.");
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount

  // Duplicate the categories for looping marquee effect
  const allCats = [...categories, ...categories];

  return (
    <div className='relative w-full overflow-x-hidden py-2 px-0'>
      <div
        className='flex gap-4 whitespace-nowrap animate-marquee'
        style={{ animation: "marquee 28s linear infinite" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.animationPlayState = "paused")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.animationPlayState = "running")
        }
      >
        {/* Render skeletons if loading or no categories found */}
        {isLoading || allCats.length === 0
          ? Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className='flex flex-col items-center min-w-[60px] max-w-[80px]'
              >
                <Skeleton className='w-12 h-12 rounded-full mb-1' />
                <Skeleton className='w-14 h-4' />
              </div>
            ))
          : // Render actual categories once loaded
            allCats.map((cat, idx) => (
              <div
                key={(cat.id || cat.name || "cat") + "-" + idx} // Unique key for each category item
                className='flex flex-col items-center min-w-[60px] max-w-[80px]'
              >
                <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1'>
                  <img
                    src={
                      cat.icon || cat.imageUrl || "/placeholder-category.png"
                    }
                    alt={cat.name || "Category"} // Alt text for accessibility
                    className='h-7 w-7 object-contain'
                    onError={(e) =>
                      (e.currentTarget.src = "/placeholder-category.png")
                    }
                  />
                </div>
                <span className='text-xs font-medium text-gray-700 text-center truncate max-w-[4.5rem]'>
                  {cat.name || "Unnamed"}
                </span>
              </div>
            ))}
      </div>

      {/* Marquee animation CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
