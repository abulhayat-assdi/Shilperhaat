import { requirePageAccess } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import BannersClient from "@/components/admin/BannersClient";
import { dummyBanners } from "@/lib/dummy-data";

export default async function BannersPage() {
  const session = await requirePageAccess("banners");

  return (
    <AdminLayout title="Banners" adminName={session.name}>
      <BannersClient banners={dummyBanners as any[]} />
    </AdminLayout>
  );
}
