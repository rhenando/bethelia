"use client";

import React from "react";

// icon: a React node, e.g. <Boxes ... />
export default function QuickActionCard({
  label,
  icon,
  subtitle,
  href,
  count,
}) {
  return (
    <a
      href={href}
      className='bg-white rounded-xl p-4 flex flex-col gap-2 items-start shadow hover:shadow-md transition w-full'
    >
      <div className='relative'>
        {icon}
        {typeof count === "number" && (
          <span className='absolute -top-2 -right-2 bg-[var(--primary)] text-white text-xs px-2 py-0.5 rounded-full'>
            {count}
          </span>
        )}
      </div>
      <span className='font-bold text-gray-900'>{label}</span>
      <span className='text-xs text-gray-500'>{subtitle}</span>
    </a>
  );
}
