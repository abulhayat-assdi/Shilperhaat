import type { Metadata } from "next";
import { Open_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
  preload: true,
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
  preload: false,
});

async function getSiteSettings() {
  try {
    return await prisma.siteSetting.findFirst();
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName || "Shilperhaat";
  const faviconUrl = settings?.faviconUrl || "/favicon.ico";
  const logoUrl = settings?.logoUrl;

  return {
    title: {
      default: `${siteName} — Bangladesh's Finest Handcraft Textiles`,
      template: `%s | ${siteName}`,
    },
    description:
      "Shop Bangladesh's best handcraft textiles — Katha, Chadar, Blankets, Nakshi Katha and much more at Shilperhaat.",
    keywords: [
      "katha",
      "nakshi katha",
      "chadar",
      "blanket",
      "handcraft",
      "bangladesh",
      "shilperhaat",
      "textile",
    ],
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName,
      ...(logoUrl && { images: [{ url: logoUrl }] }),
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${hindSiliguri.variable}`}>
      <head>
        {/* Resource hints for external image CDN */}
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
