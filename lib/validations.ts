import { z } from "zod";

// Admin login
export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Product form
export const productSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isBestSelling: z.boolean().default(false),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).default("ACTIVE"),
  sku: z.string().optional().nullable(),
  tags: z.string().optional(), // comma-separated
});

// Category form
export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

// Banner form
export const bannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

// Review form
export const reviewSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  content: z.string().min(1, "Review content is required"),
  role: z.string().optional(),
  isVisible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

// Checkout form
export const checkoutSchema = z.object({
  customerName: z.string().min(2, "নাম দিন").max(100),
  phone: z
    .string()
    .min(11, "সঠিক ফোন নম্বর দিন")
    .max(15)
    .regex(/^[0-9+\-\s]+$/, "সঠিক ফোন নম্বর দিন"),
  address: z.string().min(10, "সম্পূর্ণ ঠিকানা দিন").max(500),
  notes: z.string().max(500).optional(),
});

// Site settings form
export const siteSettingSchema = z.object({
  siteName: z.string().min(1).max(100),
  footerCopyright: z.string().optional(),
  whatsappNumber: z.string().optional(),
  deliveryCharge: z.coerce.number().min(0).default(0),
  freeDeliveryMin: z.coerce.number().min(0).optional().nullable(),
});

// Order status update
export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  adminNote: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type BannerInput = z.infer<typeof bannerSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type SiteSettingInput = z.infer<typeof siteSettingSchema>;
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
