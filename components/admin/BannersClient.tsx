"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Banner } from "@/types";
import { getImageUrl } from "@/lib/utils";

interface BannersClientProps {
  banners: Banner[];
}

export default function BannersClient({ banners: initialBanners }: BannersClientProps) {
  const [banners, setBanners] = useState(initialBanners);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<Partial<Banner>>({
    isActive: true,
    sortOrder: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const openAdd = () => {
    setEditingBanner(null);
    setFormData({ isActive: true, sortOrder: 0 });
    setModalOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData(banner);
    setModalOpen(true);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "desktop" | "mobile"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "banners");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        if (type === "desktop") {
          setFormData((f) => ({ ...f, imageUrl: data.url }));
        } else {
          setFormData((f) => ({ ...f, mobileImageUrl: data.url }));
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.imageUrl) {
      alert("Please upload a banner image");
      return;
    }
    setIsSaving(true);
    try {
      const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : "/api/admin/banners";
      const res = await fetch(url, {
        method: editingBanner ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      if (editingBanner) {
        setBanners((prev) => prev.map((b) => (b.id === editingBanner.id ? data.banner : b)));
      } else {
        setBanners((prev) => [...prev, data.banner]);
      }
      setModalOpen(false);
    } catch {
      alert("Failed to save banner. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (!banner) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
      });
      if (res.ok) setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)));
    } catch {
      // silent fail
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (res.ok) setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Failed to delete banner.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Hero Banners</h2>
          <p className="text-gray-500 text-sm">{banners.length} banners</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#800000] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#5C0000] transition-colors"
        >
          <Plus size={16} />
          Add Banner
        </button>
      </div>

      {/* Banners list */}
      <div className="space-y-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`bg-white rounded-2xl border overflow-hidden ${
              banner.isActive ? "border-gray-200" : "border-gray-200 opacity-60"
            }`}
          >
            <div className="flex items-stretch">
              {/* Preview */}
              <div className="relative w-48 flex-shrink-0 bg-gray-100">
                <Image
                  src={getImageUrl(banner.imageUrl)}
                  alt={banner.title || "Banner"}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="192px"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-product.svg";
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {banner.title || "(No title)"}
                    </h3>
                    {banner.subtitle && (
                      <p className="text-sm text-gray-500 mt-0.5">{banner.subtitle}</p>
                    )}
                    {banner.buttonText && (
                      <span className="inline-block mt-2 text-xs bg-[#fdf8f3] border border-[#e0d0b0] text-[#800000] px-2 py-0.5 rounded-full">
                        Button: {banner.buttonText}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      banner.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => openEdit(banner)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 text-xs font-medium transition-colors"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => toggleActive(banner.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium transition-colors"
                  >
                    {banner.isActive ? <EyeOff size={12} /> : <Eye size={12} />}
                    {banner.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 text-xs font-medium transition-colors"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🖼️</div>
            <p>No banners yet. Add your first banner!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800">
                  {editingBanner ? "Edit Banner" : "Add Banner"}
                </h3>
                <button onClick={() => setModalOpen(false)}>
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Desktop image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Desktop Image <span className="text-red-500">*</span>
                  </label>
                  {formData.imageUrl ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100 mb-2">
                      <Image src={getImageUrl(formData.imageUrl)} alt="Banner" fill unoptimized className="object-cover" sizes="400px" />
                    </div>
                  ) : null}
                  <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-[#800000] transition-colors">
                    {isUploading ? <Loader2 size={16} className="animate-spin text-gray-400" /> : <Plus size={16} className="text-gray-400" />}
                    <span className="text-sm text-gray-500">Upload Desktop Image (recommended: 1920×600)</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleImageUpload(e, "desktop")} />
                  </label>
                </div>

                {/* Mobile image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Image (optional)</label>
                  <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-xl p-3 cursor-pointer hover:border-[#800000] transition-colors">
                    <Plus size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Upload Mobile Image (recommended: 768×400)</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleImageUpload(e, "mobile")} />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                    <input
                      value={formData.title || ""}
                      onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Banner title"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#800000]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Button Text</label>
                    <input
                      value={formData.buttonText || ""}
                      onChange={(e) => setFormData((f) => ({ ...f, buttonText: e.target.value }))}
                      placeholder="Shop Now"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                  <input
                    value={formData.subtitle || ""}
                    onChange={(e) => setFormData((f) => ({ ...f, subtitle: e.target.value }))}
                    placeholder="Banner subtitle"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#800000]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Button Link</label>
                  <input
                    value={formData.buttonLink || ""}
                    onChange={(e) => setFormData((f) => ({ ...f, buttonLink: e.target.value }))}
                    placeholder="/shop"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#800000]"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData((f) => ({ ...f, isActive: e.target.checked }))}
                    className="w-4 h-4 accent-[#800000]"
                  />
                  <span className="text-sm text-gray-700">Active (visible on site)</span>
                </label>

                <button
                  onClick={handleSave}
                  disabled={isSaving || !formData.imageUrl}
                  className="w-full flex items-center justify-center gap-2 bg-[#800000] text-white py-3 rounded-xl font-semibold disabled:opacity-70"
                >
                  {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Banner"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
