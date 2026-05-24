"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { dummySiteSettings } from "@/lib/dummy-data";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "হোম" },
    { href: "/shop", label: "সকল পণ্য" },
    { href: "/shop?category=katha", label: "কাঁথা" },
    { href: "/shop?category=chador", label: "চাদর" },
    { href: "/shop?category=kambal", label: "কম্বল" },
    { href: "/shop?category=nakshi-katha", label: "নকশিকাঁথা" },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`hidden md:block sticky top-0 z-50 transition-shadow duration-200 ${
          isScrolled ? "shadow-md" : "shadow-sm"
        } bg-white`}
      >
        {/* Top bar */}
        <div className="bg-[#c8860a] text-white text-sm py-1.5 text-center">
          <p>বিনামূল্যে ডেলিভারি — ২০০০ টাকার উপরে অর্ডারে ✨</p>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#c8860a] flex items-center justify-center text-white font-bold text-lg">
                শি
              </div>
              <div>
                <div className="text-xl font-bold text-[#1a1208] leading-tight">
                  শিল্পেরহাট
                </div>
                <div className="text-xs text-[#7a6045]">
                  হস্তশিল্পের আপন ঘর
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#4a2c0a] hover:text-[#c8860a] font-medium text-sm transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            {searchOpen ? (
              <div className="flex items-center gap-2 border border-[#e0d0b0] rounded-full px-4 py-2">
                <Search size={16} className="text-[#7a6045]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="পণ্য খুঁজুন..."
                  className="outline-none text-sm w-48 text-[#1a1208] placeholder:text-[#7a6045]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                    }
                    if (e.key === "Escape") {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }
                  }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                  <X size={16} className="text-[#7a6045]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-[#f0e8d8] transition-colors"
                aria-label="পণ্য খুঁজুন"
              >
                <Search size={20} className="text-[#4a2c0a]" />
              </button>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-[#f0e8d8] transition-colors"
              aria-label="কার্ট"
            >
              <ShoppingCart size={20} className="text-[#4a2c0a]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c8860a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header
        className={`md:hidden sticky top-0 z-50 bg-white transition-shadow duration-200 ${
          isScrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5"
            aria-label="মেনু খুলুন"
          >
            <Menu size={22} className="text-[#4a2c0a]" />
          </button>

          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-[#c8860a] flex items-center justify-center text-white font-bold text-sm">
              শি
            </div>
            <span className="text-lg font-bold text-[#1a1208]">শিল্পেরহাট</span>
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5"
              aria-label="পণ্য খুঁজুন"
            >
              <Search size={20} className="text-[#4a2c0a]" />
            </button>
            <Link href="/cart" className="relative p-1.5" aria-label="কার্ট">
              <ShoppingCart size={20} className="text-[#4a2c0a]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#c8860a] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 border border-[#e0d0b0] rounded-full px-4 py-2 bg-[#fdf8f3]">
              <Search size={16} className="text-[#7a6045]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="পণ্য খুঁজুন..."
                className="flex-1 outline-none text-sm bg-transparent text-[#1a1208] placeholder:text-[#7a6045]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X size={14} className="text-[#7a6045]" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
      />
    </>
  );
}
