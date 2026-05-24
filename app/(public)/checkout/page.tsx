import type { Metadata } from "next";
import CheckoutPageClient from "@/components/checkout/CheckoutPageClient";

export const metadata: Metadata = {
  title: "চেকআউট — শিল্পেরহাট",
  description: "আপনার অর্ডার সম্পন্ন করুন। ক্যাশ অন ডেলিভারিতে কিনুন।",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
