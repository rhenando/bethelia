"use client";

import Providers from "@/app/providers";
import Header from "./Header";
import Footer from "./Footer";
import LayoutWrapper from "./LayoutWrapper"; // 👈 Import wrapper

export default function ClientLayout({ children }) {
  return (
    <Providers>
      <LayoutWrapper>
        <Header />
        {children}
        <Footer />
      </LayoutWrapper>
    </Providers>
  );
}
