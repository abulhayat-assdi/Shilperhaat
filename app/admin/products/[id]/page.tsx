import { notFound } from "next/navigation";
import { requirePageAccess } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { dummyCategories, dummyProducts } from "@/lib/dummy-data";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await requirePageAccess("products");

  const { id } = await params;
  const product = dummyProducts.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <AdminLayout title="Edit Product" adminName={session.name}>
      <ProductForm
        categories={dummyCategories as any[]}
        product={product as any}
      />
    </AdminLayout>
  );
}
