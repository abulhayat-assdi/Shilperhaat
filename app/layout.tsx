import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Shilperhaat — Bangladesh's Finest Handcraft Textiles",
    template: "%s | Shilperhaat",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Shilperhaat",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={openSans.variable}>
      <head>
        {/* Resource hints for external image CDN */}
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
