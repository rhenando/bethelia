"use client";

import React, { useEffect, useRef } from "react";

import * as echarts from "echarts";

import HeroSlider from "@/components/homepage/HeroSlider";
import CategoriesCarousel from "@/components/homepage/CategoriesCarousel";
import FeaturedProducts from "@/components/homepage/FeaturedProducts";
import VerifiedSuppliers from "@/components/homepage/VerifiedSuppliers";
import TradeServices from "@/components/homepage/TradeServices";
import BusinessInsights from "@/components/homepage/BusinessInsights";

const App = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chart.setOption({
      animation: false,
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { data: ["Orders", "Revenue"] },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: {
        type: "category",
        data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "Orders",
          type: "bar",
          data: [320, 332, 301, 334, 390, 330],
          color: "#4f46e5",
        },
        {
          name: "Revenue",
          type: "line",
          data: [820, 932, 901, 934, 1290, 1330],
          color: "#10b981",
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const categories = [
    {
      id: 1,
      name: "Electronics",
      description: "Computers, smartphones, and accessories",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20electronic%20devices%20including%20smartphones%2C%20laptops%2C%20and%20gadgets%20arranged%20neatly%20on%20a%20clean%20white%20surface%20with%20soft%20shadows%2C%20professional%20product%20photography%20with%20clean%20background%20and%20soft%20lighting&width=300&height=200&seq=cat1&orientation=landscape",
      count: 12458,
    },
    {
      id: 2,
      name: "Machinery",
      description: "Industrial equipment and machinery",
      image:
        "https://readdy.ai/api/search-image?query=Industrial%20machinery%20and%20equipment%20in%20a%20modern%20factory%20setting%20with%20clean%20environment%2C%20professional%20product%20photography%20with%20consistent%20white%20background%20and%20soft%20lighting%2C%20detailed%20view%20of%20precision%20engineering&width=300&height=200&seq=cat2&orientation=landscape",
      count: 8765,
    },
    {
      id: 3,
      name: "Apparel",
      description: "Clothing, textiles, and fashion accessories",
      image:
        "https://readdy.ai/api/search-image?query=Stylish%20clothing%20and%20fashion%20accessories%20neatly%20arranged%20on%20a%20minimalist%20white%20surface%2C%20professional%20product%20photography%20with%20clean%20background%20and%20soft%20lighting%2C%20showing%20fabric%20textures%20and%20details&width=300&height=200&seq=cat3&orientation=landscape",
      count: 15689,
    },
    {
      id: 4,
      name: "Home & Garden",
      description: "Furniture, decor, and garden supplies",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20home%20furniture%20and%20elegant%20garden%20accessories%20arranged%20in%20a%20minimalist%20setting%20with%20soft%20natural%20lighting%2C%20professional%20product%20photography%20with%20clean%20white%20background%20showing%20texture%20details&width=300&height=200&seq=cat4&orientation=landscape",
      count: 9432,
    },
    {
      id: 5,
      name: "Automotive",
      description: "Auto parts, accessories, and vehicles",
      image:
        "https://readdy.ai/api/search-image?query=Automotive%20parts%20and%20accessories%20professionally%20arranged%20on%20a%20clean%20white%20surface%20with%20soft%20shadows%2C%20detailed%20product%20photography%20showing%20precision%20engineering%20and%20metallic%20textures&width=300&height=200&seq=cat5&orientation=landscape",
      count: 7621,
    },
    {
      id: 6,
      name: "Beauty & Personal Care",
      description: "Cosmetics, skincare, and personal hygiene",
      image:
        "https://readdy.ai/api/search-image?query=Luxury%20beauty%20products%20and%20personal%20care%20items%20elegantly%20arranged%20on%20a%20minimalist%20white%20surface%20with%20soft%20shadows%2C%20professional%20product%20photography%20with%20clean%20background%20and%20soft%20lighting&width=300&height=200&seq=cat6&orientation=landscape",
      count: 11234,
    },
    {
      id: 7,
      name: "Sports & Outdoors",
      description: "Sports equipment and outdoor gear",
      image:
        "https://readdy.ai/api/search-image?query=High%20quality%20sports%20equipment%20and%20outdoor%20gear%20arranged%20on%20a%20clean%20white%20surface%20with%20soft%20natural%20lighting%2C%20professional%20product%20photography%20showing%20materials%20and%20textures%20in%20detail&width=300&height=200&seq=cat7&orientation=landscape",
      count: 6543,
    },
    {
      id: 8,
      name: "Health & Medical",
      description: "Medical supplies and healthcare products",
      image:
        "https://readdy.ai/api/search-image?query=Medical%20equipment%20and%20healthcare%20products%20neatly%20arranged%20on%20a%20clean%20white%20surface%20with%20soft%20clinical%20lighting%2C%20professional%20product%20photography%20showing%20precision%20instruments%20and%20packaging&width=300&height=200&seq=cat8&orientation=landscape",
      count: 5432,
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Earbuds",
      description: "Premium quality wireless earbuds with noise cancellation",
      price: "$15.50 - $25.99",
      minOrder: "500 Pieces",
      rating: 4.8,
      image:
        "https://readdy.ai/api/search-image?query=Modern%20wireless%20bluetooth%20earbuds%20with%20charging%20case%20on%20clean%20white%20background%2C%20professional%20product%20photography%20with%20soft%20shadows%20and%20detailed%20view%20of%20sleek%20design%20and%20premium%20finish&width=250&height=250&seq=prod1&orientation=squarish",
    },
    {
      id: 2,
      name: "Industrial CNC Machine",
      description: "High-precision CNC milling machine for manufacturing",
      price: "$8,500.00 - $12,000.00",
      minOrder: "1 Set",
      rating: 4.9,
      image:
        "https://readdy.ai/api/search-image?query=Industrial%20CNC%20milling%20machine%20with%20precision%20components%20on%20clean%20white%20background%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20detailed%20engineering%20and%20metallic%20finish&width=250&height=250&seq=prod2&orientation=squarish",
    },
    {
      id: 3,
      name: "Solar Power Generator",
      description: "Portable solar power station with multiple outputs",
      price: "$120.00 - $350.00",
      minOrder: "50 Units",
      rating: 4.7,
      image:
        "https://readdy.ai/api/search-image?query=Portable%20solar%20power%20generator%20with%20multiple%20outputs%20and%20sleek%20design%20on%20clean%20white%20background%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20detailed%20features%20and%20modern%20finish&width=250&height=250&seq=prod3&orientation=squarish",
    },
    {
      id: 4,
      name: "Smart Home Security System",
      description: "Comprehensive security system with cameras and sensors",
      price: "$85.00 - $199.00",
      minOrder: "100 Sets",
      rating: 4.6,
      image:
        "https://readdy.ai/api/search-image?query=Modern%20smart%20home%20security%20system%20with%20cameras%20and%20sensors%20on%20clean%20white%20background%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20detailed%20components%20and%20sleek%20design&width=250&height=250&seq=prod4&orientation=squarish",
    },
    {
      id: 5,
      name: "Electric Scooter",
      description: "Foldable electric scooter with long battery life",
      price: "$280.00 - $450.00",
      minOrder: "50 Units",
      rating: 4.5,
      image:
        "https://readdy.ai/api/search-image?query=Modern%20foldable%20electric%20scooter%20with%20sleek%20design%20on%20clean%20white%20background%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20detailed%20features%20and%20premium%20finish&width=250&height=250&seq=prod5&orientation=squarish",
    },
    {
      id: 6,
      name: "Commercial Coffee Machine",
      description: "Professional espresso machine for cafes and restaurants",
      price: "$650.00 - $1,200.00",
      minOrder: "5 Units",
      rating: 4.9,
      image:
        "https://readdy.ai/api/search-image?query=Professional%20commercial%20coffee%20machine%20with%20stainless%20steel%20finish%20on%20clean%20white%20background%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20detailed%20components%20and%20premium%20craftsmanship&width=250&height=250&seq=prod6&orientation=squarish",
    },
    {
      id: 7,
      name: "LED Grow Lights",
      description: "Full spectrum LED lights for indoor plant growing",
      price: "$45.00 - $120.00",
      minOrder: "100 Units",
      rating: 4.7,
      image:
        "https://readdy.ai/api/search-image?query=Full%20spectrum%20LED%20grow%20lights%20with%20modern%20design%20on%20clean%20white%20background%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20detailed%20features%20and%20technological%20elements&width=250&height=250&seq=prod7&orientation=squarish",
    },
    {
      id: 8,
      name: "Fitness Smartwatch",
      description: "Water-resistant smartwatch with health monitoring",
      price: "$28.50 - $65.00",
      minOrder: "200 Pieces",
      rating: 4.6,
      image:
        "https://readdy.ai/api/search-image?query=Modern%20fitness%20smartwatch%20with%20health%20monitoring%20features%20on%20clean%20white%20background%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20detailed%20screen%20and%20premium%20band&width=250&height=250&seq=prod8&orientation=squarish",
    },
  ];

  const suppliers = [
    {
      id: 1,
      name: "TechPro Electronics Co., Ltd.",
      logo: "https://readdy.ai/api/search-image?query=Modern%20minimalist%20tech%20company%20logo%20with%20blue%20and%20white%20color%20scheme%20on%20clean%20background%2C%20professional%20corporate%20identity%20design%20with%20simple%20geometric%20elements&width=80&height=80&seq=sup1&orientation=squarish",
      mainProducts: "Smartphones, Laptops, Audio Equipment",
      verified: true,
      responseRate: "98%",
    },
    {
      id: 2,
      name: "GlobalMach Industries",
      logo: "https://readdy.ai/api/search-image?query=Industrial%20machinery%20company%20logo%20with%20red%20and%20gray%20color%20scheme%20on%20clean%20background%2C%20professional%20corporate%20identity%20design%20with%20gear%20or%20mechanical%20elements&width=80&height=80&seq=sup2&orientation=squarish",
      mainProducts: "CNC Machines, Industrial Equipment, Automation Systems",
      verified: true,
      responseRate: "95%",
    },
    {
      id: 3,
      name: "EcoTech Solutions",
      logo: "https://readdy.ai/api/search-image?query=Eco-friendly%20technology%20company%20logo%20with%20green%20and%20blue%20color%20scheme%20on%20clean%20background%2C%20professional%20corporate%20identity%20design%20with%20leaf%20or%20sustainable%20elements&width=80&height=80&seq=sup3&orientation=squarish",
      mainProducts: "Solar Panels, Wind Turbines, Energy Storage",
      verified: true,
      responseRate: "97%",
    },
    {
      id: 4,
      name: "FashionWorld Textiles",
      logo: "https://readdy.ai/api/search-image?query=Fashion%20and%20textile%20company%20logo%20with%20purple%20and%20gold%20color%20scheme%20on%20clean%20background%2C%20professional%20corporate%20identity%20design%20with%20fabric%20or%20thread%20elements&width=80&height=80&seq=sup4&orientation=squarish",
      mainProducts: "Apparel, Textiles, Fashion Accessories",
      verified: true,
      responseRate: "94%",
    },
    {
      id: 5,
      name: "MediCare Supplies Co.",
      logo: "https://readdy.ai/api/search-image?query=Medical%20supplies%20company%20logo%20with%20blue%20and%20white%20color%20scheme%20on%20clean%20background%2C%20professional%20corporate%20identity%20design%20with%20cross%20or%20healthcare%20elements&width=80&height=80&seq=sup5&orientation=squarish",
      mainProducts: "Medical Devices, PPE, Healthcare Equipment",
      verified: true,
      responseRate: "99%",
    },
    {
      id: 6,
      name: "AutoParts International",
      logo: "https://readdy.ai/api/search-image?query=Automotive%20parts%20company%20logo%20with%20red%20and%20black%20color%20scheme%20on%20clean%20background%2C%20professional%20corporate%20identity%20design%20with%20wheel%20or%20mechanical%20elements&width=80&height=80&seq=sup6&orientation=squarish",
      mainProducts: "Auto Parts, Vehicle Accessories, Car Electronics",
      verified: true,
      responseRate: "96%",
    },
  ];

  const tradeServices = [
    {
      id: 1,
      title: "Buyer Protection",
      description: "Secure payments and purchase protection for all orders",
      icon: "shield-alt",
    },
    {
      id: 2,
      title: "Secure Payment",
      description:
        "Multiple secure payment options including credit cards and PayPal",
      icon: "credit-card",
    },
    {
      id: 3,
      title: "Logistics Services",
      description:
        "Global shipping and logistics solutions for all order sizes",
      icon: "shipping-fast",
    },
    {
      id: 4,
      title: "Quality Inspection",
      description: "Third-party inspection services to ensure product quality",
      icon: "check-circle",
    },
  ];

  const heroSlides = [
    {
      id: 1,
      title: "Global Sourcing Made Easy",
      subtitle: "Connect with verified manufacturers and suppliers worldwide",
      cta: "Explore Products",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20global%20business%20concept%20with%20world%20map%20and%20shipping%20containers%20in%20a%20professional%20setting%2C%20with%20clean%20gradient%20background%20that%20transitions%20from%20light%20blue%20to%20white%20on%20the%20left%20side%20for%20text%20placement%2C%20corporate%20style%20photography&width=1200&height=500&seq=hero1&orientation=landscape",
    },
    {
      id: 2,
      title: "Quality Industrial Equipment",
      subtitle: "Direct from verified manufacturers at competitive prices",
      cta: "View Machinery",
      image:
        "https://readdy.ai/api/search-image?query=Industrial%20manufacturing%20equipment%20in%20a%20modern%20factory%20with%20clean%20gradient%20background%20that%20transitions%20from%20light%20blue%20to%20white%20on%20the%20left%20side%20for%20text%20placement%2C%20professional%20corporate%20photography%20with%20bright%20lighting&width=1200&height=500&seq=hero2&orientation=landscape",
    },
    {
      id: 3,
      title: "Consumer Electronics Showcase",
      subtitle: "Latest tech products from leading manufacturers",
      cta: "Discover Electronics",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20consumer%20electronics%20and%20gadgets%20arranged%20professionally%20with%20clean%20gradient%20background%20that%20transitions%20from%20light%20blue%20to%20white%20on%20the%20left%20side%20for%20text%20placement%2C%20high-end%20product%20photography%20with%20soft%20lighting&width=1200&height=500&seq=hero3&orientation=landscape",
    },
  ];

  return (
    <div className='min-h-[1024px] w-full bg-white text-gray-800'>
      {/* Hero */}
      <HeroSlider slides={heroSlides} />

      {/* Categories Highlight Carousel */}
      <CategoriesCarousel categories={categories} />

      {/* Featured Products */}
      <FeaturedProducts featuredProducts={featuredProducts} />

      {/* Suppliers Section */}
      <VerifiedSuppliers suppliers={suppliers} />

      {/* Trade Services */}
      <TradeServices services={tradeServices} />

      {/* Business Insights with Chart */}
      <BusinessInsights />
    </div>
  );
};

export default App;
