"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteLayout } from "@/lib/site-layout-context";
import {
  LayoutDashboard, Package, Grid3X3, ImageIcon,
  Star, ShoppingBag, Settings, LogOut, ExternalLink, X, Menu, Layout, FileText, MessageSquare,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard",       icon: LayoutDashboard, label: "Dashboard"      },
  { href: "/admin/products",        icon: Package,         label: "Products"       },
  { href: "/admin/categories",      icon: Grid3X3,         label: "Categories"     },
  { href: "/admin/banners",         icon: ImageIcon,       label: "Banners"        },
  { href: "/admin/reviews",         icon: Star,            label: "Reviews"        },
  { href: "/admin/orders",          icon: ShoppingBag,     label: "Orders"         },
  { href: "/admin/pages",           icon: FileText,        label: "Pages"          },
  { href: "/admin/site-layout",     icon: Layout,          label: "Site Layout"    },
  { href: "/admin/contact-widget",  icon: MessageSquare,   label: "Contact Widget" },
  { href: "/admin/settings",        icon: Settings,        label: "Settings"       },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  adminName?: string;
}

export default function AdminLayout({ children, title, adminName }: AdminLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);
  const { data: layout } = useSiteLayout();

  return (
    <div className="bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-[#1a1208] text-white fixed top-0 left-0 h-screen w-60 overflow-hidden z-[100]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 flex-shrink-0">
          {layout.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={layout.logoUrl}
              alt={layout.siteName}
              style={{ maxHeight: 36, maxWidth: 120, width: "auto", height: "auto", objectFit: "contain", display: "block" }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#c8860a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {layout.logoLetter || "S"}
            </div>
          )}
        </div>

        <nav className="flex-1 py-2 overflow-hidden">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-[10px] mx-2 rounded-lg transition-colors mb-0.5 ${
                  active
                    ? "bg-[#c8860a] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                <span className="text-[13px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3 space-y-1 flex-shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm"
          >
            <ExternalLink size={16} />
            Website
          </a>
          <a
            href="/api/admin/logout"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm"
          >
            <LogOut size={16} />
            Logout
          </a>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-60 bg-[#1a1208] text-white flex flex-col md:hidden">
            <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                {layout.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={layout.logoUrl}
                    alt={layout.siteName}
                    style={{ maxHeight: 32, maxWidth: 110, width: "auto", height: "auto", objectFit: "contain", display: "block" }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#c8860a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {layout.logoLetter || "S"}
                  </div>
                )}
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-white/60">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 py-4">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors mb-0.5 ${
                      active ? "bg-[#c8860a] text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="md:ml-60 h-screen overflow-y-auto flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-[#eee] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-[#1a1a1a]">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#c8860a] flex items-center justify-center text-white font-bold text-sm">
              {(adminName || "A").charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-700 hidden md:block">{adminName || "Admin"}</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
