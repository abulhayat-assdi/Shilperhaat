"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductImage } from "@/types";
import { getImageUrl } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square bg-[#f0e8d8] rounded-2xl flex items-center justify-center">
        <span className="text-[#7a6045] text-sm">কোনো ছবি নেই</span>
      </div>
    );
  }

  const active = images[activeIndex];

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="relative aspect-square overflow-hidden rounded-2xl bg-[#f0e8d8] cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image
                src={getImageUrl(active?.imageUrl)}
                alt={active?.altText || `${title} - ছবি ${activeIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={activeIndex === 0}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom hint */}
          <div className="absolute bottom-3 right-3 bg-white/80 p-1.5 rounded-full">
            <ZoomIn size={14} className="text-[#7a6045]" />
          </div>

          {/* Arrow navigation for mobile */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow md:hidden"
                aria-label="আগের ছবি"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i + 1) % images.length);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow md:hidden"
                aria-label="পরের ছবি"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === activeIndex
                    ? "border-[#c8860a]"
                    : "border-transparent hover:border-[#e0d0b0]"
                }`}
                aria-label={`ছবি ${i + 1} দেখুন`}
              >
                <Image
                  src={getImageUrl(img.imageUrl)}
                  alt={img.altText || `ছবি ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-3xl max-h-screen w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={getImageUrl(active?.imageUrl)}
              alt={active?.altText || title}
              width={800}
              height={800}
              className="object-contain w-full h-full max-h-[80vh] rounded-xl"
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-4 -right-4 bg-white text-[#1a1208] rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              ✕
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
