import type { Metadata } from "next";
import { Suspense } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import { ProductGridSkeleton } from "@/components/ui/ProductCardSkeleton";
import {
  dummyCategories,
  dummyProducts,
} from "@/lib/dummy-data";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "সকল পণ্য — শিল্পেরহাট",
  description:
    "শিল্পেরহাটের সম্পূর্ণ পণ্য সংগ্রহ। কাঁথা, চাদর, কম্বল ও নকশিকাঁথা। ফিল্টার করুন, খুঁজুন এবং পছন্দমতো কিনুন।",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const {
    category: categorySlug,
    sort = "newest",
    minPrice,
    maxPrice,
    search,
    page = "1",
  } = params;

  const currentPage = Math.max(1, parseInt(page));
  const limit = 12;

  // Simulate DB filtering on dummy data
  let filtered: typeof dummyProducts = [...dummyProducts];

  if (categorySlug) {
    filtered = filtered.filter((p) => p.category?.slug === categorySlug);
  }
  if (minPrice) {
    filtered = filtered.filter((p) => Number(p.price) >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => Number(p.price) <= Number(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort
  switch (sort) {
    case "price_asc":
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case "price_desc":
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case "best_selling":
      filtered.sort((a, b) => (b.isBestSelling ? 1 : 0) - (a.isBestSelling ? 1 : 0));
      break;
    default:
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const paginated = filtered.slice((currentPage - 1) * limit, currentPage * limit);

  const activeCategory = dummyCategories.find((c) => c.slug === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1208]">
          {activeCategory ? activeCategory.name : "সকল পণ্য"}
        </h1>
        <p className="text-[#7a6045] text-sm mt-1">
          {total} টি পণ্য পাওয়া গেছে
        </p>
      </div>

      {/* Search bar */}
      <SearchBar defaultValue={search || ""} />

      <div className="flex gap-6 mt-6">
        {/* Filters */}
        <Suspense fallback={null}>
          <ShopFilters categories={dummyCategories as any[]} />
        </Suspense>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<ProductGridSkeleton count={12} />}>
            {paginated.length === 0 ? (
              <EmptyState search={search} category={activeCategory?.name} />
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginated.map((product) => (
                    <ProductCard key={product.id} product={product as any as Product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    current={currentPage}
                    total={totalPages}
                    params={params}
                  />
                )}
              </>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ defaultValue }: { defaultValue: string }) {
  return (
    <form method="get" className="relative md:max-w-md">
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a6045]"
      />
      <input
        type="text"
        name="search"
        defaultValue={defaultValue}
        placeholder="পণ্যের নাম, ট্যাগ বা বিবরণ দিয়ে খুঁজুন..."
        className="w-full pl-10 pr-4 py-3 border border-[#e0d0b0] rounded-full outline-none focus:border-[#c8860a] text-sm text-[#1a1208] bg-white placeholder:text-[#7a6045]"
      />
    </form>
  );
}

function EmptyState({
  search,
  category,
}: {
  search?: string;
  category?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-bold text-[#1a1208] mb-2">
        কোনো পণ্য পাওয়া যায়নি
      </h3>
      <p className="text-[#7a6045] text-sm max-w-sm">
        {search
          ? `"${search}" সার্চে কোনো ফলাফল পাওয়া যায়নি।`
          : category
          ? `"${category}" বিভাগে এখন কোনো পণ্য নেই।`
          : "এই ফিল্টারে কোনো পণ্য পাওয়া যায়নি।"}
      </p>
      <a
        href="/shop"
        className="mt-6 bg-[#c8860a] text-white px-6 py-2.5 rounded-full font-semibold text-sm"
      >
        সব পণ্য দেখুন
      </a>
    </div>
  );
}

function Pagination({
  current,
  total,
  params,
}: {
  current: number;
  total: number;
  params: Record<string, string | undefined>;
}) {
  const buildUrl = (page: number) => {
    const p = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v && k !== "page") p.set(k, v);
    });
    p.set("page", String(page));
    return `/shop?${p.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {current > 1 && (
        <a
          href={buildUrl(current - 1)}
          className="px-4 py-2 border border-[#e0d0b0] rounded-lg text-sm text-[#4a2c0a] hover:border-[#c8860a]"
        >
          ← আগের
        </a>
      )}

      {Array.from({ length: total }, (_, i) => i + 1)
        .filter((p) => Math.abs(p - current) <= 2)
        .map((p) => (
          <a
            key={p}
            href={buildUrl(p)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === current
                ? "bg-[#c8860a] text-white"
                : "border border-[#e0d0b0] text-[#4a2c0a] hover:border-[#c8860a]"
            }`}
          >
            {p}
          </a>
        ))}

      {current < total && (
        <a
          href={buildUrl(current + 1)}
          className="px-4 py-2 border border-[#e0d0b0] rounded-lg text-sm text-[#4a2c0a] hover:border-[#c8860a]"
        >
          পরের →
        </a>
      )}
    </div>
  );
}
