import type { Metadata } from "next";
import { Suspense } from "react";
import ThankYouClient from "@/components/checkout/ThankYouClient";

// Never cached (origin or CDN): cart, checkout and order pages must always
// be served fresh. Responses carry Cache-Control: no-store.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Placed Successfully — Shilperhaat",
  description: "Your order has been placed successfully",
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#800000] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ThankYouClient />
    </Suspense>
  );
}
