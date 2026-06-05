import { requirePageAccess } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import ReviewsClient from "@/components/admin/ReviewsClient";
import { dummyReviews } from "@/lib/dummy-data";

export default async function ReviewsPage() {
  const session = await requirePageAccess("reviews");

  return (
    <AdminLayout title="Reviews" adminName={session.name}>
      <ReviewsClient reviews={dummyReviews as any[]} />
    </AdminLayout>
  );
}
