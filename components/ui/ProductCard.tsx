"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Tag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { formatPriceEn, calculateDiscount, getImageUrl } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const primaryImage = product.images?.[0];
  const imageUrl = getImageUrl(primaryImage?.imageUrl);
  const discount = product.compareAtPrice
    ? calculateDiscount(Number(product.price), Number(product.compareAtPrice))
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error("এই পণ্যটি বর্তমানে স্টকে নেই");
      return;
    }

    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      image: imageUrl,
      stock: product.stock,
      slug: product.slug,
    });

    toast.success(`"${product.title}" কার্টে যোগ হয়েছে`);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#f0e8d8]"
    >
      <Link href={`/product/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#f0e8d8]">
          <Image
            src={imageUrl}
            alt={primaryImage?.altText || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
            }}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
            {product.isBestSelling && (
              <span className="bg-[#c8860a] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                বেস্টসেলার
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                স্টক নেই
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {product.category && (
            <p className="text-xs text-[#c8860a] font-medium mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="text-sm font-semibold text-[#1a1208] line-clamp-2 mb-2 leading-snug">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-bold text-[#c8860a]">
              {formatPriceEn(Number(product.price))}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPriceEn(Number(product.compareAtPrice))}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors ${
              product.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#c8860a] text-white hover:bg-[#a06c07] active:bg-[#a06c07]"
            }`}
            aria-label={`কার্টে যোগ করুন — ${product.title}`}
          >
            <ShoppingCart size={15} />
            <span>{product.stock === 0 ? "স্টক নেই" : "কার্টে যোগ করুন"}</span>
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
}
