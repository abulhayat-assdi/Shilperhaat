import { SiteLayoutProvider } from "@/lib/site-layout-context";
import { AdminSessionProvider } from "@/lib/admin-session-context";
import { getAdminSession, getAdminPageAccess } from "@/lib/auth";

// Per-user, session-based pages: never cache, independent of the root layout.
export const dynamic = "force-dynamic";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  let allowedPages: string[] = [];

  if (session && session.role === "admin") {
    allowedPages = await getAdminPageAccess(session.id);
  }

  return (
    <SiteLayoutProvider>
      <AdminSessionProvider session={session} allowedPages={allowedPages}>
        <div className="min-h-screen bg-gray-50 font-sans">
          {children}
        </div>
      </AdminSessionProvider>
    </SiteLayoutProvider>
  );
}
