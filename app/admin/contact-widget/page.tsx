import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import ContactWidgetClient from "@/components/admin/ContactWidgetClient";

export default async function ContactWidgetPage() {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    redirect("/admin/login");
  }

  return (
    <AdminLayout title="Contact Widget" adminName={session.name}>
      <ContactWidgetClient />
    </AdminLayout>
  );
}
