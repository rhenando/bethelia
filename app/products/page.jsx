"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function ProductsPage() {
  const authUser = useSelector((state) => state.auth.user);
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Protect page
  useEffect(() => {
    if (!authUser) {
      router.replace("/login");
    }
  }, [authUser, router]);

  // Fetch products
  useEffect(() => {
    if (!authUser?.uid) return;

    setLoading(true);

    // Use "supplierId" or "ownerId" depending on your schema
    const q = query(
      collection(db, "products"),
      where("supplierId", "==", authUser.uid),
      orderBy("createdAt", "desc")
    );

    getDocs(q)
      .then((snap) => {
        const results = [];
        snap.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        setProducts(results);
      })
      .finally(() => setLoading(false));
  }, [authUser]);

  if (!authUser) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <span className='text-gray-400'>Redirecting to login…</span>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>My Products</h1>
      {loading ? (
        <div className='py-10 text-center text-gray-400'>Loading products…</div>
      ) : products.length === 0 ? (
        <div className='py-10 text-center text-gray-400'>
          You haven’t added any products yet.
        </div>
      ) : (
        <div className='overflow-x-auto rounded-xl shadow bg-white'>
          <table className='min-w-full divide-y'>
            <thead>
              <tr className='bg-[var(--muted)] text-gray-700 text-left'>
                <th className='px-4 py-2 font-semibold'>Product Name</th>
                <th className='px-4 py-2 font-semibold'>Price</th>
                <th className='px-4 py-2 font-semibold'>Created</th>
                {/* Add more columns as needed */}
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className='border-t hover:bg-gray-50'>
                  <td className='px-4 py-2'>
                    {prod.name || (
                      <span className='italic text-gray-400'>Untitled</span>
                    )}
                  </td>
                  <td className='px-4 py-2'>
                    {prod.price ? (
                      `₱ ${prod.price}`
                    ) : (
                      <span className='italic text-gray-400'>N/A</span>
                    )}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-500'>
                    {prod.createdAt?.toDate
                      ? prod.createdAt.toDate().toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
