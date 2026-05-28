"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { ProductImage } from "@/types";
import { getImageUrl } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex]   = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div
        className="relative flex items-center justify-center"
        style={{
          aspectRatio: "1",
          backgroundColor: "#F5F5F5",
          borderRadius: "8px",
          border: "1px solid #F0F0F0",
        }}
      >
        <span style={{ color: "#888888", fontSize: "14px" }}>No image available</span>
      </div>
    );
  }

  const active = images[activeIndex];

  return (
    <>
      {/* Gallery panel */}
      <div
        className="flex"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid #F0F0F0",
          padding: "16px",
          gap: "12px",
          position: "sticky",
          top: "68px",
        }}
      >
        {/* Thumbnails strip (left) */}
        {images.length > 1 && (
          <div
            className="hidden md:flex flex-col"
            style={{ gap: "8px", width: "76px", flexShrink: 0 }}
          >
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                aria-label={`View image ${i + 1}`}
                style={{
                  width: "76px",
                  height: "76px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: i === activeIndex ? "2px solid #F48721" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                  backgroundColor: "#F5F5F5",
                  padding: 0,
                }}
              >
                <Image
                  src={getImageUrl(img.imageUrl)}
                  alt={img.altText || `Image ${i + 1}`}
                  width={76}
                  height={76}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image area */}
        <div
          className="flex-1 relative flex items-center justify-center cursor-zoom-in overflow-hidden"
          style={{ minHeight: "380px" }}
          onClick={() => setLightboxOpen(true)}
        >
          {/* CSS fade-in on key change replaces AnimatePresence */}
          <div
            key={activeIndex}
            className="gallery-fade absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={getImageUrl(active?.imageUrl)}
              alt={active?.altText || `${title} — image ${activeIndex + 1}`}
              fill
              className="object-contain transition-transform duration-300 hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={activeIndex === 0}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
              }}
            />
          </div>

          {/* Zoom hint */}
          <div
            className="absolute bottom-3 right-3 flex items-center justify-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.85)",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              zIndex: 10,
            }}
          >
            <ZoomIn size={14} style={{ color: "#666666" }} />
          </div>

          {/* Gallery arrows (mobile) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 md:hidden flex items-center justify-center"
                aria-label="Previous image"
                style={{
                  backgroundColor: "rgba(0,0,0,0.12)",
                  border: "none",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  color: "#FFFFFF",
                  zIndex: 10,
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i + 1) % images.length);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden flex items-center justify-center"
                aria-label="Next image"
                style={{
                  backgroundColor: "rgba(0,0,0,0.12)",
                  border: "none",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  color: "#FFFFFF",
                  zIndex: 10,
                }}
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile thumbnails */}
      {images.length > 1 && (
        <div
          className="flex md:hidden overflow-x-auto mt-3"
          style={{ gap: "8px", paddingBottom: "4px" }}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              style={{
                flexShrink: 0,
                width: "64px",
                height: "64px",
                borderRadius: "4px",
                overflow: "hidden",
                border: i === activeIndex ? "2px solid #F48721" : "2px solid transparent",
                cursor: "pointer",
                transition: "border-color 0.2s ease",
                backgroundColor: "#F5F5F5",
                padding: 0,
              }}
            >
              <Image
                src={getImageUrl(img.imageUrl)}
                alt={img.altText || `Image ${i + 1}`}
                width={64}
                height={64}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getImageUrl(active?.imageUrl)}
              alt={active?.altText || title}
              width={800}
              height={800}
              className="object-contain w-full rounded-lg"
              style={{ maxHeight: "80vh" }}
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute flex items-center justify-center"
              style={{
                top: "-12px",
                right: "-12px",
                backgroundColor: "#FFFFFF",
                color: "#222831",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              ✕
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                  className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{
                    left: "8px",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    border: "none",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
                  className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{
                    right: "8px",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    border: "none",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
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
