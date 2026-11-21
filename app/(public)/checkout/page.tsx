import type { Metadata } from "next";
import CheckoutPageClient from "@/components/checkout/CheckoutPageClient";

// Never cached (origin or CDN): cart, checkout and order pages must always
// be served fresh. Responses carry Cache-Control: no-store.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout — Shilperhaat",
  description: "Complete your order at Shilperhaat",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
