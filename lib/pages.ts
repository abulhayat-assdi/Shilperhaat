import { prisma } from "@/lib/prisma";
import { DEFAULT_PAGES, PageContent, PageSection } from "@/lib/pages-data";
import type { Prisma } from "@prisma/client";

// Seeds the pages table from DEFAULT_PAGES on first use, so existing
// content is preserved while all subsequent edits live in the database.
export async function ensurePagesSeeded(): Promise<void> {
  const count = await prisma.page.count();
  if (count > 0) return;
  await prisma.page.createMany({
    data: DEFAULT_PAGES.map((p) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      sections: p.sections as unknown as Prisma.InputJsonValue,
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
      isPublished: p.isPublished,
    })),
    skipDuplicates: true,
  });
}

export function serializePage(p: {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  sections: unknown;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  updatedAt: Date;
}): PageContent {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    sections: (Array.isArray(p.sections) ? p.sections : []) as PageSection[],
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    isPublished: p.isPublished,
    updatedAt: p.updatedAt.toISOString(),
  };
}

// Returns the published page from the DB. Falls back to the bundled
// defaults when the database is unreachable (e.g. during `next build`).
export async function getPublishedPage(slug: string): Promise<PageContent | null> {
  try {
    await ensurePagesSeeded();
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) return DEFAULT_PAGES.find((p) => p.slug === slug && p.isPublished) || null;
    if (!page.isPublished) return null;
    return serializePage(page);
  } catch {
    return DEFAULT_PAGES.find((p) => p.slug === slug && p.isPublished) || null;
  }
}

export async function getPageMetadata(slug: string): Promise<{ title: string; description: string }> {
  const page = await getPublishedPage(slug);
  const fallback = DEFAULT_PAGES.find((p) => p.slug === slug);
  return {
    title: page?.metaTitle || fallback?.metaTitle || "Shilperhaat",
    description: page?.metaDescription || fallback?.metaDescription || "",
  };
}
