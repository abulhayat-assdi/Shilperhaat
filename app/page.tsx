/**
 * NOTE: The homepage is served by app/(public)/page.tsx via the route group.
 * Route groups like (public) don't affect URLs, so (public)/page.tsx maps to /.
 *
 * IMPORTANT: If you get a "Conflicting pages detected" build error,
 * please DELETE this file (app/page.tsx) and keep only app/(public)/page.tsx.
 */

// Provide a fallback default export required by Next.js page convention.
// The (public)/page.tsx should take precedence in route resolution.
export default function RootPage() {
  return null;
}
