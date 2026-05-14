'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Grid3X3, List as ListIcon, Filter, ArrowRight, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Real data is fetched via Supabase

export default function ListingsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'Active')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setListings(data);
      }
      setIsLoading(false);
    };
    fetchListings();
  }, []);

  const filteredProducts = activeTab === 'All' ? listings : listings.filter(p => p.type === activeTab);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('listing_id')
          .eq('user_id', user.id);

        if (!error && data) {
          setFavorites(data.map(f => f.listing_id.toString()));
        }
      } catch (e) {
        console.warn("Favorites table might not exist yet:", e);
      }
    };

    if (user) {
      loadFavorites();
    }
  }, [user]);

  const toggleFavorite = async (e: React.MouseEvent, listingId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/login');
      return;
    }

    const isFav = favorites.includes(listingId);

    if (isFav) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      if (!error) {
        setFavorites(favorites.filter(id => id !== listingId));
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, listing_id: listingId }]);

      if (!error) {
        setFavorites([...favorites, listingId]);
      }
    }
  };

  return (
    <div className="w-full bg-zinc-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 py-12 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">Explore Collection</h1>
          <p className="text-lg text-zinc-500 max-w-2xl mb-8">Browse our exclusive catalog of properties, fine vehicles, and undeveloped land. Use the filters below to refine your search.</p>

          {/* Search and Filters Bar */}
          <div className="flex flex-col gap-4 w-full">
            {/* Mobile Filter Toggle & Search Row */}
            <div className="flex w-full gap-3 items-center lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 border-2 px-5 py-3 rounded-xl transition-all shadow-sm font-bold whitespace-nowrap ${showFilters ? 'bg-emerald-800 border-emerald-800 text-white' : 'bg-white border-zinc-200 text-zinc-700 hover:border-emerald-800'}`}
              >
                <Filter size={20} strokeWidth={2.5} />
                <span>Filter</span>
              </button>
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 bg-white shadow-sm font-medium"
                />
              </div>
            </div>

            {/* Category Filter Pills - Mobile */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden overflow-hidden"
                >
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['All', 'Property', 'Vehicle', 'Land'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 ${activeTab === tab ? 'bg-emerald-800 text-white border-emerald-800 shadow-lg scale-105' : 'bg-white text-zinc-700 border-zinc-200 hover:border-emerald-800 hover:text-emerald-800'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Layout */}
            <div className="hidden lg:flex gap-4 items-center justify-between w-full">
              <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-xl">
                {['All', 'Property', 'Vehicle', 'Land'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 items-center">
                <div className="relative w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by location or name..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent bg-white shadow-sm font-medium"
                  />
                </div>
                <div className="flex bg-white border border-zinc-200 rounded-xl p-1 shadow-sm">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-800' : 'text-zinc-400 hover:text-zinc-100'}`}>
                    <Grid3X3 size={20} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-800' : 'text-zinc-400 hover:text-zinc-100'}`}>
                    <ListIcon size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-12">
        <div className="mb-6 text-sm font-medium text-zinc-500">
          Showing {filteredProducts.length} results for <span className="text-zinc-900">&quot;{activeTab}&quot;</span>
        </div>

        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className={`group relative flex bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-zinc-100 hover:border-zinc-200 transform ${viewMode === 'list' ? 'flex-col sm:flex-row hover:-translate-y-1' : 'flex-col hover:-translate-y-2 h-full'}`}
            >
              <Link href={`/listings/${item.id}`} className="absolute inset-0 z-0"></Link>
              <div className={`relative overflow-hidden block ${viewMode === 'list' ? 'w-full sm:w-2/5 min-h-[280px] sm:min-h-0 h-72 sm:h-auto shrink-0' : 'h-[22rem] w-full'}`}>
                <div className="absolute top-5 left-5 z-10 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-zinc-900 uppercase tracking-widest shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                  {item.type}
                </div>
                <button
                  onClick={(e) => toggleFavorite(e, item.id)}
                  className="absolute top-5 right-5 z-20 p-2.5 bg-white/95 backdrop-blur-md rounded-full transition-all duration-300 hover:bg-emerald-50 hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                >
                  <Bookmark size={18} className={favorites.includes(item.id) ? "text-emerald-700 fill-emerald-700" : "text-zinc-700"} />
                </button>
                {item.images && item.images.length > 0 ? (
                  <Image src={item.images[0]} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-zinc-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className={`flex flex-col justify-between bg-white relative z-10 pointer-events-none ${viewMode === 'list' ? 'flex-grow w-full sm:w-3/5 p-8' : 'flex-grow p-8'}`}>
                <div>
                  <div className="text-emerald-700 text-xs mb-3 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative"><span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50"></span></span>
                    {item.location}
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight mb-2 leading-tight group-hover:text-emerald-800 transition-colors">{item.title}</h3>
                  <p className="text-zinc-500 font-medium mb-8 text-sm leading-relaxed">{item.specs && item.specs.length > 0 ? item.specs[0].value : 'Contact for details'}</p>
                </div>
                <div className={`flex items-end justify-between ${viewMode === 'list' ? 'mt-auto pt-8 border-t border-zinc-100' : 'mt-auto pt-6 border-t border-zinc-100'}`}>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Asking Price</span>
                    <span className={`${viewMode === 'list' ? 'text-3xl' : 'text-2xl'} font-black tracking-tight text-zinc-900 group-hover:text-emerald-900 transition-colors`}>{item.price}</span>
                  </div>
                  <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center text-zinc-600 group-hover:bg-emerald-900 group-hover:text-white group-hover:border-emerald-900 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
