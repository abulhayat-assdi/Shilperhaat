type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, boolean | undefined | null>
  | ClassValue[];

// Simple cn utility (no external clsx dependency)
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .filter(Boolean)
    .map((input) => {
      if (typeof input === "string" || typeof input === "number") return String(input);
      if (Array.isArray(input)) return cn(...input);
      if (typeof input === "object" && input !== null) {
        return Object.entries(input)
          .filter(([, v]) => Boolean(v))
          .map(([k]) => k)
          .join(" ");
      }
      return "";
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

// Format price in Bengali/BDT format
export function formatPrice(price: number): string {
  return `৳${price.toLocaleString("bn-BD")}`;
}

// Format price in English
export function formatPriceEn(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}

// Calculate discount percentage
export function calculateDiscount(price: number, compareAtPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

// Generate slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Generate order number
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `SH${year}${month}${day}${random}`;
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// Format date in Bengali
export function formatDateBn(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format date in English
export function formatDateEn(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Order status labels in Bengali
export const ORDER_STATUS_BN: Record<string, string> = {
  PENDING: "অপেক্ষমাণ",
  CONFIRMED: "নিশ্চিত",
  PROCESSING: "প্রক্রিয়াধীন",
  SHIPPED: "পাঠানো হয়েছে",
  DELIVERED: "পৌঁছে গেছে",
  CANCELLED: "বাতিল",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

// Product status labels
export const PRODUCT_STATUS_BN: Record<string, string> = {
  ACTIVE: "সক্রিয়",
  INACTIVE: "নিষ্ক্রিয়",
  OUT_OF_STOCK: "স্টক নেই",
};

// Rating stars
export function getStars(rating: number): { full: number; empty: number } {
  const full = Math.round(rating);
  return { full, empty: 5 - full };
}

// Image URL helper
export function getImageUrl(url: string | null | undefined): string {
  if (!url) return "/placeholder-product.jpg";
  if (url.startsWith("http")) return url;
  return url;
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
