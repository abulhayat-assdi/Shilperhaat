import { requirePageAccess } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { dummyCategories } from "@/lib/dummy-data";

export default async function NewProductPage() {
  const session = await requirePageAccess("products");

  return (
    <AdminLayout title="Add New Product" adminName={session.name}>
      <ProductForm categories={dummyCategories as any[]} />
    </AdminLayout>
  );
}
