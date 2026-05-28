import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductsClient from "@/components/admin/ProductsClient";
import { dummyProducts, dummyCategories } from "@/lib/dummy-data";

export default async function ProductsPage() {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    redirect("/admin/login");
  }

  return (
    <AdminLayout title="Products" adminName={session.name}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ProductsClient products={dummyProducts as any} categories={dummyCategories} />
    </AdminLayout>
  );
}
