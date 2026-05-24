"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X, Plus, ArrowLeft, ImageIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { productSchema, type ProductInput } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import type { Category, Product } from "@/types";

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(
    product?.images.map((i) => i.imageUrl) || []
  );
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: product
      ? {
          title: product.title,
          slug: product.slug,
          description: product.description || "",
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
          stock: product.stock,
          categoryId: product.categoryId || "",
          isFeatured: product.isFeatured,
          isBestSelling: product.isBestSelling,
          status: product.status,
          sku: product.sku || "",
          tags: product.tags.join(", "),
        }
      : {
          status: "ACTIVE",
          isFeatured: false,
          isBestSelling: false,
          stock: 0,
        },
  });

  const titleValue = watch("title");

  const autoSlug = () => {
    if (titleValue) {
      setValue("slug", generateSlug(titleValue));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "products");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

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
        tags: data.tags
          ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : [],
        images,
      };

      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save product");

      router.push("/admin/products");
    } catch (error) {
      console.error("Product save error:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm"
      >
        <ArrowLeft size={16} />
        Back to Products
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Product Information</h3>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title")}
                  onBlur={autoSlug}
                  placeholder="Enter product title in Bengali"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
                    errors.title
                      ? "border-red-400"
                      : "border-gray-200 focus:border-[#c8860a]"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("slug")}
                  placeholder="product-url-slug"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8860a]"
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={5}
                  placeholder="Product description in Bengali..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8860a] resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tags (comma-separated)
                </label>
                <input
                  {...register("tags")}
                  placeholder="কাঁথা, সিল্ক, রাজশাহী"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8860a]"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Pricing & Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("price")}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
                    errors.price ? "border-red-400" : "border-gray-200 focus:border-[#c8860a]"
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Compare-at Price (৳)
                </label>
                <input
                  {...register("compareAtPrice")}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8860a]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("stock")}
                  type="number"
                  placeholder="0"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
                    errors.stock ? "border-red-400" : "border-gray-200 focus:border-[#c8860a]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  SKU
                </label>
                <input
                  {...register("sku")}
                  placeholder="KTH-001"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8860a]"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Product Images</h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {images.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="120px" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-[#c8860a] text-white text-xs px-1.5 py-0.5 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}

              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#c8860a] flex flex-col items-center justify-center cursor-pointer transition-colors">
                {isUploading ? (
                  <Loader2 size={20} className="text-gray-400 animate-spin" />
                ) : (
                  <>
                    <Plus size={20} className="text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Add Image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>

            <p className="text-xs text-gray-400">
              First image will be the main product image. Max 5MB per image.
            </p>
          </div>
        </div>

        {/* Sidebar options */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Product Status</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  {...register("status")}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#c8860a]"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register("isFeatured")}
                  type="checkbox"
                  className="w-4 h-4 accent-[#c8860a]"
                />
                <span className="text-sm text-gray-700">Featured Product</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register("isBestSelling")}
                  type="checkbox"
                  className="w-4 h-4 accent-[#c8860a]"
                />
                <span className="text-sm text-gray-700">Best Selling</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Category</h3>
            <select
              {...register("categoryId")}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#c8860a]"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Save buttons */}
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#c8860a] hover:bg-[#a06c07] disabled:opacity-70 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                product ? "Update Product" : "Save Product"
              )}
            </motion.button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
