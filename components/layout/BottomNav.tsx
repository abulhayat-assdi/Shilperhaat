"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Menu, MessageCircle, User } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { dummySiteSettings } from "@/lib/dummy-data";

export default function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const whatsappUrl = `https://wa.me/${dummySiteSettings.whatsappNumber}`;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e0d0b0] safe-area-inset-bottom"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {/* Menu */}
        <NavItem href="/shop" icon={Menu} label="মেনু" active={isActive("/shop")} />

        {/* Cart */}
        <NavItemWithBadge
          href="/cart"
          icon={ShoppingCart}
          label="কার্ট"
          active={isActive("/cart")}
          badge={itemCount}
        />

        {/* Home — elevated center button */}
        <div className="relative flex flex-col items-center">
          <Link href="/" aria-label="হোম">
            <motion.div
              whileTap={{ scale: 0.92 }}
              className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center -mt-5 border-4 border-white transition-colors ${
                isActive("/")
                  ? "bg-[#c8860a]"
                  : "bg-[#4a2c0a]"
              }`}
            >
              <Home size={24} className="text-white" />
            </motion.div>
          </Link>
          <span className="text-xs mt-0.5 text-[#7a6045]">হোম</span>
        </div>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 px-2"
          aria-label="WhatsApp"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <MessageCircle size={22} className="text-[#16a34a]" />
          </div>
          <span className="text-xs text-[#7a6045]">WhatsApp</span>
        </a>

        {/* Account */}
        <NavItem href="/account" icon={User} label="অ্যাকাউন্ট" active={false} />
      </div>
    </nav>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-0.5 px-2"
      aria-label={label}
    >
      <div className="w-8 h-8 flex items-center justify-center">
        <Icon
          size={22}
          className={active ? "text-[#c8860a]" : "text-[#7a6045]"}
          strokeWidth={active ? 2.5 : 1.75}
        />
      </div>
      <span
        className={`text-xs ${active ? "text-[#c8860a] font-semibold" : "text-[#7a6045]"}`}
      >
        {label}
      </span>
    </Link>
  );
}

function NavItemWithBadge({
  href,
  icon: Icon,
  label,
  active,
  badge,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  badge: number;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-0.5 px-2"
      aria-label={label}
    >
      <div className="relative w-8 h-8 flex items-center justify-center">
        <Icon
          size={22}
          className={active ? "text-[#c8860a]" : "text-[#7a6045]"}
          strokeWidth={active ? 2.5 : 1.75}
        />
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-[#c8860a] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <span
        className={`text-xs ${active ? "text-[#c8860a] font-semibold" : "text-[#7a6045]"}`}
      >
        {label}
      </span>
    </Link>
  );
}
