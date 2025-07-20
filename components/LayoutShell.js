"use client";
import { usePathname } from "next/navigation";
import NavbarMobile from "@/components/NavbarMobile";

export default function LayoutShell({ children }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname === "/buyer-signin" ||
    pathname === "/seller-login" ||
    pathname === "/signup" ||
    pathname === "/login" ||
    pathname.startsWith("/product/");

  return (
    <>
      <main className='flex-1 pb-16'>{children}</main>
      {!hideNavbar && <NavbarMobile />}
    </>
  );
}
