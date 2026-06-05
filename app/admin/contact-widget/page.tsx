import { redirect } from "next/navigation";
import { requirePageAccess } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import ContactWidgetClient from "@/components/admin/ContactWidgetClient";

export default async function ContactWidgetPage() {
  let session;
  try {
    session = await requirePageAccess("contact-widget");
  } catch {
    redirect("/admin/login");
  }

  return (
    <AdminLayout title="Contact Widget" adminName={session.name}>
      <ContactWidgetClient />
    </AdminLayout>
  );
}
