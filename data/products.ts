// ✅ Define a reusable Product type
export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  supplier: string;
  category: string;
  rating: number;
  variants?: ("flash-deal" | "trending")[];
  discount?: number;
  oldPrice?: number;
};

// ✅ Use the Product[] type for your array
export const products: Product[] = [
  {
    id: 1,
    name: "JBL Wave Buds True Wireless Earbuds",
    price: 2549,
    image: "https://images.pexels.com/photos/3394656/pexels-photo-3394656.jpeg",
    description:
      "Compact wireless earbuds with pure bass sound and up to 32 hours of playtime — perfect for travel and workouts.",
    supplier: "JBL Philippines",
    category: "Electronics",
    rating: 4.6,
    variants: ["flash-deal", "trending"],
    discount: 20,
  },
  {
    id: 2,
    name: "Xiaomi Smart Band 8 Pro",
    price: 3799,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    description:
      "Track your health, workouts, and sleep patterns with a stunning AMOLED display — fitness redefined for every lifestyle.",
    supplier: "Xiaomi Store PH",
    category: "Wearables",
    rating: 4.8,
    variants: ["flash-deal", "trending"],
    discount: 20,
  },
  {
    id: 3,
    name: "Xiaomi A27UI 27″ 4K IPS LED Monitor",
    price: 14513,
    image: "https://images.pexels.com/photos/4792735/pexels-photo-4792735.jpeg",
    description:
      "27-inch 4K display with accurate colors and thin bezels — ideal for professionals, designers, and gamers.",
    supplier: "Xiaomi Authorized PH",
    category: "Electronics",
    rating: 4.7,
    variants: ["flash-deal", "trending"],
    discount: 20,
  },
  {
    id: 4,
    name: "Philips 3000 Series Blender 1L",
    price: 1935,
    image: "https://images.pexels.com/photos/376455/pexels-photo-376455.jpeg",
    description:
      "Durable 1-liter blender with 4 stainless steel blades — perfect for daily smoothie and kitchen prep needs.",
    supplier: "Philips Appliances PH",
    category: "Home & Kitchen",
    rating: 4.8,
    variants: ["flash-deal", "trending"],
    discount: 20,
  },
  {
    id: 5,
    name: "Maybelline Instant Coverage Duo Set",
    price: 668,
    image: "https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg",
    description:
      "Includes foundation and concealer for smooth, flawless coverage — trusted by makeup lovers across the Philippines.",
    supplier: "Watsons PH",
    category: "Beauty & Skincare",
    rating: 5.0,
    variants: ["flash-deal", "trending"],
    discount: 20,
  },
  {
    id: 6,
    name: "On Cloudmonster Running Shoes",
    price: 9690,
    image: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg",
    description:
      "Lightweight running shoes built for comfort and power — ideal for long-distance runs or daily training.",
    supplier: "On Running PH",
    category: "Fashion & Sportswear",
    rating: 4.7,
    variants: ["flash-deal", "trending"],
    discount: 20,
  },
  {
    id: 7,
    name: "Philippine Exotica Civet Blend Coffee 100g",
    price: 709,
    image: "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg",
    description:
      "Premium locally sourced civet coffee beans — smooth, aromatic, and proudly Philippine-made.",
    supplier: "Lazada PH",
    category: "Food & Beverages",
    rating: 4.9,
    variants: ["flash-deal", "trending"],
    discount: 20,
  },
  {
    id: 8,
    name: "7D Dried Mangorind Snack Pack",
    price: 95,
    image: "https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg",
    description:
      "Famous Cebu delicacy made from sweet mango and tamarind — a perfect mix of tangy and tropical flavor.",
    supplier: "7D Foods PH",
    category: "Food & Beverages",
    rating: 4.8,
    variants: ["flash-deal", "trending"],
    discount: 20,
  },
  {
    id: 9,
    name: "Dyson Cool AM07 Tower Fan",
    price: 29900,
    image: "https://images.pexels.com/photos/4792479/pexels-photo-4792479.jpeg",
    description:
      "Powerful yet quiet bladeless tower fan with 10 precise airflow settings — ideal for cooling your home efficiently.",
    supplier: "Dyson Philippines",
    category: "Home Appliances",
    rating: 4.9,
    variants: [],
    discount: 0,
  },
  {
    id: 10,
    name: "Bench Everyday Body Spray for Men",
    price: 199,
    image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg",
    description:
      "A refreshing daily body spray with a clean, masculine scent — trusted by Filipino men for all-day freshness.",
    supplier: "Bench PH",
    category: "Personal Care",
    rating: 4.6,
    variants: ["flash-deal", "trending"],
    discount: 20,
  },
];
