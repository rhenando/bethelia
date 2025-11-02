// src/components/layout/Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className='min-h-screen max-w-full flex flex-col'>
      <Header />
      <main className='flex-1 container mx-auto px-4'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
