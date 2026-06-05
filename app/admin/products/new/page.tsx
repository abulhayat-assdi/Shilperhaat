import { redirect } from "next/navigation";
import { requirePageAccess } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { dummyCategories } from "@/lib/dummy-data";

export default async function NewProductPage() {
  let session;
  try {
    session = await requirePageAccess("products");
  } catch {
    redirect("/admin/login");
  }

  return (
    <AdminLayout title="Add New Product" adminName={session.name}>
      <ProductForm categories={dummyCategories as any[]} />
    </AdminLayout>
  );
}
