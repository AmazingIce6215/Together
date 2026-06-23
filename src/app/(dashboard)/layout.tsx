import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getCurrentUserId } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/welcome");
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <Topbar />
      <MobileNav />
      <main className="flex-1 pt-14 pl-16 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
