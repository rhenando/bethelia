"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, User, Blocks, Store } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Categories", href: "/categories", icon: Blocks },
  { label: "Supplier", href: "/supplier", icon: Store },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Account", href: "/account", icon: User },
];

// Example counts (you can get these from context/store)
const cartCount = 3;
// Add more counts for other icons if needed in future

export default function NavbarMobile() {
  const pathname = usePathname();

  return (
    <nav
      role='navigation'
      className='fixed bottom-0 left-0 w-full bg-white dark:bg-background border-t z-[9999] flex justify-around py-3 shadow'
    >
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={label}
            href={href}
            aria-label={label}
            className={`flex flex-col items-center text-xs font-medium focus:outline-none group relative
              ${
                isActive
                  ? "text-[var(--primary)] dark:text-[var(--primary)]"
                  : "text-gray-700 dark:text-muted-foreground"
              } transition-colors active:scale-90`}
            onClick={() => {
              if (window.navigator && window.navigator.vibrate)
                window.navigator.vibrate(15);
            }}
          >
            <span className='relative flex items-center justify-center'>
              <Icon
                className={`w-6 h-6 mb-0.5 transition-transform duration-200
                  ${
                    isActive
                      ? "stroke-[var(--primary)] dark:stroke-[var(--primary)] scale-110"
                      : "stroke-gray-500 dark:stroke-muted-foreground group-hover:scale-110"
                  }
                `}
              />
              {label === "Cart" && cartCount > 0 && (
                <span className='absolute -top-1.5 -right-2 min-w-[1.25rem] h-5 px-1 text-xs rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold shadow'>
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
