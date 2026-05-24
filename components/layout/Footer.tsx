import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { dummySiteSettings } from "@/lib/dummy-data";

// Inline SVG social icons (lucide-react doesn't include social brand icons)
function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}
function YoutubeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    information: [
      { href: "/about", label: "আমাদের সম্পর্কে" },
      { href: "/blog", label: "ব্লগ" },
      { href: "/careers", label: "ক্যারিয়ার" },
      { href: "/press", label: "প্রেস" },
    ],
    shop: [
      { href: "/shop?category=katha", label: "কাঁথা" },
      { href: "/shop?category=chador", label: "চাদর" },
      { href: "/shop?category=kambal", label: "কম্বল" },
      { href: "/shop?category=nakshi-katha", label: "নকশিকাঁথা" },
      { href: "/shop?category=muslin", label: "মসলিন" },
    ],
    support: [
      { href: "/contact", label: "যোগাযোগ" },
      { href: "/faq", label: "প্রশ্ন ও উত্তর" },
      { href: "/track-order", label: "অর্ডার ট্র্যাক করুন" },
      { href: "/shipping", label: "শিপিং তথ্য" },
    ],
    policy: [
      { href: "/privacy", label: "গোপনীয়তা নীতি" },
      { href: "/terms", label: "ব্যবহারের শর্তাবলি" },
      { href: "/refund", label: "ফেরত নীতি" },
      { href: "/delivery", label: "ডেলিভারি নীতি" },
    ],
  };

  return (
    <footer className="bg-[#1a1208] text-white mt-12">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#c8860a] flex items-center justify-center text-white font-bold">
                শি
              </div>
              <div>
                <div className="text-lg font-bold">শিল্পেরহাট</div>
                <div className="text-xs text-[#c8a060]">হস্তশিল্পের আপন ঘর</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              বাংলার ঐতিহ্যবাহী হস্তশিল্পকে ঘরে পৌঁছে দেওয়াই আমাদের লক্ষ্য। সেরা মানের কাঁথা, চাদর ও কম্বল।
            </p>

            {/* Contact */}
            <div className="space-y-2 text-sm text-gray-400 mb-4">
              <a
                href={`https://wa.me/${dummySiteSettings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#c8860a] transition-colors"
              >
                <Phone size={14} />
                <span>{dummySiteSettings.whatsappNumber}</span>
              </a>
              <a
                href="mailto:info@shilperhaat.com"
                className="flex items-center gap-2 hover:text-[#c8860a] transition-colors"
              >
                <Mail size={14} />
                <span>info@shilperhaat.com</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com/shilperhaat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c8860a] transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={14} />
              </a>
              <a
                href="https://instagram.com/shilperhaat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c8860a] transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={14} />
              </a>
              <a
                href="https://youtube.com/@shilperhaat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c8860a] transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon size={14} />
              </a>
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold text-[#f5d78e] mb-4 text-sm uppercase tracking-wider">
              তথ্য
            </h3>
            <ul className="space-y-2">
              {footerLinks.information.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#c8860a] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop By */}
          <div>
            <h3 className="font-semibold text-[#f5d78e] mb-4 text-sm uppercase tracking-wider">
              পণ্য বিভাগ
            </h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#c8860a] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-[#f5d78e] mb-4 text-sm uppercase tracking-wider">
              সাহায্য
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#c8860a] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h3 className="font-semibold text-[#f5d78e] mb-4 text-sm uppercase tracking-wider">
              নীতিমালা
            </h3>
            <ul className="space-y-2">
              {footerLinks.policy.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#c8860a] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>
            {dummySiteSettings.footerCopyright ||
              `© ${currentYear} শিল্পেরহাট। সর্বস্বত্ব সংরক্ষিত।`}
          </p>
          <p className="text-xs">
            বাংলাদেশের হস্তশিল্পকারীদের সহায়তায় তৈরি ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
