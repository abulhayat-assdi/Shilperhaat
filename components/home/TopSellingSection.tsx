import Link from "next/link";
import type { Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";

interface TopSellingSectionProps {
  products: Product[];
}

export default function TopSellingSection({ products }: TopSellingSectionProps) {
  const top = products.filter((p) => p.isBestSelling).slice(0, 4);
  const display = top.length >= 4 ? top : products.slice(0, 4);

  if (display.length === 0) return null;

  return (
    <section className="py-8 md:py-12 px-4 max-w-7xl mx-auto">
      <SectionHeader
        title="সবচেয়ে বেশি বিক্রিত"
        subtitle="আমাদের গ্রাহকদের সবচেয়ে পছন্দের পণ্যগুলো"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {display.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/shop?sort=best_selling"
          className="inline-block border-2 border-[#c8860a] text-[#c8860a] hover:bg-[#c8860a] hover:text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          সকল বেস্টসেলার দেখুন
        </Link>
      </div>
    </section>
  );
}
