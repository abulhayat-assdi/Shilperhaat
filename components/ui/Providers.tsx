"use client";

import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>{children}</ToastProvider>
    </CartProvider>
  );
}
