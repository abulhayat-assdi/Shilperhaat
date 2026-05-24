import type { Metadata } from "next";
import { Suspense } from "react";
import ThankYouClient from "@/components/checkout/ThankYouClient";

export const metadata: Metadata = {
  title: "অর্ডার সফল — শিল্পেরহাট",
  description: "আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে।",
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#c8860a] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ThankYouClient />
    </Suspense>
  );
}
