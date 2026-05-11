"use client";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-emerald-900" size={48} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center gap-4 px-4 py-4 border-b border-zinc-200 bg-zinc-50 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-zinc-700 hover:text-emerald-900 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          <span className="text-base font-black text-emerald-900 uppercase tracking-tighter">Hulu Properties</span>
        </div>

        {children}
      </div>
    </div>
  );
}
