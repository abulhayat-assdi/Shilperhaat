import type { Metadata } from "next";
import CartPageClient from "@/components/cart/CartPageClient";

// Never cached (origin or CDN): cart, checkout and order pages must always
// be served fresh. Responses carry Cache-Control: no-store.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart — Shilperhaat",
  description: "Your shopping cart at Shilperhaat",
};

export default function CartPage() {
  return <CartPageClient />;
}
