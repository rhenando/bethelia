import React from "react";

export default function CategoriesMarquee({ categories = [] }) {
  const allCats = [...categories, ...categories]; // duplicate for looping

  return (
    <div className='relative w-full overflow-x-hidden py-2 px-0'>
      <div
        className='flex gap-4 whitespace-nowrap animate-marquee'
        style={{ animation: "marquee 28s linear infinite" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.animationPlayState = "paused")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.animationPlayState = "running")
        }
      >
        {allCats.map((cat, idx) => (
          <div
            key={(cat.id || cat.name || "cat") + "-" + idx}
            className='flex flex-col items-center min-w-[60px] max-w-[80px]'
          >
            <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1'>
              <img
                src={cat.icon || cat.imageUrl || "/placeholder-category.png"}
                alt={cat.name}
                className='h-7 w-7 object-contain'
                onError={(e) => (e.target.src = "/placeholder-category.png")}
              />
            </div>
            <span className='text-xs font-medium text-gray-700 text-center truncate max-w-[4.5rem]'>
              {cat.name || "Unnamed"}
            </span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
