"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import type { Review } from "@/types";
import SectionHeader from "@/components/ui/SectionHeader";
import { getImageUrl } from "@/lib/utils";

interface ReviewCarouselProps {
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-[#c8860a] fill-[#c8860a]" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const visible = reviews.filter((r) => r.isVisible);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);

  // Items per view based on screen size
  const getItemsPerView = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const update = () => setItemsPerView(getItemsPerView());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, visible.length - itemsPerView);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (isPaused || visible.length <= itemsPerView) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [goNext, isPaused, visible.length, itemsPerView]);

  if (visible.length === 0) return null;

  return (
    <section className="py-8 md:py-12 bg-[#fdf8f3] overflow-hidden">
      <div className="px-4 max-w-7xl mx-auto">
        <SectionHeader
          title="গ্রাহকদের মতামত"
          subtitle="আমাদের সন্তুষ্ট গ্রাহকরা কী বলছেন"
        />

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel track */}
          <div
            ref={containerRef}
            className="overflow-hidden"
            onTouchStart={(e) => {
              dragStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const diff = dragStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 50) {
                if (diff > 0) goNext();
                else goPrev();
              }
            }}
          >
            <motion.div
              className="flex gap-4"
              animate={{ x: `-${current * (100 / itemsPerView)}%` }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              style={{
                width: `${(visible.length / itemsPerView) * 100}%`,
              }}
            >
              {visible.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  style={{ width: `${(itemsPerView / visible.length) * 100}%` }}
                />
              ))}
            </motion.div>
          </div>

          {/* Navigation arrows (desktop) */}
          {visible.length > itemsPerView && (
            <>
              <button
                onClick={goPrev}
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[#e0d0b0] rounded-full items-center justify-center shadow-md hover:border-[#c8860a] hover:text-[#c8860a] transition-colors z-10"
                aria-label="আগের রিভিউ"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goNext}
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[#e0d0b0] rounded-full items-center justify-center shadow-md hover:border-[#c8860a] hover:text-[#c8860a] transition-colors z-10"
                aria-label="পরের রিভিউ"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {visible.length > itemsPerView && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all rounded-full ${
                  i === current
                    ? "w-6 h-2 bg-[#c8860a]"
                    : "w-2 h-2 bg-[#e0d0b0]"
                }`}
                aria-label={`রিভিউ গ্রুপ ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  style,
}: {
  review: Review;
  style?: React.CSSProperties;
}) {
  return (
    <div style={style} className="px-2">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0e8d8] h-full flex flex-col">
        {/* Quote icon */}
        <div className="mb-3">
          <Quote size={24} className="text-[#c8860a] opacity-60" />
        </div>

        {/* Rating */}
        <StarRating rating={review.rating} />

        {/* Title */}
        {review.title && (
          <h4 className="font-bold text-[#1a1208] mt-2 text-sm">
            {review.title}
          </h4>
        )}

        {/* Content */}
        <p className="text-[#4a2c0a] text-sm mt-2 leading-relaxed flex-1 line-clamp-4">
          {review.content}
        </p>

        {/* Reviewer */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#f0e8d8]">
          {review.avatarUrl ? (
            <Image
              src={getImageUrl(review.avatarUrl)}
              alt={review.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#c8860a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {review.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm text-[#1a1208]">{review.name}</p>
            {review.role && (
              <p className="text-xs text-[#7a6045]">{review.role}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
