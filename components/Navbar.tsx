"use client";
import Link from 'next/link';
import { Bell, LogOut, Bookmark, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [assetsDropdownOpen, setAssetsDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-200/50 shadow-sm">
      <div className="flex justify-between items-center w-full px-6 md:px-12 h-20 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-emerald-900 uppercase hover:text-emerald-700 transition-all duration-300 hover:scale-105"
          onClick={() => setMobileOpen(false)}
        >
          Hulu Properties
        </Link>

        {/* Desktop Centered Links */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/listings"
            className="relative text-zinc-600 hover:text-emerald-900 font-bold uppercase tracking-widest text-xs transition-colors group"
          >
            Lands
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-900 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/listings"
            className="relative text-zinc-600 hover:text-emerald-900 font-bold uppercase tracking-widest text-xs transition-colors group"
          >
            Houses
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-900 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/listings"
            className="relative text-zinc-600 hover:text-emerald-900 font-bold uppercase tracking-widest text-xs transition-colors group"
          >
            Cars
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-900 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/contact"
            className="relative text-zinc-600 hover:text-emerald-900 font-bold uppercase tracking-widest text-xs transition-colors group"
          >
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-900 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  href="/admin/listings/new"
                  className="text-emerald-900 font-bold uppercase tracking-widest text-xs hover:text-emerald-700 transition-all duration-300 hover:scale-105"
                >
                  List Asset
                </Link>
              )}
              <Link
                href="/favorites"
                className="flex text-zinc-700 hover:text-emerald-900 transition-all duration-300 gap-1.5 items-center text-xs font-bold uppercase tracking-widest hover:scale-105 group"
              >
                <Bookmark size={16} className="text-emerald-700 fill-emerald-100 group-hover:fill-emerald-700 transition-all" />
                Saved
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-emerald-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-emerald-800 transition-all duration-300 shadow-sm hover:shadow-lg text-xs uppercase tracking-wider hover:scale-105 active:scale-95"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 text-zinc-700 hover:text-emerald-900 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={26} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={26} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-zinc-100 shadow-lg overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <div className="flex flex-col border-b border-zinc-100">
                <button
                  onClick={() => setAssetsDropdownOpen(!assetsDropdownOpen)}
                  className="flex items-center justify-between text-zinc-700 font-semibold text-lg hover:text-emerald-900 transition-colors py-2"
                >
                  Assets
                  <motion.div
                    animate={{ rotate: assetsDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {assetsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-2 pl-4 pb-2 pt-1 overflow-hidden"
                    >
                      <Link
                        href="/listings"
                        onClick={() => setMobileOpen(false)}
                        className="text-zinc-600 font-medium text-base hover:text-emerald-900 py-1.5 hover:translate-x-2 transition-all duration-300"
                      >
                        Lands
                      </Link>
                      <Link
                        href="/listings"
                        onClick={() => setMobileOpen(false)}
                        className="text-zinc-600 font-medium text-base hover:text-emerald-900 py-1.5 hover:translate-x-2 transition-all duration-300"
                      >
                        Houses
                      </Link>
                      <Link
                        href="/listings"
                        onClick={() => setMobileOpen(false)}
                        className="text-zinc-600 font-medium text-base hover:text-emerald-900 py-1.5 hover:translate-x-2 transition-all duration-300"
                      >
                        Cars
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="text-zinc-700 font-semibold text-lg hover:text-emerald-900 transition-all duration-300 py-2 border-b border-zinc-100 hover:translate-x-2"
              >
                Contact
              </Link>

              {user ? (
                <>
                  <Link
                    href="/favorites"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 text-zinc-700 font-semibold text-lg hover:text-emerald-900 transition-all duration-300 py-2 border-b border-zinc-100 hover:translate-x-2"
                  >
                    <Bookmark size={20} className="text-emerald-700 fill-emerald-100" /> Saved
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="text-zinc-700 font-semibold text-lg hover:text-emerald-900 transition-all duration-300 py-2 border-b border-zinc-100 hover:translate-x-2"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/admin/listings/new"
                      onClick={() => setMobileOpen(false)}
                      className="text-zinc-700 font-semibold text-lg hover:text-emerald-900 transition-all duration-300 py-2 border-b border-zinc-100 hover:translate-x-2"
                    >
                      + List Asset
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="flex items-center gap-3 text-red-600 font-semibold text-lg py-2 hover:text-red-700 transition-all duration-300 hover:translate-x-2"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="bg-emerald-900 text-white text-center font-bold py-4 rounded-2xl text-lg hover:bg-emerald-800 transition-all duration-300 hover:shadow-lg active:scale-95"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
