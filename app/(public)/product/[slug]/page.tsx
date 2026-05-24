import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartSection, { StickyCartBar } from "@/components/product/AddToCartSection";
import ProductCard from "@/components/ui/ProductCard";
import { dummyProducts } from "@/lib/dummy-data";
import { formatPriceEn, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = dummyProducts.find((p) => p.slug === slug);
  if (!product) return { title: "পণ্য পাওয়া যায়নি" };

  return {
    title: `${product.title} — শিল্পেরহাট`,
    description: product.description?.slice(0, 160) || product.title,
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160) || "",
      images: product.images[0]?.imageUrl ? [product.images[0].imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = dummyProducts.find((p) => p.slug === slug) as any as Product | undefined;

  if (!product) notFound();

  const discount = product.compareAtPrice
    ? calculateDiscount(Number(product.price), Number(product.compareAtPrice))
    : 0;

  // Related products (same category, exclude current)
  const related = dummyProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4) as any as Product[];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[#7a6045] mb-6" aria-label="breadcrumb">
          <Link href="/" className="hover:text-[#c8860a] transition-colors">হোম</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-[#c8860a] transition-colors">পণ্য</Link>
          {product.category && (
            <>
              <ChevronRight size={14} />
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-[#c8860a] transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={14} />
          <span className="text-[#1a1208] truncate max-w-[150px]">{product.title}</span>
        </nav>

        {/* Main product section */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* Details */}
          <div className="space-y-5">
            {/* Category */}
            {product.category && (
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="inline-block text-sm text-[#c8860a] font-medium hover:underline"
              >
                {product.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a1208] leading-snug">
              {product.title}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isBestSelling && (
                <span className="bg-[#c8860a] text-white text-xs font-bold px-3 py-1 rounded-full">
                  বেস্টসেলার 🏆
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                  {discount}% ছাড়
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#c8860a]">
                {formatPriceEn(Number(product.price))}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPriceEn(Number(product.compareAtPrice))}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm text-green-600 font-semibold">
                  {formatPriceEn(Number(product.compareAtPrice!) - Number(product.price))} সাশ্রয়!
                </span>
              )}
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-[#7a6045]">SKU: {product.sku}</p>
            )}

            {/* Add to Cart */}
            <AddToCartSection product={product} />

            {/* Description */}
            {product.description && (
              <div className="border-t border-[#f0e8d8] pt-5">
                <h3 className="font-semibold text-[#1a1208] mb-3">পণ্যের বিবরণ</h3>
                <div className="prose prose-sm max-w-none text-[#4a2c0a] leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="border-t border-[#f0e8d8] pt-5">
                <h3 className="font-semibold text-[#1a1208] mb-3 text-sm">ট্যাগ</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/shop?search=${encodeURIComponent(tag)}`}
                      className="text-xs px-3 py-1 bg-[#f0e8d8] text-[#4a2c0a] rounded-full hover:bg-[#c8860a] hover:text-white transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-[#1a1208]">
                সম্পর্কিত পণ্য
              </h2>
              {product.category && (
                <Link
                  href={`/shop?category=${product.category.slug}`}
                  className="text-[#c8860a] text-sm font-semibold hover:underline"
                >
                  সব দেখুন →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky add-to-cart for mobile */}
      <StickyCartBar product={product} />
    </>
  );
}
