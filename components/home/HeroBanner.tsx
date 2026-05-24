"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Banner } from "@/types";

interface HeroBannerProps {
  banners: Banner[];
}

// Fallback banner when no images are uploaded yet
const FallbackBanner = () => (
  <div className="relative w-full h-[280px] sm:h-[380px] md:h-[500px] lg:h-[580px] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#4a2c0a] via-[#7a4a1a] to-[#c8860a] flex items-center justify-center">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-32 h-32 border-4 border-white rounded-full" />
        <div className="absolute top-12 left-12 w-20 h-20 border-2 border-white rounded-full" />
        <div className="absolute bottom-4 right-4 w-40 h-40 border-4 border-white rounded-full" />
        <div className="absolute bottom-12 right-12 w-24 h-24 border-2 border-white rounded-full" />
      </div>

      <div className="text-center px-6 z-10">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#f5d78e] text-sm md:text-base font-medium mb-3 tracking-wider uppercase"
        >
          স্বাগতম শিল্পেরহাটে
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
        >
          বাংলার ঐতিহ্যবাহী
          <br />
          <span className="text-[#f5d78e]">হস্তশিল্প</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/80 text-sm md:text-base mb-6 max-w-md mx-auto"
        >
          হাতে বোনা কাঁথা, চাদর ও কম্বলের বিশাল সংগ্রহ। সেরা মান, সাশ্রয়ী মূল্য।
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/shop"
            className="inline-block bg-[#c8860a] hover:bg-[#a06c07] text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg"
          >
            এখনই কিনুন
          </Link>
        </motion.div>
      </div>
    </div>
  </div>
);

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const activeBanners = banners.filter((b) => b.isActive);

  const goToNext = useCallback(() => {
    if (activeBanners.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const goToPrev = useCallback(() => {
    if (activeBanners.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? activeBanners.length - 1 : prev - 1
    );
  }, [activeBanners.length]);

  // Auto-advance
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext, activeBanners.length]);

  if (activeBanners.length === 0) {
    return <FallbackBanner />;
  }

  const banner = activeBanners[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-[#1a1208]">
      {/* Banner Image */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ x: direction * 100 + "%", opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -100 + "%", opacity: 0.5 }}
          transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
          className="relative w-full h-[280px] sm:h-[380px] md:h-[500px] lg:h-[580px]"
        >
          {/* Desktop Image */}
          <div className="hidden sm:block relative w-full h-full">
            <Image
              src={banner.imageUrl}
              alt={banner.title || "শিল্পেরহাট ব্যানার"}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
              onError={(e) => {
                // Show gradient fallback on error
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Mobile Image */}
          <div className="sm:hidden relative w-full h-full">
            <Image
              src={banner.mobileImageUrl || banner.imageUrl}
              alt={banner.title || "শিল্পেরহাট ব্যানার"}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

          {/* Content */}
          {(banner.title || banner.subtitle || banner.buttonText) && (
            <div className="absolute inset-0 flex items-center">
              <div className="px-6 md:px-16 max-w-lg">
                {banner.title && (
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
                  >
                    {banner.title}
                  </motion.h2>
                )}
                {banner.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/90 text-sm md:text-base mb-5"
                  >
                    {banner.subtitle}
                  </motion.p>
                )}
                {banner.buttonText && banner.buttonLink && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      href={banner.buttonLink}
                      className="inline-block bg-[#c8860a] hover:bg-[#a06c07] text-white font-bold px-6 py-2.5 rounded-full transition-colors shadow-lg text-sm md:text-base"
                    >
                      {banner.buttonText}
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows (visible when multiple banners) */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1a1208] p-2 rounded-full shadow transition-colors z-10"
            aria-label="আগের ব্যানার"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1a1208] p-2 rounded-full shadow transition-colors z-10"
            aria-label="পরের ব্যানার"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`transition-all rounded-full ${
                  i === currentIndex
                    ? "w-6 h-2 bg-[#c8860a]"
                    : "w-2 h-2 bg-white/60"
                }`}
                aria-label={`ব্যানার ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
