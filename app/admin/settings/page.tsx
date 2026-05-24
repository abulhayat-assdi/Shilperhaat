import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import SettingsClient from "@/components/admin/SettingsClient";
import { dummySiteSettings } from "@/lib/dummy-data";

export default async function SettingsPage() {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    redirect("/admin/login");
  }

  return (
    <AdminLayout title="Site Settings" adminName={session.name}>
      <SettingsClient settings={dummySiteSettings as any} />
    </AdminLayout>
  );
}
