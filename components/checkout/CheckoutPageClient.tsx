"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Package, Check, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { formatPriceEn, generateOrderNumber, getImageUrl } from "@/lib/utils";

export default function CheckoutPageClient() {
  const { items, subtotal, deliveryCharge, total, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(checkoutSchema) as any,
  });

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-[#1a1208] mb-2">Cart is empty</h2>
        <p className="text-[#7a6045] text-sm mb-6">
          Please add products to your cart before checking out.
        </p>
        <Link
          href="/shop"
          className="bg-[#c8860a] text-white px-6 py-3 rounded-full font-semibold"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutInput) => {
    setIsSubmitting(true);
    try {
      const orderNumber = generateOrderNumber();
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productTitle: item.title,
        productImage: item.image,
        price: item.price,
        quantity: item.quantity,
        lineTotal: item.price * item.quantity,
      }));

      const payload = {
        orderNumber,
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        subtotal,
        deliveryCharge,
        total,
        paymentMethod: "COD",
        items: orderItems,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Order could not be placed");
      }

      const result = await response.json();

      try {
        localStorage.setItem("sh_last_order", JSON.stringify({
          ...payload,
          id: result.orderId || "temp-" + Date.now(),
        }));
      } catch {}

      clearCart();
      toast.success("Order placed successfully! 🎉");
      router.push(`/thank-you?order=${orderNumber}`);
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong while placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/cart" className="text-[#7a6045] hover:text-[#c8860a]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-[#1a1208]">Checkout</h1>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8 text-sm">
        <span className="flex items-center gap-1 text-[#c8860a] font-semibold">
          <Check size={14} /> Cart
        </span>
        <div className="h-px flex-1 bg-[#c8860a]" />
        <span className="flex items-center gap-1 text-[#c8860a] font-semibold">
          Delivery
        </span>
        <div className="h-px flex-1 bg-[#e0d0b0]" />
        <span className="text-[#7a6045]">Confirmation</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Delivery form */}
          <div className="flex-1 space-y-5">
            <div className="bg-white rounded-xl border border-[#f0e8d8] p-5 shadow-sm">
              <h2 className="font-bold text-[#1a1208] mb-4 flex items-center gap-2">
                <Package size={18} className="text-[#c8860a]" />
                Delivery Information
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#4a2c0a] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("customerName")}
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors text-[#1a1208] placeholder:text-[#aaa] ${
                      errors.customerName
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#e0d0b0] focus:border-[#c8860a]"
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#4a2c0a] mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors text-[#1a1208] placeholder:text-[#aaa] ${
                      errors.phone
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#e0d0b0] focus:border-[#c8860a]"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-[#4a2c0a] mb-1.5">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("address")}
                    rows={3}
                    placeholder="House no., Road, Area, District"
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none text-[#1a1208] placeholder:text-[#aaa] ${
                      errors.address
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#e0d0b0] focus:border-[#c8860a]"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-[#4a2c0a] mb-1.5">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={2}
                    placeholder="Any special delivery instructions..."
                    className="w-full border border-[#e0d0b0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8860a] resize-none text-[#1a1208] placeholder:text-[#aaa]"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-xl border border-[#f0e8d8] p-5 shadow-sm">
              <h2 className="font-bold text-[#1a1208] mb-4">Payment Method</h2>
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#c8860a] bg-[#fdf8f3] cursor-pointer">
                <div className="w-5 h-5 rounded-full border-2 border-[#c8860a] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#c8860a]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1a1208] text-sm">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-[#7a6045]">
                    Pay when you receive your order
                  </p>
                </div>
                <span className="ml-auto text-2xl">💵</span>
              </label>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl border border-[#f0e8d8] p-5 shadow-sm sticky top-24">
              <h2 className="font-bold text-[#1a1208] mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#f0e8d8] flex-shrink-0">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
                        }}
                      />
                      <span className="absolute -top-1 -right-1 bg-[#c8860a] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1a1208] line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-sm font-bold text-[#c8860a] mt-0.5">
                        {formatPriceEn(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[#f0e8d8] pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-[#4a2c0a]">
                  <span>Subtotal</span>
                  <span>{formatPriceEn(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#4a2c0a]">
                  <span>Delivery</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      formatPriceEn(deliveryCharge)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#1a1208] pt-2 border-t border-[#f0e8d8]">
                  <span>Total</span>
                  <span className="text-[#c8860a]">{formatPriceEn(total)}</span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-[#c8860a] hover:bg-[#a06c07] disabled:opacity-70 text-white font-bold py-4 rounded-xl transition-colors"
                style={{ transition: "background-color 0.15s, transform 0.1s" }}
                onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
                onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Confirm Order
                    <Check size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-[#7a6045] mt-3">
                Pay on delivery. No extra charges.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
