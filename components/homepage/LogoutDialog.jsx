"use client";

import React from "react";

export default function LogoutDialog({ onConfirm, onCancel }) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full'>
        <p className='text-gray-800 text-center mb-4'>
          Logging out as a Buyer and Redirecting to Seller Login Page...
        </p>
        <div className='flex justify-center gap-4'>
          <button
            onClick={onConfirm}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
          >
            OK
          </button>
          <button
            onClick={onCancel}
            className='bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
