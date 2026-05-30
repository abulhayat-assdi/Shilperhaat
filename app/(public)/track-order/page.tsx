import type { Metadata } from "next";
import { Suspense } from "react";
import TrackOrderClient from "@/components/checkout/TrackOrderClient";
import { Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Track Your Order — Shilperhaat",
  description: "Track your order status with real-time updates on your shipment progress.",
};

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 rounded-full bg-[#f0e8d8] flex items-center justify-center">
            <Package size={24} className="text-[#c8860a]" />
          </div>
          <div className="w-8 h-8 border-4 border-[#c8860a] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackOrderClient />
    </Suspense>
  );
}
