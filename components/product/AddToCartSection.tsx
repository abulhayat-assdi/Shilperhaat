"use client";

import { useState } from "react";
import { ShoppingCart, Zap, Minus, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { formatPriceEn } from "@/lib/utils";

interface AddToCartSectionProps {
  product: Product;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, updateQuantity, items } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const cartItem = items.find((i) => i.productId === product.id);
  const currentCartQty = cartItem?.quantity || 0;
  const maxQty = product.stock - currentCartQty;
  const isOutOfStock = product.stock === 0;

  const inc = () => setQuantity((q) => Math.min(q + 1, maxQty));
  const dec = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const image = product.images?.[0]?.imageUrl || null;

    // Add once, then update quantity for additional units
    if (!cartItem) {
      addItem({
        id: product.id,
        productId: product.id,
        title: product.title,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        image,
        stock: product.stock,
        slug: product.slug,
      });
      if (quantity > 1) {
        updateQuantity(product.id, quantity);
      }
    } else {
      updateQuantity(product.id, currentCartQty + quantity);
    }

    setAdded(true);
    toast.success(`${quantity}টি "${product.title}" কার্টে যোগ হয়েছে`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  if (isOutOfStock) {
    return (
      <div className="text-center py-4 px-4 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-gray-500 font-medium">এই পণ্যটি বর্তমানে স্টকে নেই</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stock status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? "bg-green-500" : "bg-orange-500"}`} />
        <span className={`text-sm font-medium ${product.stock > 5 ? "text-green-700" : "text-orange-700"}`}>
          {product.stock > 5
            ? "স্টকে আছে"
            : `মাত্র ${product.stock}টি বাকি!`}
        </span>
      </div>

      {/* Quantity selector */}
      <div>
        <label className="block text-sm font-medium text-[#4a2c0a] mb-2">
          পরিমাণ
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[#e0d0b0] rounded-xl overflow-hidden">
            <button
              onClick={dec}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-[#4a2c0a] hover:bg-[#f0e8d8] disabled:opacity-40 transition-colors"
              aria-label="পরিমাণ কমান"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-semibold text-[#1a1208]">
              {quantity}
            </span>
            <button
              onClick={inc}
              disabled={quantity >= maxQty}
              className="w-10 h-10 flex items-center justify-center text-[#4a2c0a] hover:bg-[#f0e8d8] disabled:opacity-40 transition-colors"
              aria-label="পরিমাণ বাড়ান"
            >
              <Plus size={16} />
            </button>
          </div>
          <span className="text-sm text-[#7a6045]">
            মোট: {formatPriceEn(Number(product.price) * quantity)}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-colors ${
            added
              ? "bg-green-500 text-white"
              : "bg-[#c8860a] hover:bg-[#a06c07] text-white"
          }`}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.div
                key="added"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check size={16} />
                কার্টে যোগ হয়েছে
              </motion.div>
            ) : (
              <motion.div
                key="add"
                className="flex items-center gap-2"
              >
                <ShoppingCart size={16} />
                কার্টে যোগ করুন
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-[#4a2c0a] hover:bg-[#6b3d12] text-white transition-colors"
        >
          <Zap size={16} />
          এখনই কিনুন
        </motion.button>
      </div>

      {/* Delivery info */}
      <div className="bg-[#fdf8f3] rounded-xl p-4 border border-[#f0e8d8] text-sm space-y-2">
        <div className="flex items-center gap-2 text-[#4a2c0a]">
          <span>🚚</span>
          <span>৩-৫ কার্যদিবসে ডেলিভারি</span>
        </div>
        <div className="flex items-center gap-2 text-[#4a2c0a]">
          <span>💳</span>
          <span>ক্যাশ অন ডেলিভারি</span>
        </div>
        <div className="flex items-center gap-2 text-[#4a2c0a]">
          <span>🔄</span>
          <span>৭ দিনের মধ্যে ফেরত দেওয়া যাবে</span>
        </div>
      </div>
    </div>
  );
}

// Sticky add-to-cart for mobile (shown on scroll)
export function StickyCartBar({ product }: AddToCartSectionProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAdd = () => {
    if (product.stock === 0) return;
    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      image: product.images?.[0]?.imageUrl || null,
      stock: product.stock,
      slug: product.slug,
    });
    toast.success(`"${product.title}" কার্টে যোগ হয়েছে`);
  };

  return (
    <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-[#e0d0b0] px-4 py-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-[#7a6045] truncate">{product.title}</p>
          <p className="font-bold text-[#c8860a]">
            {formatPriceEn(Number(product.price))}
          </p>
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 ${
            product.stock === 0
              ? "bg-gray-100 text-gray-400"
              : "bg-[#c8860a] text-white"
          }`}
        >
          <ShoppingCart size={16} />
          কার্টে যোগ করুন
        </button>
      </div>
    </div>
  );
}
