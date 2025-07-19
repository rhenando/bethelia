"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, User, Blocks, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // <-- Import for getting state
import { useAuth } from "@/hooks/useAuth"; // <-- Import your custom auth hook

const staticNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Categories", href: "/categories", icon: Blocks },
  { label: "Seller", href: "/seller-list", icon: Store },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
];

export default function NavbarMobile() {
  const pathname = usePathname();
  const [accountHref, setAccountHref] = useState("/buyer-signin");

  // Get authentication state from your custom hook
  const { user, role } = useAuth();

  // Get cart count from your Redux store (adjust selector as needed)
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);

  // This effect runs when the user's auth status or role changes
  useEffect(() => {
    if (user) {
      // If a user is logged in, check their role
      if (role === "seller") {
        setAccountHref("/seller-dashboard");
      } else if (role === "buyer") {
        setAccountHref("/buyer-dashboard");
      } else {
        // Fallback for a logged-in user with no role yet, defaults to buyer experience
        setAccountHref("/buyer-dashboard");
      }
    } else {
      // If no user is logged in, the link points to the sign-in page
      setAccountHref("/buyer-signin");
    }
  }, [user, role]); // Dependency array ensures this runs on auth changes

  const dynamicNavItems = [
    ...staticNavItems,
    {
      label: "Account",
      href: accountHref,
      icon: User,
    },
  ];

  return (
    <nav
      role='navigation'
      aria-label='Mobile navigation'
      className='fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-background border-t z-[2147483647] flex justify-around py-3 shadow touch-manipulation'
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {dynamicNavItems.map(({ label, href, icon: Icon }) => {
        const isActive =
          pathname === href || (href !== "/" && pathname.startsWith(href));

        return (
          <Link
            key={label}
            href={href}
            aria-label={label}
            className={`flex flex-col items-center text-xs font-medium focus:outline-none group relative w-1/5
              ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-700 dark:text-muted-foreground"
              } transition-colors active:scale-90`}
          >
            <span className='relative flex items-center justify-center'>
              <Icon
                className={`w-6 h-6 mb-0.5 transition-transform duration-200
                  ${
                    isActive
                      ? "stroke-blue-600 scale-110"
                      : "stroke-gray-500 dark:stroke-muted-foreground group-hover:scale-110"
                  }`}
              />
              {label === "Cart" && cartCount > 0 && (
                <span className='absolute -top-1.5 -right-2 min-w-[1.25rem] h-5 px-1 text-xs rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow'>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
