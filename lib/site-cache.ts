import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// Every unstable_cache tag used by the site. revalidateSite() flushes all of them.
export const CACHE_TAGS = {
  siteSettings: "site-settings",
} as const;

/**
 * Call inside the catch block of a page/layout data query.
 *
 * During `next build` (the Docker build has no database) the error is
 * swallowed so the caller can render its empty/fallback state. At runtime the
 * error is rethrown, so ISR keeps serving the last good copy instead of
 * caching an empty page or a 404 produced by a short DB outage.
 */
export function rethrowAtRuntime(err: unknown): void {
  if (process.env.NEXT_PHASE !== "phase-production-build") throw err;
}

/**
 * Invalidates every cached page and every tagged data entry. Use after admin
 * mutations only. Public submissions must revalidate just the affected paths,
 * otherwise anyone could flush the whole cache by spamming a form.
 *
 * `{ expire: 0 }` makes the next request render fresh (route handlers have no
 * updateTag; "max" would serve one more stale response).
 */
export function revalidateSite(): void {
  for (const tag of Object.values(CACHE_TAGS)) {
    revalidateTag(tag, { expire: 0 });
  }
  revalidatePath("/", "layout");
}

/**
 * Refreshes only the product pages whose stock changed (order placed,
 * cancelled or deleted). Scoped on purpose: placing an order is public, so it
 * must not flush the whole site. Never throws, so it cannot fail an order.
 */
export async function revalidateProductPages(
  productIds: (string | null | undefined)[]
): Promise<void> {
  const ids = [...new Set(productIds.filter((id): id is string => !!id))];
  if (ids.length === 0) return;
  try {
    const products: { slug: string }[] = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    });
    for (const { slug } of products) revalidatePath(`/product/${slug}`);
  } catch (err) {
    console.error("revalidateProductPages failed", err);
  }
}

// Site settings are read by the root layout on every render, including the
// dynamic routes (/shop, /admin), so they get their own data cache entry.
// Not wrapped in try/catch on purpose: a thrown error is never cached.
const getCachedSiteSettings = unstable_cache(
  async () => prisma.siteSetting.findFirst(),
  ["site-settings"],
  { tags: [CACHE_TAGS.siteSettings], revalidate: 3600 }
);

export async function getSiteSettings() {
  try {
    return await getCachedSiteSettings();
  } catch (err) {
    rethrowAtRuntime(err);
    return null;
  }
}
