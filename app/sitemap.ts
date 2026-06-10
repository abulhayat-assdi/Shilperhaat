import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL || "https://shilperhaat.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.3,
    },
  ];

  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = (categories as any[]).map((cat: any) => ({
      url: `${baseUrl}/shop?category=${cat.slug}`,
      lastModified: new Date(cat.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const productRoutes: MetadataRoute.Sitemap = (products as any[]).map((product: any) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
