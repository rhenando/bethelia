// src/pages/Home.tsx
import CategoryNav from "@/components/home/CategoryNav";
import HeroCarousel from "@/components/home/HeroCarousel";
import FlashDeals from "@/components/home/FlashDeals";
import CategoryIcons from "@/components/home/CategoryIcons";
import TrendingProducts from "@/components/home/TrendingProducts";
import TrustBanner from "@/components/home/TrustBanner";

export default function Home() {
  return (
    <div className='bg-gray-50 min-h-screen'>
      <CategoryNav />
      <HeroCarousel />
      <FlashDeals />
      <CategoryIcons />
      <TrendingProducts />
      <TrustBanner />
    </div>
  );
}
