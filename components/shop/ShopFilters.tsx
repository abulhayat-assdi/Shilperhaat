"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { X, SlidersHorizontal, Filter } from "lucide-react";
import type { Category } from "@/types";

interface ShopFiltersProps {
  categories: Category[];
}

export default function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSearch = searchParams.get("search") || "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset pagination on filter change
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters =
    currentCategory || currentMinPrice || currentMaxPrice || currentSearch;

  const sortOptions = [
    { value: "newest", label: "নতুন পণ্য আগে" },
    { value: "price_asc", label: "দাম: কম থেকে বেশি" },
    { value: "price_desc", label: "দাম: বেশি থেকে কম" },
    { value: "best_selling", label: "বেস্টসেলার" },
  ];

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-semibold text-[#1a1208] mb-3 text-sm">
          সাজানোর ক্রম
        </h3>
        <div className="space-y-2">
          {sortOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={currentSort === opt.value}
                onChange={() => updateFilter("sort", opt.value)}
                className="accent-[#c8860a]"
              />
              <span className="text-sm text-[#4a2c0a] group-hover:text-[#c8860a] transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-semibold text-[#1a1208] mb-3 text-sm">বিভাগ</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="category"
              value=""
              checked={!currentCategory}
              onChange={() => updateFilter("category", "")}
              className="accent-[#c8860a]"
            />
            <span className="text-sm text-[#4a2c0a] group-hover:text-[#c8860a] transition-colors">
              সকল বিভাগ
            </span>
          </label>
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={currentCategory === cat.slug}
                onChange={() => updateFilter("category", cat.slug)}
                className="accent-[#c8860a]"
              />
              <span className="text-sm text-[#4a2c0a] group-hover:text-[#c8860a] transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-[#1a1208] mb-3 text-sm">মূল্য সীমা</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="সর্বনিম্ন"
            value={currentMinPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="w-full border border-[#e0d0b0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c8860a] text-[#1a1208]"
          />
          <span className="text-[#7a6045] text-sm flex-shrink-0">—</span>
          <input
            type="number"
            placeholder="সর্বোচ্চ"
            value={currentMaxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="w-full border border-[#e0d0b0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c8860a] text-[#1a1208]"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"
        >
          <X size={14} />
          সব ফিল্টার মুছুন
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters Sidebar */}
      <div className="hidden md:block w-56 flex-shrink-0">
        <div className="bg-white rounded-xl border border-[#e0d0b0] p-5 sticky top-24">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal size={16} className="text-[#c8860a]" />
            <h2 className="font-bold text-[#1a1208]">ফিল্টার</h2>
          </div>
          <FilterPanel />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#e0d0b0] rounded-full text-sm text-[#4a2c0a] bg-white"
          >
            <Filter size={14} />
            ফিল্টার
            {hasActiveFilters && (
              <span className="bg-[#c8860a] text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                !
              </span>
            )}
          </button>

          {/* Mobile Sort */}
          <select
            value={currentSort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="flex-1 border border-[#e0d0b0] rounded-full px-4 py-2.5 text-sm outline-none bg-white text-[#4a2c0a]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-[60] w-72 bg-white p-5 overflow-y-auto md:hidden shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-[#1a1208]">ফিল্টার</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-[#7a6045]"
              >
                <X size={20} />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full bg-[#c8860a] text-white py-3 rounded-xl font-semibold"
            >
              ফলাফল দেখুন
            </button>
          </div>
        </>
      )}
    </>
  );
}
