"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, User, Blocks, Store } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";

const staticNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Categories", href: "/categories", icon: Blocks },
  { label: "seller", href: "/seller-list", icon: Store },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
];

export default function NavbarMobile() {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();
  const [accountHref, setAccountHref] = useState("/buyer-signup");
  const cartCount = 0;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!isSignedIn || !user?.id) {
        setAccountHref("/buyer-signup"); // reset on logout
        return;
      }

      try {
        const db = getFirestore(app);
        const userRef = doc(db, "users", user.id);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.data();
          const roles = userData.roles || [];

          if (roles.includes("seller")) {
            setAccountHref("/seller-dashboard");
          } else if (roles.includes("buyer")) {
            setAccountHref("/buyer-dashboard");
          } else {
            setAccountHref("/buyer-dashboard"); // fallback if role is missing
          }
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setAccountHref("/buyer-signup"); // fallback on error
      }
    };

    fetchUserRole();
  }, [isSignedIn, user?.id]);

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
      className='
        fixed bottom-0 left-0 right-0 w-full 
        bg-white dark:bg-background border-t 
        z-[2147483647] flex justify-around py-3 shadow
        touch-manipulation
      '
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {dynamicNavItems.map(({ label, href, icon: Icon }) => {
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
