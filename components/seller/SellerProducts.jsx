// /components/seller/SellerProducts.jsx
"use client"; // This component needs to be a client component to use hooks and state

import React, { useState } from "react"; // ✅ Import useState
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Package, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is already configured
// ✅ Import Shadcn UI AlertDialog components and Button
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function formatPrice(amount) {
  return (
    "₱" + Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })
  );
}

export default function SellerProducts({
  products = [], // Array of products passed from the parent page
  onEditProduct, // Function to handle editing a product, passed from parent
  onDeleteProduct, // Function to handle deleting a product, passed from parent
}) {
  const router = useRouter();
  // State to manage the open/close of the AlertDialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // State to store the product currently being considered for deletion
  const [productToDelete, setProductToDelete] = useState(null);

  /**
   * Opens the delete confirmation dialog and sets the product to be deleted.
   * This function is called when the delete icon/button for a specific product is clicked.
   * @param {Object} prod - The product object to be deleted.
   */
  const confirmDelete = (prod) => {
    setProductToDelete(prod); // Store the product in state
    setIsDeleteDialogOpen(true); // Open the AlertDialog
  };

  /**
   * Executes the deletion process after the user confirms in the dialog.
   * This function is called when the "Delete" button inside the AlertDialog is clicked.
   */
  const executeDelete = () => {
    if (productToDelete) {
      // Call the onDeleteProduct prop function, which is provided by the parent (SellerProductsPage)
      // This is where the actual Firestore delete operation happens.
      onDeleteProduct?.(productToDelete);
      // The success/error toast is now handled by the parent's onDeleteProduct (SellerProductsPage)

      // Reset the state to close the dialog and clear the product for deletion
      setProductToDelete(null);
      setIsDeleteDialogOpen(false);
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
          <button // This button is fine as a standard HTML button
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
                    {/* Shadcn Button for Edit action */}
                    <Button
                      variant='ghost' // Subtle background
                      size='icon' // Small, square for icon
                      title='Edit'
                      onClick={() => onEditProduct?.(prod)}
                    >
                      <Edit2 className='w-4 h-4' />
                    </Button>
                    {/* Shadcn Button for Delete action, triggers custom confirmation */}
                    <Button
                      variant='ghost'
                      size='icon'
                      title='Delete'
                      onClick={() => confirmDelete(prod)} // ✅ This calls the function to open the AlertDialog
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button // This button is fine as a standard HTML button
            className='mt-6 w-full px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition font-bold'
            onClick={() => router.push("/seller-dashboard/products/add")}
          >
            + Add New Product
          </button>
        </>
      )}

      {/* ✅ Shadcn UI AlertDialog component for delete confirmation */}
      {/* 'open' prop controls visibility based on state, 'onOpenChange' updates state when dialog is closed */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product
              {/* Dynamically display the product's name in the confirmation message */}
              <span className='font-semibold text-gray-900'>
                {" "}
                "{productToDelete?.name || "this product"}"
              </span>
              from your listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete} // ✅ This calls the function to proceed with the deletion
              className='bg-red-500 hover:bg-red-600 text-white' // Styling for the delete button
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
