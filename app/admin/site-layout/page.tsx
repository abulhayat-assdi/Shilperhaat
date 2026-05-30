import SiteLayoutClient from "@/components/admin/SiteLayoutClient";
import AdminLayout from "@/components/admin/AdminLayout";

export default function SiteLayoutPage() {
  return (
    <AdminLayout title="Site Layout">
      <SiteLayoutClient />
    </AdminLayout>
  );
}
