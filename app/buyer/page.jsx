"use client";

export default function BuyerDashboardPage() {
  // Fetch any buyer dashboard stats here if you want
  return (
    <div>
      <h2 className='font-bold text-lg mb-2'>Overview</h2>
      {/* Buyer summary cards, stats, charts, etc */}
      <div className='grid grid-cols-2 gap-4 mb-5'>
        {/* Example cards */}
        <div className='p-4 bg-blue-50 rounded-lg'>
          <div className='text-xs text-gray-600 mb-1'>Saved Products</div>
          <div className='text-2xl font-bold text-blue-700'>3</div>
        </div>
        <div className='p-4 bg-green-50 rounded-lg'>
          <div className='text-xs text-gray-600 mb-1'>Orders Placed</div>
          <div className='text-2xl font-bold text-green-700'>5</div>
        </div>
        <div className='p-4 bg-purple-50 rounded-lg col-span-2 flex items-center justify-between gap-3'>
          <div>
            <div className='text-xs text-gray-600 mb-1 flex items-center gap-1'>
              {/* Optional: icon */}
              Total Spent
            </div>
            <div className='text-2xl font-bold text-purple-700'>₱12,800.00</div>
          </div>
        </div>
      </div>
    </div>
  );
}
