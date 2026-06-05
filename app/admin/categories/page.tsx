import { redirect } from "next/navigation";
import { requirePageAccess } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import CategoriesClient from "@/components/admin/CategoriesClient";
import { dummyCategories } from "@/lib/dummy-data";

export default async function CategoriesPage() {
  let session;
  try {
    session = await requirePageAccess("categories");
  } catch {
    redirect("/admin/login");
  }

  return (
    <AdminLayout title="Categories" adminName={session.name}>
      <CategoriesClient categories={dummyCategories as any[]} />
    </AdminLayout>
  );
}
