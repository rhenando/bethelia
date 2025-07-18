"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Package, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

function formatPrice(amount) {
  return (
    "₱" + Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })
  );
}

export default function SellerProducts({
  products = [],
  onEditProduct,
  onDeleteProduct,
}) {
  const router = useRouter();

  const handleDelete = (prod) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDeleteProduct?.(prod);
      toast.success(`"${prod.name}" has been deleted.`);
    }
  };

  return (
    <div>
      <h2 className='font-bold text-lg mb-2 flex items-center gap-2'>
        <Package className='w-5 h-5 text-blue-600' />
        Product Listings
      </h2>

      {products.length === 0 ? (
        <div className='flex flex-col items-center py-8 text-gray-400'>
          <Package className='w-14 h-14 mb-2' />
          <p className='font-semibold text-base'>
            You haven't added any products yet.
          </p>
          <p className='text-xs mb-3'>
            Click the button below to add your first product.
          </p>
          <button
            className='mt-6 w-full px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition font-bold'
            onClick={() => router.push("/seller-dashboard/products/add")}
          >
            + Add New Product
          </button>
        </div>
      ) : (
        <>
          <div className='space-y-3'>
            {products.map((prod) => (
              <div
                key={prod.id}
                className='border rounded-lg p-3 flex items-center justify-between gap-3 bg-white shadow-sm'
              >
                <img
                  src={prod.mainImage || "/no-image.jpg"}
                  alt={prod.name}
                  className='w-12 h-12 rounded border bg-gray-50 object-cover'
                  onError={(e) => {
                    e.target.src = "/no-image.jpg";
                  }}
                />
                <div className='flex-1 min-w-0 ml-2'>
                  <div className='font-semibold truncate'>{prod.name}</div>
                  <div className='text-xs text-gray-500'>
                    Stock:{" "}
                    <span
                      className={
                        prod.stock <= 10
                          ? "text-red-600 font-bold"
                          : "text-gray-800"
                      }
                    >
                      {prod.stock}
                    </span>
                    {prod.stock <= 10 && (
                      <span className='ml-1 bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px]'>
                        Low
                      </span>
                    )}
                  </div>
                  <div className='text-xs text-gray-600'>
                    {formatPrice(prod.price)}
                  </div>
                </div>

                <div className='flex flex-col items-end gap-2'>
                  <span
                    className={`flex items-center text-xs px-2 py-1 rounded-full font-semibold ${
                      prod.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {prod.status === "active" ? (
                      <CheckCircle className='w-3.5 h-3.5 mr-1' />
                    ) : (
                      <XCircle className='w-3.5 h-3.5 mr-1' />
                    )}
                    {prod.status}
                  </span>
                  <div className='flex gap-1'>
                    <button
                      className='p-1 text-blue-600 hover:bg-blue-50 rounded'
                      title='Edit'
                      onClick={() => onEditProduct?.(prod)}
                    >
                      <Edit2 className='w-4 h-4' />
                    </button>
                    <button
                      className='p-1 text-red-600 hover:bg-red-50 rounded'
                      title='Delete'
                      onClick={() => handleDelete(prod)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className='mt-6 w-full px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition font-bold'
            onClick={() => router.push("/seller-dashboard/products/add")}
          >
            + Add New Product
          </button>
        </>
      )}
    </div>
  );
}
