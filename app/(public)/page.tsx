import { Suspense } from "react";
import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import TopSellingSection from "@/components/home/TopSellingSection";
import CategorySection from "@/components/home/CategorySection";
import ReviewCarousel from "@/components/home/ReviewCarousel";
import { ProductGridSkeleton } from "@/components/ui/ProductCardSkeleton";
import {
  dummyBanners,
  dummyCategories,
  dummyProducts,
  dummyReviews,
} from "@/lib/dummy-data";

export const metadata: Metadata = {
  title: "Shilperhaat — Bangladesh's Finest Handcraft Textiles",
  description:
    "Explore a vast collection of hand-woven Katha, Chadar, Blankets & Nakshi Katha. Premium quality, affordable prices.",
};

export default async function HomePage() {
  const banners    = dummyBanners;
  const categories = dummyCategories;
  const products   = dummyProducts as any[];
  const reviews    = dummyReviews;

  const categoryProducts = categories.map((cat) => ({
    category: cat,
    products: products.filter((p) => p.categoryId === cat.id),
  }));

  return (
    <div style={{ backgroundColor: "#FAF0E6" }}>
      {/* 1. Hero Banner */}
      <HeroBanner banners={banners as any[]} />

      {/* 2. Featured Categories */}
      <CategoryGrid categories={categories as any[]} />

      {/* 3. Top Selling Products */}
      <Suspense fallback={<div style={{ padding: "40px 0", backgroundColor: "#FFFFFF" }}><div className="max-w-7xl mx-auto px-4 md:px-5"><ProductGridSkeleton count={4} /></div></div>}>
        <TopSellingSection products={products as any[]} />
      </Suspense>

      {/* 4. Per-Category Sections */}
      {categoryProducts
        .filter((cp) => cp.products.length > 0)
        .map((cp) => (
          <Suspense key={cp.category.id} fallback={<div style={{ padding: "40px 0", backgroundColor: "#FAF0E6" }}><div className="max-w-7xl mx-auto px-4 md:px-5"><ProductGridSkeleton count={4} /></div></div>}>
            <CategorySection
              category={cp.category as any}
              products={cp.products as any[]}
            />
          </Suspense>
        ))}

      {/* 5. Customer Reviews */}
      <Suspense fallback={<div style={{ height: 280, backgroundColor: "#FFFFFF" }} />}>
        <ReviewCarousel reviews={reviews as any[]} />
      </Suspense>
    </div>
  );
}

