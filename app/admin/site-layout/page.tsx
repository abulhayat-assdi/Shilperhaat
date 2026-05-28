import { SiteLayoutProvider } from "@/lib/site-layout-context";
import SiteLayoutClient from "@/components/admin/SiteLayoutClient";
import AdminLayout from "@/components/admin/AdminLayout";

export default function SiteLayoutPage() {
  return (
    <SiteLayoutProvider>
      <AdminLayout title="Site Layout">
        <SiteLayoutClient />
      </AdminLayout>
    </SiteLayoutProvider>
  );
}
