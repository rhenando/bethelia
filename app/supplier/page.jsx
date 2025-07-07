"use client";

export default function SupplierDashboardPage() {
  // Fetch any dashboard stats here if you want
  return (
    <div>
      <h2 className='font-bold text-lg mb-2'>Overview</h2>
      {/* Put your summary cards, stats, charts, etc here */}
      <div className='grid grid-cols-2 gap-4 mb-5'>
        {/* Example cards */}
        <div className='p-4 bg-blue-50 rounded-lg'>
          <div className='text-xs text-gray-600 mb-1'>Active Products</div>
          <div className='text-2xl font-bold text-blue-700'>2</div>
        </div>
        <div className='p-4 bg-green-50 rounded-lg'>
          <div className='text-xs text-gray-600 mb-1'>Orders</div>
          <div className='text-2xl font-bold text-green-700'>2</div>
        </div>
        <div className='p-4 bg-purple-50 rounded-lg col-span-2 flex items-center justify-between gap-3'>
          <div>
            <div className='text-xs text-gray-600 mb-1 flex items-center gap-1'>
              {/* Some icon here */}
              Total Earnings
            </div>
            <div className='text-2xl font-bold text-purple-700'>₱7,500.00</div>
          </div>
        </div>
      </div>
    </div>
  );
}
