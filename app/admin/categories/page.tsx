import { requirePageAccess } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import CategoriesClient from "@/components/admin/CategoriesClient";
import { dummyCategories } from "@/lib/dummy-data";

export default async function CategoriesPage() {
  const session = await requirePageAccess("categories");

  return (
    <AdminLayout title="Categories" adminName={session.name}>
      <CategoriesClient categories={dummyCategories as any[]} />
    </AdminLayout>
  );
}
