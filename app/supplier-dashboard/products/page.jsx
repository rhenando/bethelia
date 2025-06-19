"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SupplierProductsPage() {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const variantList = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const productId = doc.id;

          data.variants?.forEach((variant, idx) => {
            variantList.push({
              productId,
              name: data.name,
              description: data.description,
              variantIndex: idx + 1,
              ...variant,
            });
          });
        });

        setVariants(variantList);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-800'>
          My Product Variants
        </h2>
        <Link
          href='/supplier-dashboard/products/new'
          className='inline-flex items-center px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary-dark'
        >
          <PlusCircle className='h-5 w-5 mr-2' />
          Add New Product
        </Link>
      </div>

      <div className='bg-white rounded shadow overflow-x-auto'>
        {loading ? (
          <p className='p-4'>Loading...</p>
        ) : (
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                  Product
                </th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                  SKU
                </th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                  Attributes
                </th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                  Price
                </th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                  Stock
                </th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                  Image
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {variants.map((v, i) => (
                <tr key={`${v.productId}-${i}`}>
                  <td className='px-4 py-2 text-sm'>{v.name}</td>
                  <td className='px-4 py-2 text-sm'>{v.sku}</td>
                  <td className='px-4 py-2 text-sm'>
                    {Object.entries(v.attributes || {}).map(([key, val]) => (
                      <div key={key}>
                        <strong>{key}</strong>: {val}
                      </div>
                    ))}
                  </td>
                  <td className='px-4 py-2 text-sm'>
                    ₱{parseFloat(v.price).toFixed(2)}
                  </td>
                  <td className='px-4 py-2 text-sm'>{v.stock}</td>
                  <td className='px-4 py-2 text-sm'>
                    {v.imageUrl ? (
                      <img
                        src={v.imageUrl}
                        alt='Variant'
                        className='h-12 w-12 object-cover rounded'
                      />
                    ) : (
                      <span className='text-gray-400'>No image</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
