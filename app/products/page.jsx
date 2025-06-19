"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link"; // Add this at the top

export default function ProductsPage() {
  const authUser = useSelector((state) => state.auth.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products for current supplier only
  useEffect(() => {
    if (!authUser?.uid) return;
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, "products"),
          where("supplierId", "==", authUser.uid)
        );
        const snap = await getDocs(q);
        const items = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
      } catch (err) {
        // Optionally: show a toast or log
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [authUser]);

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    await deleteDoc(doc(db, "products", id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className='min-h-screen bg-[var(--muted)] p-4 pb-24'>
      <h1 className='text-2xl font-bold mb-6 text-[var(--primary)]'>
        Your Products
      </h1>
      <div className='flex justify-end mb-4'>
        <Link href='/products/add'>
          <Button className='bg-[var(--primary)] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[var(--primary-foreground)] transition'>
            + Add Product
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className='text-center py-10 text-gray-400'>Loading products…</div>
      ) : products.length === 0 ? (
        <div className='text-center py-10 text-gray-500'>
          No products found.
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full text-sm border bg-white rounded-xl overflow-hidden shadow'>
            <thead className='bg-[var(--primary)] text-white'>
              <tr>
                <th className='p-3 text-left'>Image</th>
                <th className='p-3 text-left'>Name</th>
                <th className='p-3 text-left'>Stock</th>
                <th className='p-3 text-left'>Price</th>
                <th className='p-3 text-left'>Status</th>
                <th className='p-3 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className='border-b last:border-b-0 hover:bg-gray-50 transition'
                >
                  <td className='p-3'>
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.productName}
                        className='w-14 h-14 object-cover rounded'
                      />
                    ) : (
                      <div className='w-14 h-14 bg-gray-200 flex items-center justify-center rounded text-gray-400'>
                        N/A
                      </div>
                    )}
                  </td>
                  <td className='p-3 font-semibold'>{p.productName || "–"}</td>
                  <td className='p-3'>{p.stock ?? "–"}</td>
                  <td className='p-3'>
                    {typeof p.price === "number"
                      ? `₱${p.price.toLocaleString()}`
                      : "–"}
                  </td>
                  <td className='p-3 capitalize'>{p.status || "active"}</td>
                  <td className='p-3 flex gap-2'>
                    <Button
                      size='icon'
                      className='bg-[var(--primary)] text-white rounded-full'
                      onClick={() => {
                        // TODO: open your edit modal or page here
                        alert("Edit not implemented yet!");
                      }}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      size='icon'
                      className='bg-red-100 text-red-600 rounded-full'
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
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
