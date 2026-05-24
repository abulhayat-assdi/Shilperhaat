import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import BannersClient from "@/components/admin/BannersClient";
import { dummyBanners } from "@/lib/dummy-data";

export default async function BannersPage() {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    redirect("/admin/login");
  }

  return (
    <AdminLayout title="Banners" adminName={session.name}>
      <BannersClient banners={dummyBanners as any[]} />
    </AdminLayout>
  );
}
