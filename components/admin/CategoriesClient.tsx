"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Star, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "@/types";
import { getImageUrl } from "@/lib/utils";

interface CategoriesClientProps {
  categories: Category[];
}

interface CategoryFormData {
  name: string;
  slug: string;
  isFeatured: boolean;
  sortOrder: number;
  imageUrl?: string;
}

export default function CategoriesClient({ categories: initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    isFeatured: false,
    sortOrder: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const openAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", isFeatured: false, sortOrder: 0 });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      isFeatured: cat.isFeatured,
      sortOrder: cat.sortOrder,
      imageUrl: cat.imageUrl || undefined,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "categories");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setFormData((f) => ({ ...f, imageUrl: data.url }));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const autoSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .trim();
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) return;
    setIsSaving(true);
    try {
      // Simulate save (replace with API call)
      await new Promise((r) => setTimeout(r, 500));

      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? { ...c, ...formData }
              : c
          )
        );
      } else {
        const newCat: Category = {
          id: "cat-" + Date.now(),
          ...formData,
          imageUrl: formData.imageUrl || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setCategories((prev) => [...prev, newCat]);
      }
      setModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Categories</h2>
          <p className="text-gray-500 text-sm">{categories.length} categories</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#c8860a] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#a06c07] transition-colors"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            layout
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-square bg-[#f0e8d8]">
              {cat.imageUrl ? (
                <Image
                  src={getImageUrl(cat.imageUrl)}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  🧵
                </div>
              )}
              {cat.isFeatured && (
                <div className="absolute top-2 right-2 bg-[#c8860a] text-white rounded-full p-1">
                  <Star size={10} fill="currentColor" />
                </div>
              )}
            </div>

            <div className="p-3">
              <p className="font-semibold text-gray-800 text-sm truncate">{cat.name}</p>
              <p className="text-xs text-gray-400 truncate">{cat.slug}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="flex-1 flex items-center justify-center py-1.5 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="flex-1 flex items-center justify-center py-1.5 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Image</label>
                  <div className="flex items-center gap-3">
                    {formData.imageUrl ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                        <Image src={getImageUrl(formData.imageUrl)} alt="Category" fill className="object-cover" sizes="80px" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">🧵</div>
                    )}
                    <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                      {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                      Upload
                      <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={isUploading} />
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                  <input
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((f) => ({
                        ...f,
                        name: e.target.value,
                        slug: f.slug || autoSlug(e.target.value),
                      }));
                    }}
                    placeholder="কাঁথা"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a]"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
                  <input
                    value={formData.slug}
                    onChange={(e) => setFormData((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="katha"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a]"
                  />
                </div>

                {/* Sort order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a]"
                  />
                </div>

                {/* Featured */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData((f) => ({ ...f, isFeatured: e.target.checked }))}
                    className="w-4 h-4 accent-[#c8860a]"
                  />
                  <span className="text-sm text-gray-700">Featured on Homepage</span>
                </label>

                <button
                  onClick={handleSave}
                  disabled={isSaving || !formData.name || !formData.slug}
                  className="w-full flex items-center justify-center gap-2 bg-[#c8860a] text-white py-3 rounded-xl font-semibold disabled:opacity-70"
                >
                  {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Category"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
