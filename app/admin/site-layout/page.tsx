import { redirect } from "next/navigation";
import { requirePageAccess } from "@/lib/auth";
import SiteLayoutClient from "@/components/admin/SiteLayoutClient";
import AdminLayout from "@/components/admin/AdminLayout";

export default async function SiteLayoutPage() {
  let session;
  try {
    session = await requirePageAccess("site-layout");
  } catch {
    redirect("/admin/login");
  }

  return (
    <AdminLayout title="Site Layout" adminName={session.name}>
      <SiteLayoutClient />
    </AdminLayout>
  );
}
