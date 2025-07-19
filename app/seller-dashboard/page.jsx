"use client";

export default function SellerDashboardPage() {
  // Fetch any seller dashboard stats here if needed
  return (
    <div>
      <h2 className='font-bold text-lg mb-2'>Seller Overview</h2>

      {/* Seller summary cards, stats, charts, etc */}
      <div className='grid grid-cols-2 gap-4 mb-5'>
        {/* Example cards */}
        <div className='p-4 bg-yellow-50 rounded-lg'>
          <div className='text-xs text-gray-600 mb-1'>Products Listed</div>
          <div className='text-2xl font-bold text-yellow-600'>12</div>
        </div>

        <div className='p-4 bg-red-50 rounded-lg'>
          <div className='text-xs text-gray-600 mb-1'>Orders Received</div>
          <div className='text-2xl font-bold text-red-600'>34</div>
        </div>

        <div className='p-4 bg-blue-50 rounded-lg col-span-2 flex items-center justify-between gap-3'>
          <div>
            <div className='text-xs text-gray-600 mb-1'>Total Revenue</div>
            <div className='text-2xl font-bold text-blue-700'>₱52,500.00</div>
          </div>
        </div>
      </div>
    </div>
  );
}
