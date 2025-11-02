// src/components/home/TrustBanner.tsx
import { Truck, CreditCard, ShieldCheck } from "lucide-react";

export default function TrustBanner() {
  const items = [
    {
      icon: <Truck size={22} />,
      title: "Free Shipping",
      desc: "On orders ₱999 and up",
    },
    {
      icon: <CreditCard size={22} />,
      title: "Cash on Delivery",
      desc: "Available nationwide",
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Trusted by Pinoys",
      desc: "Secure checkout guaranteed",
    },
  ];

  return (
    <div className='bg-white border-t py-8 mt-10'>
      <div className='container mx-auto flex flex-wrap justify-center gap-10 text-center'>
        {items.map((item) => (
          <div key={item.title} className='flex flex-col items-center max-w-xs'>
            <div className='bg-[#2980b9]/10 text-[#2980b9] w-12 h-12 flex items-center justify-center rounded-full mb-3'>
              {item.icon}
            </div>
            <h4 className='font-semibold text-gray-800'>{item.title}</h4>
            <p className='text-gray-500 text-sm'>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
