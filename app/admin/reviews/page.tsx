import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import ReviewsClient from "@/components/admin/ReviewsClient";
import { dummyReviews } from "@/lib/dummy-data";

export default async function ReviewsPage() {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    redirect("/admin/login");
  }

  return (
    <AdminLayout title="Reviews" adminName={session.name}>
      <ReviewsClient reviews={dummyReviews as any[]} />
    </AdminLayout>
  );
}
