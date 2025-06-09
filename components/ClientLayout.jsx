// components/ClientLayout.jsx
"use client";

import Providers from "@/app/providers";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayout({ children }) {
  return (
    <Providers>
      <Header />
      {children}
      <Footer />
    </Providers>
  );
}
