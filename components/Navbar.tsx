"use client";
import Link from 'next/link';
import { Bell, User, LogOut, ChevronDown, Heart, Bookmark } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, loading, signOut } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200 shadow-sm">
      <div className="flex justify-between items-center w-full px-6 md:px-12 h-20 max-w-screen-2xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tighter text-emerald-900 uppercase">
          Hulu Properties
        </Link>
        <div className="flex items-center gap-6">
          <button className="hidden md:flex text-zinc-500 hover:text-emerald-800 transition-colors">
            <Bell size={24} />
          </button>
          
          {user ? (
            <div className="flex items-center gap-6">
              {isAdmin && (
                <Link href="/admin/listings/new" className="bg-emerald-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-emerald-800 transition-colors shadow-sm text-sm uppercase tracking-wider">
                  List Asset
                </Link>
              )}
              <Link href="/favorites" className="hidden md:flex text-zinc-700 hover:text-emerald-900 transition-all gap-2 items-center text-sm font-bold uppercase tracking-widest bg-white border border-zinc-200 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md hover:border-emerald-200 hover:bg-emerald-50/50">
                <Bookmark size={18} className="text-emerald-700 fill-emerald-100" /> Saved
              </Link>
              <button 
                onClick={() => signOut()}
                className="hidden md:flex text-zinc-500 hover:text-red-600 transition-colors"
                title="Sign Out"
              >
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-emerald-900 font-bold hover:text-emerald-700 transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
