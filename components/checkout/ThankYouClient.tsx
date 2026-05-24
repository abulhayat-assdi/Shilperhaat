"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Package, Phone, MapPin, ShoppingBag, Home } from "lucide-react";
import { motion } from "framer-motion";
import { formatPriceEn, getImageUrl } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface OrderData {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  items: Array<{
    productTitle: string;
    productImage: string | null;
    price: number;
    quantity: number;
    lineTotal: number;
  }>;
}

export default function ThankYouClient() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sh_last_order");
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch {}
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Success header */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="flex flex-col items-center text-center mb-8"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1208] mb-2">
          অর্ডার সফল হয়েছে! 🎉
        </h1>
        <p className="text-[#7a6045] text-sm">
          আপনার অর্ডার গ্রহণ করা হয়েছে। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।
        </p>
        {(orderNumber || order?.orderNumber) && (
          <div className="mt-3 bg-[#fdf8f3] border border-[#e0d0b0] rounded-xl px-6 py-3">
            <p className="text-xs text-[#7a6045]">অর্ডার নম্বর</p>
            <p className="font-bold text-[#c8860a] text-lg">
              {orderNumber || order?.orderNumber}
            </p>
          </div>
        )}
      </motion.div>

      {/* Order details */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Items */}
          <div className="bg-white rounded-xl border border-[#f0e8d8] p-5 shadow-sm">
            <h2 className="font-bold text-[#1a1208] mb-4 flex items-center gap-2">
              <Package size={18} className="text-[#c8860a]" />
              অর্ডার করা পণ্য
            </h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#f0e8d8] flex-shrink-0">
                    {item.productImage && (
                      <Image
                        src={getImageUrl(item.productImage)}
                        alt={item.productTitle}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a1208] line-clamp-1">
                      {item.productTitle}
                    </p>
                    <p className="text-xs text-[#7a6045]">
                      {item.quantity}টি × {formatPriceEn(item.price)}
                    </p>
                  </div>
                  <span className="font-bold text-[#1a1208] text-sm">
                    {formatPriceEn(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-[#f0e8d8] mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#4a2c0a]">
                <span>পণ্য মূল্য</span>
                <span>{formatPriceEn(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#4a2c0a]">
                <span>ডেলিভারি</span>
                <span>
                  {order.deliveryCharge === 0 ? (
                    <span className="text-green-600">বিনামূল্যে</span>
                  ) : (
                    formatPriceEn(order.deliveryCharge)
                  )}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#1a1208]">
                <span>মোট</span>
                <span className="text-[#c8860a]">{formatPriceEn(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer details */}
          <div className="bg-white rounded-xl border border-[#f0e8d8] p-5 shadow-sm">
            <h2 className="font-bold text-[#1a1208] mb-4">ডেলিভারির তথ্য</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#f0e8d8] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">👤</span>
                </div>
                <span className="text-[#1a1208] font-medium">{order.customerName}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[#c8860a] flex-shrink-0 mt-0.5" />
                <span className="text-[#4a2c0a]">{order.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#c8860a] flex-shrink-0 mt-0.5" />
                <span className="text-[#4a2c0a]">{order.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base">💵</span>
                <span className="text-[#4a2c0a]">
                  {order.paymentMethod === "COD"
                    ? "ক্যাশ অন ডেলিভারি"
                    : order.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">পরবর্তী পদক্ষেপ:</p>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li>আমরা শীঘ্রই আপনার ফোনে কল করব অর্ডার নিশ্চিত করতে</li>
              <li>পণ্য ৩-৫ কার্যদিবসের মধ্যে পৌঁছে যাবে</li>
              <li>পণ্য পেলে ডেলিভারি বয়কে টাকা দিন</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 flex-1 bg-[#c8860a] text-white font-bold py-3.5 rounded-xl hover:bg-[#a06c07] transition-colors"
        >
          <Home size={18} />
          হোমে যান
        </Link>
        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 flex-1 border-2 border-[#c8860a] text-[#c8860a] font-bold py-3.5 rounded-xl hover:bg-[#c8860a] hover:text-white transition-colors"
        >
          <ShoppingBag size={18} />
          আরও কিনুন
        </Link>
      </div>
    </div>
  );
}
