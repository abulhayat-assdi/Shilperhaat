"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Upload } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { SiteSetting } from "@/types";
import { siteSettingSchema, type SiteSettingInput } from "@/lib/validations";
import { getImageUrl } from "@/lib/utils";

interface SettingsClientProps {
  settings: SiteSetting;
}

export default function SettingsClient({ settings }: SettingsClientProps) {
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(siteSettingSchema) as any,
    defaultValues: {
      siteName: settings.siteName,
      footerCopyright: settings.footerCopyright || "",
      whatsappNumber: settings.whatsappNumber || "",
      deliveryCharge: settings.deliveryCharge,
      freeDeliveryMin: settings.freeDeliveryMin || undefined,
    },
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "brand");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setLogoUrl(data.url);
      }
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      // TODO: Save to DB via API
      await new Promise((r) => setTimeout(r, 600));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save settings");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Brand */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Brand Settings</h3>

        {/* Logo */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              {logoUrl ? (
                <Image src={getImageUrl(logoUrl)} alt="Logo" width={96} height={96} className="object-contain" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#c8860a] flex items-center justify-center text-white font-bold text-lg">শি</div>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                {isUploadingLogo ? (
                  <><Loader2 size={14} className="animate-spin" /> Uploading...</>
                ) : (
                  <><Upload size={14} /> Upload Logo</>
                )}
                <input type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} disabled={isUploadingLogo} />
              </label>
              <p className="text-xs text-gray-400 mt-1">PNG or SVG recommended. Max 2MB.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Name</label>
            <input
              {...register("siteName")}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a]"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Footer Copyright Text</label>
            <input
              {...register("footerCopyright")}
              placeholder="© 2024 শিল্পেরহাট। সর্বস্বত্ব সংরক্ষিত।"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a]"
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Contact & Social</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
          <input
            {...register("whatsappNumber")}
            placeholder="01700000000"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a]"
          />
          <p className="text-xs text-gray-400 mt-1">Without country code. Used for WhatsApp button.</p>
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Delivery Settings</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Charge (৳)</label>
            <input
              {...register("deliveryCharge")}
              type="number"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a]"
            />
            {errors.deliveryCharge && (
              <p className="text-red-500 text-xs mt-1">{errors.deliveryCharge.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Free Delivery Above (৳)
            </label>
            <input
              {...register("freeDeliveryMin")}
              type="number"
              placeholder="e.g. 2000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8860a]"
            />
            <p className="text-xs text-gray-400 mt-1">Leave empty to disable free delivery</p>
          </div>
        </div>
      </div>

      {/* Save button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting}
        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-colors ${
          saved
            ? "bg-green-500 text-white"
            : "bg-[#c8860a] hover:bg-[#a06c07] text-white disabled:opacity-70"
        }`}
      >
        {isSubmitting ? (
          <><Loader2 size={16} className="animate-spin" /> Saving...</>
        ) : saved ? (
          <>✓ Saved!</>
        ) : (
          <><Save size={16} /> Save Settings</>
        )}
      </motion.button>
    </form>
  );
}
