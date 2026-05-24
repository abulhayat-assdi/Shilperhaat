import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { getImageUrl } from "@/lib/utils";
import SectionHeader from "@/components/ui/SectionHeader";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const featured = categories.filter((c) => c.isFeatured).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="py-8 md:py-12 px-4 max-w-7xl mx-auto">
      <SectionHeader
        title="পণ্য বিভাগ"
        subtitle="আমাদের ঐতিহ্যবাহী টেক্সটাইল সংগ্রহ থেকে বেছে নিন"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {featured.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>
    </section>
  );
}

const categoryColors = [
  "from-[#c8860a]/80 to-[#7a4a1a]/80",
  "from-[#4a2c0a]/80 to-[#8b5e3c]/80",
  "from-[#7a6045]/80 to-[#4a2c0a]/80",
  "from-[#a06c07]/80 to-[#c8860a]/80",
];

function CategoryCard({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  const imageUrl = getImageUrl(category.imageUrl);
  const gradientClass = categoryColors[index % categoryColors.length];

  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group relative overflow-hidden rounded-xl aspect-square shadow-sm hover:shadow-md transition-shadow"
      aria-label={`${category.name} বিভাগ দেখুন`}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, 25vw"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Fallback gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`}
      />

      {/* Content overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
        <h3 className="text-white font-bold text-sm md:text-base leading-tight">
          {category.name}
        </h3>
        <p className="text-white/70 text-xs mt-0.5 group-hover:text-[#f5d78e] transition-colors">
          দেখুন →
        </p>
      </div>

      {/* Hover ring */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-[#c8860a] opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
