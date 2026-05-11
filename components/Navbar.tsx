"use client";
import Link from 'next/link';
import { Bell, LogOut, Bookmark, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [assetsDropdownOpen, setAssetsDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200 shadow-sm">
      <div className="flex justify-between items-center w-full px-6 md:px-12 h-20 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tighter text-emerald-900 uppercase" onClick={() => setMobileOpen(false)}>
          Hulu Properties
        </Link>

        {/* Desktop Centered Links */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/listings" className="text-zinc-600 hover:text-emerald-900 font-bold uppercase tracking-widest text-xs transition-colors">
            Lands
          </Link>
          <Link href="/listings" className="text-zinc-600 hover:text-emerald-900 font-bold uppercase tracking-widest text-xs transition-colors">
            Houses
          </Link>
          <Link href="/listings" className="text-zinc-600 hover:text-emerald-900 font-bold uppercase tracking-widest text-xs transition-colors">
            Cars
          </Link>
          <Link href="/contact" className="text-zinc-600 hover:text-emerald-900 font-bold uppercase tracking-widest text-xs transition-colors">
            Contact
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link href="/admin/listings/new" className="text-emerald-900 font-bold uppercase tracking-widest text-xs hover:text-emerald-700 transition-colors">
                  List Asset
                </Link>
              )}
              <Link href="/favorites" className="flex text-zinc-700 hover:text-emerald-900 transition-all gap-1.5 items-center text-xs font-bold uppercase tracking-widest">
                <Bookmark size={16} className="text-emerald-700 fill-emerald-100" /> Saved
              </Link>
            </div>
          ) : (
            <Link href="/login" className="bg-emerald-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-emerald-800 transition-colors shadow-sm text-xs uppercase tracking-wider">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-zinc-700 hover:text-emerald-900 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-zinc-100 shadow-lg px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col border-b border-zinc-100">
            <button 
              onClick={() => setAssetsDropdownOpen(!assetsDropdownOpen)} 
              className="flex items-center justify-between text-zinc-700 font-semibold text-lg hover:text-emerald-900 transition-colors py-2"
            >
              Assets
              {assetsDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {assetsDropdownOpen && (
              <div className="flex flex-col gap-2 pl-4 pb-2 pt-1">
                <Link href="/listings" onClick={() => setMobileOpen(false)} className="text-zinc-600 font-medium text-base hover:text-emerald-900 py-1.5">
                  Lands
                </Link>
                <Link href="/listings" onClick={() => setMobileOpen(false)} className="text-zinc-600 font-medium text-base hover:text-emerald-900 py-1.5">
                  Houses
                </Link>
                <Link href="/listings" onClick={() => setMobileOpen(false)} className="text-zinc-600 font-medium text-base hover:text-emerald-900 py-1.5">
                  Cars
                </Link>
              </div>
            )}
          </div>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-zinc-700 font-semibold text-lg hover:text-emerald-900 transition-colors py-2 border-b border-zinc-100">
            Contact
          </Link>

          {user ? (
            <>
              <Link href="/favorites" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-zinc-700 font-semibold text-lg hover:text-emerald-900 transition-colors py-2 border-b border-zinc-100">
                <Bookmark size={20} className="text-emerald-700 fill-emerald-100" /> Saved
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-zinc-700 font-semibold text-lg hover:text-emerald-900 transition-colors py-2 border-b border-zinc-100">
                  Admin Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin/listings/new" onClick={() => setMobileOpen(false)} className="text-zinc-700 font-semibold text-lg hover:text-emerald-900 transition-colors py-2 border-b border-zinc-100">
                  + List Asset
                </Link>
              )}
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="flex items-center gap-3 text-red-600 font-semibold text-lg py-2"
              >
                <LogOut size={20} /> Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="bg-emerald-900 text-white text-center font-bold py-4 rounded-2xl text-lg hover:bg-emerald-800 transition-colors">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
