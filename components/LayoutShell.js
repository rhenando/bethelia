"use client";
import { usePathname } from "next/navigation";
import NavbarMobile from "@/components/NavbarMobile";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  // Add more routes as needed
  const hideNavbar =
    pathname === "/buyer-signup" ||
    pathname === "/seller-login" ||
    pathname === "/signup" ||
    pathname === "/login";

  return (
    <>
      <main className='flex-1 pb-16'>{children}</main>
      {!hideNavbar && <NavbarMobile />}
    </>
  );
}
