"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight, Phone, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { dummySiteSettings } from "@/lib/dummy-data";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

export default function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-[70] w-72 bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#e0d0b0] bg-[#c8860a]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#c8860a] font-bold text-sm">
                  শি
                </div>
                <span className="text-white font-bold text-lg">শিল্পেরহাট</span>
              </div>
              <button
                onClick={onClose}
                className="text-white p-1"
                aria-label="মেনু বন্ধ করুন"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-5 py-4 text-[#1a1208] hover:bg-[#fdf8f3] hover:text-[#c8860a] transition-colors border-b border-[#f0e8d8]"
                >
                  <span className="font-medium">{link.label}</span>
                  <ChevronRight size={16} className="text-[#7a6045]" />
                </Link>
              ))}

              <div className="pt-2">
                <p className="px-5 py-2 text-xs text-[#7a6045] font-semibold uppercase tracking-wider">
                  আমাদের সাথে যোগাযোগ করুন
                </p>
                <a
                  href={`https://wa.me/${dummySiteSettings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-4 text-[#16a34a] hover:bg-[#fdf8f3] transition-colors"
                >
                  <MessageCircle size={20} />
                  <span className="font-medium">WhatsApp</span>
                </a>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[#e0d0b0] bg-[#fdf8f3]">
              <p className="text-xs text-center text-[#7a6045]">
                © ২০২৪ শিল্পেরহাট। হস্তশিল্পের আপন ঘর।
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
