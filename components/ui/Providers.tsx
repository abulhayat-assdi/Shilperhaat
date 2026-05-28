"use client";

import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";
import { SiteLayoutProvider } from "@/lib/site-layout-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SiteLayoutProvider>
      <CartProvider>
        <ToastProvider>{children}</ToastProvider>
      </CartProvider>
    </SiteLayoutProvider>
  );
}
