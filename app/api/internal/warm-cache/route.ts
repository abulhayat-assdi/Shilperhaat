import { timingSafeEqual } from "node:crypto";
import { revalidateSite } from "@/lib/site-cache";

export const runtime = "nodejs";

// Called once by scripts/warm-cache.cjs right after the container starts.
// The Docker build has no database, so every prerendered page (home, CMS
// pages, blog shell, sitemap) holds fallback data until it is
// re-rendered. This flushes them so the first visitors get real content.
//
// CACHE_WARM_TOKEN is generated at container start and never leaves the
// container. Anything that is not an exact token match gets a plain 404, so
// the endpoint is indistinguishable from a missing route.

const MIN_TOKEN_LENGTH = 32;

function notFound() {
  return new Response("Not Found", { status: 404 });
}

function tokenMatches(provided: string | null): boolean {
  const expected = process.env.CACHE_WARM_TOKEN;
  if (!expected || expected.length < MIN_TOKEN_LENGTH || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function GET() {
  return notFound();
}

export async function POST(req: Request) {
  if (!tokenMatches(req.headers.get("x-cache-warm-token"))) return notFound();
  revalidateSite();
  return Response.json({ revalidated: true, now: Date.now() });
}
