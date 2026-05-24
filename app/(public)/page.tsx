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
  title: "শিল্পেরহাট — বাংলার ঐতিহ্যবাহী হস্তশিল্প",
  description:
    "হাতে বোনা কাঁথা, চাদর, কম্বল ও নকশিকাঁথার বিশাল সংগ্রহ। সেরা মান, সাশ্রয়ী মূল্য।",
};

export default async function HomePage() {
  // In production, replace with Prisma queries:
  // const banners = await prisma.banner.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  // const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  // const products = await prisma.product.findMany({ where: { status: 'ACTIVE' }, include: { images: true, category: true } });
  // const reviews = await prisma.review.findMany({ where: { isVisible: true }, orderBy: { sortOrder: 'asc' } });

  const banners = dummyBanners;
  const categories = dummyCategories;
  const products = dummyProducts as any[];
  const reviews = dummyReviews;

  // Group products by category for category sections
  const categoryProducts = categories.map((cat) => ({
    category: cat,
    products: products.filter((p) => p.categoryId === cat.id),
  }));

  return (
    <>
      {/* 1. Hero Banner */}
      <HeroBanner banners={banners as any[]} />

      {/* 2. Featured Categories */}
      <CategoryGrid categories={categories as any[]} />

      {/* Divider */}
      <div className="h-px bg-[#e0d0b0] max-w-7xl mx-auto" />

      {/* 3. Top Selling Products */}
      <TopSellingSection products={products as any[]} />

      {/* Divider */}
      <div className="h-px bg-[#e0d0b0] max-w-7xl mx-auto" />

      {/* 4. Category Sections */}
      {categoryProducts
        .filter((cp) => cp.products.length > 0)
        .map((cp, index) => (
          <div key={cp.category.id}>
            <CategorySection
              category={cp.category as any}
              products={cp.products as any[]}
            />
            {index < categoryProducts.filter((c) => c.products.length > 0).length - 1 && (
              <div className="h-px bg-[#e0d0b0] max-w-7xl mx-auto" />
            )}
          </div>
        ))}

      {/* 5. Customer Reviews */}
      <ReviewCarousel reviews={reviews as any[]} />

      {/* Trust badges */}
      <TrustBadges />
    </>
  );
}

function TrustBadges() {
  const badges = [
    { icon: "🏆", title: "সর্বোচ্চ মান", desc: "১০০% খাঁটি পণ্য" },
    { icon: "🚚", title: "দ্রুত ডেলিভারি", desc: "৩-৫ কার্যদিবসে" },
    { icon: "🔄", title: "সহজ ফেরত", desc: "৭ দিনের মধ্যে" },
    { icon: "🔒", title: "নিরাপদ পেমেন্ট", desc: "ক্যাশ অন ডেলিভারি" },
  ];

  return (
    <section className="py-10 bg-white border-t border-b border-[#e0d0b0]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((b) => (
            <div key={b.title} className="flex flex-col items-center text-center gap-2">
              <span className="text-3xl">{b.icon}</span>
              <div>
                <h4 className="font-bold text-sm text-[#1a1208]">{b.title}</h4>
                <p className="text-xs text-[#7a6045] mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
