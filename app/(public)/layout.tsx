import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { Providers } from "@/components/ui/Providers";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#FBF9F5" }}>
        <Header />
        {/* pb-16 on mobile for bottom nav */}
        <main className="flex-1 pb-16 md:pb-0" style={{ backgroundColor: "#FBF9F5" }}>
          {children}
        </main>
        <Footer />
        <BottomNav />
      </div>
    </Providers>
  );
}
