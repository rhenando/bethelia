// headerIconsConfig.js
import { User, UserPlus, Mail, ShoppingCart } from "lucide-react";

export const headerIcons = [
  {
    label: "Sign In",
    icon: User,
    href: "/signin", // optional
  },
  {
    label: "Join Free",
    icon: UserPlus,
    href: "/", // optional
  },
  {
    label: "Messages",
    icon: Mail,
    href: "/",
  },
  {
    label: "Cart",
    icon: ShoppingCart,
    href: "/",
    // badge: 2,
  },
];
