"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Home, ShoppingCart, User, Blocks, Store } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Categories", href: "/categories", icon: Blocks },
  { label: "Supplier", href: "/supplier", icon: Store },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Account", href: "/account", icon: User },
];

const cartCount = 0;

export default function NavbarMobile() {
  const pathname = usePathname();
  const router = useRouter();
  const authUser = useSelector((state) => state.auth.user);
  // Make sure the user role is present in the auth slice, e.g., authUser?.role
  const [showLogin, setShowLogin] = useState(false);

  // Handle Account click with role check
  const handleAccountClick = (e) => {
    if (!authUser) {
      e.preventDefault();
      setShowLogin(true);
      return;
    }
    // User is logged in, check role
    e.preventDefault();
    if (authUser.role === "supplier") {
      router.push("/supplier");
    } else {
      // Default to /account for buyers or any other role
      router.push("/account");
    }
  };

  // Example login modal (replace with your actual login dialog component)
  const LoginModal = ({ open, onClose }) =>
    !open ? null : (
      <div className='fixed inset-0 bg-black/30 z-[99999] flex items-center justify-center'>
        <div className='bg-white rounded-xl p-6 max-w-xs w-full shadow-lg relative'>
          <button
            className='absolute top-2 right-2 text-gray-400 hover:text-gray-800'
            onClick={onClose}
            aria-label='Close login dialog'
          >
            ×
          </button>
          <h2 className='font-bold text-lg mb-4 text-center'>
            Log in Required
          </h2>
          <p className='text-gray-700 mb-4 text-center text-sm'>
            Please log in to access your account.
          </p>
          <button
            className='w-full py-2 px-4 rounded bg-[var(--primary)] text-white font-semibold'
            onClick={() => {
              onClose();
              router.push("/login");
            }}
          >
            Log In
          </button>
        </div>
      </div>
    );

  return (
    <>
      <nav
        role='navigation'
        className='fixed bottom-0 left-0 w-full bg-white dark:bg-background border-t z-[9999] flex justify-around py-3 shadow'
      >
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");

          if (label === "Account") {
            return (
              <a
                key={label}
                href='#'
                aria-label={label}
                onClick={handleAccountClick}
                className={`flex flex-col items-center text-xs font-medium focus:outline-none group relative
                  ${
                    isActive
                      ? "text-[var(--primary)] dark:text-[var(--primary)]"
                      : "text-gray-700 dark:text-muted-foreground"
                  } transition-colors active:scale-90`}
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
                </span>
                {label}
              </a>
            );
          }

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
      {/* Login Modal */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
