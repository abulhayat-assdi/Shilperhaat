import { requirePageAccess } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import SettingsClient from "@/components/admin/SettingsClient";
import { dummySiteSettings } from "@/lib/dummy-data";

export default async function SettingsPage() {
  const session = await requirePageAccess("settings");

  return (
    <AdminLayout title="Site Settings" adminName={session.name}>
      <SettingsClient settings={dummySiteSettings as any} />
    </AdminLayout>
  );
}
