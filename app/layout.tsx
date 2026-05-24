import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "শিল্পেরহাট — বাংলার ঐতিহ্যবাহী হস্তশিল্প",
    template: "%s | শিল্পেরহাট",
  },
  description:
    "শিল্পেরহাটে পাবেন বাংলাদেশের সেরা হস্তশিল্প পণ্য — কাঁথা, চাদর, কম্বল, নকশিকাঁথা এবং আরো অনেক কিছু।",
  keywords: [
    "কাঁথা",
    "নকশিকাঁথা",
    "চাদর",
    "কম্বল",
    "হস্তশিল্প",
    "বাংলাদেশ",
    "shilperhaat",
  ],
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "শিল্পেরহাট",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="antialiased">{children}</body>
    </html>
  );
}
