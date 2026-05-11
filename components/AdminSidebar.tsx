"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, List, Settings, LogOut, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const userName = user?.email ? user.email.split('@')[0] : 'Admin';
  const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/listings", label: "Manage Listings", icon: List },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col p-4 gap-2">
      {/* Mobile close button */}
      <div className="flex items-center justify-between mb-4 mt-2 px-2">
        <div>
          <h1 className="text-lg font-black text-emerald-900 tracking-tighter uppercase">Hulu Properties</h1>
          <p className="text-zinc-500 mt-0.5 text-xs uppercase tracking-widest font-semibold">Admin Console</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
            <X size={22} />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-emerald-900/10 text-emerald-900 font-semibold" : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"}`}
            >
              <Icon size={20} />
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-zinc-200">
        <button
          onClick={async () => {
            await signOut();
            router.push('/');
          }}
          className="w-full bg-emerald-900 text-white flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium hover:bg-emerald-800 transition-colors shadow-sm"
        >
          <LogOut size={18} /> Sign Out
        </button>
        <div className="mt-6 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden relative shrink-0">
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYdKhuHN0DQ6KayYDlW7hJ9CeyXfufnvlXzfCZ7XU3sJjAjElRZgGJsBzFZEfhwLwfFCO7Gg2WCVUW4DL0B5BwGVyxaAjzhKlwutDYGY865LJMhTpY586ELfLF0k1V5U6n4meyqv6fAaLGx_hqanOR1BZObPy47AGiXxQu_0xCztnZP7cMwnuP73esm75dGw5jVRKOmWrpQEZwsmqwxyQzL9457qe7tRuCpGcK17tKW4Kn4AZL0EtlP5-j2-u6N2Iy3zbwcZwU-k4" alt="Admin" fill className="object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-zinc-900 truncate">{formattedName}</span>
            <span className="text-xs text-zinc-500 truncate" title={user?.email || ""}>{user?.email || "Admin Console"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="h-screen w-64 border-r border-zinc-200 bg-zinc-50 flex-shrink-0 hidden md:flex flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" onClick={onClose} />
          {/* Drawer */}
          <aside className="relative z-10 w-72 max-w-[85vw] h-full bg-zinc-50 border-r border-zinc-200 shadow-2xl flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
