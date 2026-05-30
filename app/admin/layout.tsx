import { SiteLayoutProvider } from "@/lib/site-layout-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteLayoutProvider>
      <div className="min-h-screen bg-gray-50 font-sans">
        {children}
      </div>
    </SiteLayoutProvider>
  );
}
