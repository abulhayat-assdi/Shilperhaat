import type { Metadata } from "next";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "কার্ট — শিল্পেরহাট",
  description: "আপনার কার্টে রাখা পণ্যগুলো দেখুন এবং অর্ডার করুন।",
};

export default function CartPage() {
  return <CartPageClient />;
}
