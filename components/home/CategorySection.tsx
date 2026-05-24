import Link from "next/link";
import type { Category, Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";

interface CategorySectionProps {
  category: Category;
  products: Product[];
}

export default function CategorySection({
  category,
  products,
}: CategorySectionProps) {
  const display = products.slice(0, 4);

  if (display.length === 0) return null;

  return (
    <section className="py-8 md:py-10 px-4 max-w-7xl mx-auto">
      {/* Section heading */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1a1208]">
            {category.name}
          </h2>
          <div className="h-0.5 w-16 bg-[#c8860a] rounded mt-1.5" />
        </div>
        <Link
          href={`/shop?category=${category.slug}`}
          className="flex items-center gap-1.5 text-[#c8860a] hover:text-[#a06c07] font-semibold text-sm transition-colors"
        >
          সব দেখুন
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {display.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* See all button */}
      <div className="mt-6">
        <Link
          href={`/shop?category=${category.slug}`}
          className="block w-full text-center border border-[#e0d0b0] text-[#7a6045] hover:border-[#c8860a] hover:text-[#c8860a] py-3 rounded-xl font-medium text-sm transition-colors md:w-auto md:inline-block md:px-12"
        >
          {category.name}-এর সকল পণ্য দেখুন
        </Link>
      </div>
    </section>
  );
}
