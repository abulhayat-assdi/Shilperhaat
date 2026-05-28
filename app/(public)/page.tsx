import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import TopSellingSection from "@/components/home/TopSellingSection";
import CategorySection from "@/components/home/CategorySection";
import ReviewCarousel from "@/components/home/ReviewCarousel";
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
    <div style={{ backgroundColor: "#FBF9F5" }}>
      {/* 1. Hero Banner */}
      <HeroBanner banners={banners as any[]} />

      {/* 2. Featured Categories */}
      <CategoryGrid categories={categories as any[]} />

      {/* 4. Top Selling Products */}
      <TopSellingSection products={products as any[]} />

      {/* 5. Per-Category Sections */}
      {categoryProducts
        .filter((cp) => cp.products.length > 0)
        .map((cp) => (
          <CategorySection
            key={cp.category.id}
            category={cp.category as any}
            products={cp.products as any[]}
          />
        ))}

      {/* 6. Customer Reviews */}
      <ReviewCarousel reviews={reviews as any[]} />
    </div>
  );
}

