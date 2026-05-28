"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import type { Category, Product } from "@/types";

interface ProductsClientProps {
  products: Product[];
  categories: Category[];
}

export default function ProductsClient({ products: initialProducts, categories }: ProductsClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      status: "ACTIVE",
      isFeatured: false,
      isBestSelling: false,
      stock: 0,
    },
  });

  const titleValue = watch("title");

  const openAdd = () => {
    reset({ status: "ACTIVE", isFeatured: false, isBestSelling: false, stock: 0 });
    setImages([]);
    setModalOpen(true);
  };

  const autoSlug = () => {
    if (titleValue) setValue("slug", generateSlug(titleValue));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "products");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.ok) {
          const data = await res.json();
          setImages((prev) => [...prev, data.url]);
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        images,
      };
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save product");
      const saved = await res.json();
      setProducts((prev) => [saved, ...prev]);
      setModalOpen(false);
    } catch {
      alert("Failed to save product. Please try again.");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">All Products</h2>
          <p className="text-gray-500 text-sm">{products.length} products total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#c8860a] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#a06c07] transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">#</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Stock</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product, i) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800 max-w-xs truncate">{product.title}</p>
                      <p className="text-xs text-gray-400">{product.sku}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-800">৳{Number(product.price).toLocaleString()}</span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-gray-400 line-through ml-1">৳{Number(product.compareAtPrice).toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock === 0 ? "text-red-600" : product.stock < 5 ? "text-orange-600" : "text-green-600"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === "ACTIVE" ? "bg-green-100 text-green-700"
                      : product.status === "OUT_OF_STOCK" ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}`} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" aria-label="Edit">
                        <Pencil size={15} />
                      </Link>
                      <a href={`/product/${product.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" aria-label="View">
                        <Eye size={15} />
                      </a>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
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
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h3 className="font-bold text-gray-800 text-lg">Add New Product</h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
                <div className="grid md:grid-cols-3 gap-5">
                  {/* Main info — 2 cols */}
                  <div className="md:col-span-2 space-y-5">
                    {/* Product Info */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                      <h4 className="font-semibold text-gray-700 text-sm">Product Information</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Title <span className="text-red-500">*</span></label>
                        <input
                          {...register("title")}
                          onBlur={autoSlug}
                          placeholder="Enter product title"
                          className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${errors.title ? "border-red-400" : "border-gray-200 focus:border-[#c8860a]"}`}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug <span className="text-red-500">*</span></label>
                        <input
                          {...register("slug")}
                          placeholder="product-url-slug"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a]"
                        />
                        {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea
                          {...register("description")}
                          rows={3}
                          placeholder="Product description..."
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a] resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma-separated)</label>
                        <input
                          {...register("tags")}
                          placeholder="katha, silk, rajshahi"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a]"
                        />
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                      <h4 className="font-semibold text-gray-700 text-sm">Pricing & Inventory</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (৳) <span className="text-red-500">*</span></label>
                          <input
                            {...register("price")}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${errors.price ? "border-red-400" : "border-gray-200 focus:border-[#c8860a]"}`}
                          />
                          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Compare-at Price (৳)</label>
                          <input
                            {...register("compareAtPrice")}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock <span className="text-red-500">*</span></label>
                          <input
                            {...register("stock")}
                            type="number"
                            placeholder="0"
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${errors.stock ? "border-red-400" : "border-gray-200 focus:border-[#c8860a]"}`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU</label>
                          <input
                            {...register("sku")}
                            placeholder="KTH-001"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Images */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-700 text-sm mb-3">Product Images</h4>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        {images.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                            <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="80px" />
                            <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                              <X size={8} />
                            </button>
                            {i === 0 && <span className="absolute bottom-1 left-1 bg-[#c8860a] text-white text-xs px-1 py-0.5 rounded">Main</span>}
                          </div>
                        ))}
                        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#c8860a] flex flex-col items-center justify-center cursor-pointer transition-colors">
                          {isUploading ? <Loader2 size={16} className="text-gray-400 animate-spin" /> : <><Plus size={16} className="text-gray-400" /><span className="text-xs text-gray-400 mt-1">Add</span></>}
                          <input type="file" accept="image/*" multiple className="sr-only" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">First image is the main image. Max 5MB each.</p>
                    </div>
                  </div>

                  {/* Sidebar — 1 col */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <h4 className="font-semibold text-gray-700 text-sm">Status</h4>
                      <select
                        {...register("status")}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#c8860a] bg-white"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="OUT_OF_STOCK">Out of Stock</option>
                      </select>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input {...register("isFeatured")} type="checkbox" className="w-4 h-4 accent-[#c8860a]" />
                        <span className="text-sm text-gray-700">Featured Product</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input {...register("isBestSelling")} type="checkbox" className="w-4 h-4 accent-[#c8860a]" />
                        <span className="text-sm text-gray-700">Best Selling</span>
                      </label>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-700 text-sm mb-3">Category</h4>
                      <select
                        {...register("categoryId")}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#c8860a] bg-white"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#c8860a] hover:bg-[#a06c07] disabled:opacity-70 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : "Save Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
