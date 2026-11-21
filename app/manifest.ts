import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site-cache";

// Built without a DB (Docker), so refresh every minute; admin settings
// changes flush it immediately via revalidateSite().
export const revalidate = 60;

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();
  const name = settings?.siteName || "Shilperhaat";

  return {
    name: `${name} — Bangladesh's Finest Handcraft Textiles`,
    short_name: name,
    description:
      "Shop Bangladesh's best handcraft textiles — Katha, Chadar, Blankets, Nakshi Katha and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#800000",
    icons: settings?.faviconUrl
      ? [{ src: settings.faviconUrl, sizes: "any" }]
      : [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
  };
}
