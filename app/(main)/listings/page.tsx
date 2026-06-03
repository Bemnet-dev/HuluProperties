'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Grid3X3, List as ListIcon, Filter, ArrowRight, Bookmark, X, SlidersHorizontal, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Real data is fetched via Supabase

interface FilterState {
  searchQuery: string;
  priceMin: number;
  priceMax: number;
  location: string;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'title';
}

export default function ListingsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    priceMin: 0,
    priceMax: 10000000,
    location: '',
    sortBy: 'newest'
  });

  // Calculate min and max prices from listings
  const priceRange = useMemo(() => {
    if (listings.length === 0) return { min: 0, max: 10000000 };

    const prices = listings.map(listing => {
      const priceStr = listing.price?.replace(/[^0-9]/g, '') || '0';
      return parseInt(priceStr, 10);
    }).filter(price => !isNaN(price) && price > 0);

    return {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 10000000)
    };
  }, [listings]);

  // Get unique locations
  const uniqueLocations = useMemo(() => {
    const locations = listings.map(l => l.location).filter(Boolean);
    return Array.from(new Set(locations)).sort();
  }, [listings]);

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

  // Advanced filtering logic
  const filteredProducts = useMemo(() => {
    let filtered = activeTab === 'All' ? listings : listings.filter(p => p.type === activeTab);

    // Search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(item => item.location === filters.location);
    }

    // Price filter
    filtered = filtered.filter(item => {
      const priceStr = item.price?.replace(/[^0-9]/g, '') || '0';
      const price = parseInt(priceStr, 10);
      return price >= filters.priceMin && price <= filters.priceMax;
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          const priceA = parseInt(a.price?.replace(/[^0-9]/g, '') || '0', 10);
          const priceB = parseInt(b.price?.replace(/[^0-9]/g, '') || '0', 10);
          return priceA - priceB;
        case 'price-high':
          const priceA2 = parseInt(a.price?.replace(/[^0-9]/g, '') || '0', 10);
          const priceB2 = parseInt(b.price?.replace(/[^0-9]/g, '') || '0', 10);
          return priceB2 - priceA2;
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [listings, activeTab, filters]);

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
            {/* Search Bar and Filter Toggle */}
            <div className="flex w-full gap-3 items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 border-2 px-5 py-3 rounded-xl transition-all shadow-sm font-bold whitespace-nowrap ${showFilters ? 'bg-emerald-800 border-emerald-800 text-white' : 'bg-white border-zinc-200 text-zinc-700 hover:border-emerald-800'}`}
              >
                <SlidersHorizontal size={20} strokeWidth={2.5} />
                <span>Filters</span>
                {(filters.location || filters.priceMin > priceRange.min || filters.priceMax < priceRange.max || activeTab !== 'All') && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </button>
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by location or name..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 bg-white shadow-sm font-medium"
                />
              </div>
              <div className="hidden lg:flex bg-white border border-zinc-200 rounded-xl p-1 shadow-sm">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-800' : 'text-zinc-400 hover:text-zinc-900'}`}>
                  <Grid3X3 size={20} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-800' : 'text-zinc-400 hover:text-zinc-900'}`}>
                  <ListIcon size={20} />
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                        <SlidersHorizontal size={20} className="text-emerald-700" />
                        Advanced Filters
                      </h3>
                      <button
                        onClick={() => {
                          setActiveTab('All');
                          setFilters({
                            searchQuery: '',
                            priceMin: priceRange.min,
                            priceMax: priceRange.max,
                            location: '',
                            sortBy: 'newest'
                          });
                        }}
                        className="text-sm text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                      >
                        <X size={16} />
                        Clear All
                      </button>
                    </div>

                    {/* Category Selection */}
                    <div className="mb-6 pb-6 border-b border-zinc-200">
                      <label className="block text-sm font-bold text-zinc-700 mb-3">
                        Category
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'Property', 'Vehicle', 'Land'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-emerald-800 text-white shadow-md' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Price Range Filter */}
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-zinc-700 flex items-center gap-2">
                          <DollarSign size={16} className="text-emerald-700" />
                          Price Range
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Min"
                              value={filters.priceMin || ''}
                              onChange={(e) => setFilters({ ...filters, priceMin: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent text-sm"
                            />
                            <span className="text-zinc-400">-</span>
                            <input
                              type="number"
                              placeholder="Max"
                              value={filters.priceMax === priceRange.max ? '' : filters.priceMax}
                              onChange={(e) => setFilters({ ...filters, priceMax: parseInt(e.target.value) || priceRange.max })}
                              className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <input
                              type="range"
                              min={priceRange.min}
                              max={priceRange.max}
                              value={filters.priceMin}
                              onChange={(e) => setFilters({ ...filters, priceMin: parseInt(e.target.value) })}
                              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                            />
                            <input
                              type="range"
                              min={priceRange.min}
                              max={priceRange.max}
                              value={filters.priceMax}
                              onChange={(e) => setFilters({ ...filters, priceMax: parseInt(e.target.value) })}
                              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                            />
                          </div>
                          <div className="text-xs text-zinc-500 flex justify-between">
                            <span>${filters.priceMin.toLocaleString()}</span>
                            <span>${filters.priceMax === priceRange.max ? 'Max' : filters.priceMax.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Location Filter */}
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-zinc-700 flex items-center gap-2">
                          <MapPin size={16} className="text-emerald-700" />
                          Location
                        </label>
                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                          <button
                            onClick={() => setFilters({ ...filters, location: '' })}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filters.location === '' ? 'bg-emerald-800 text-white shadow-md' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                          >
                            All Locations
                          </button>
                          {uniqueLocations.map((location) => (
                            <button
                              key={location}
                              onClick={() => setFilters({ ...filters, location })}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filters.location === location ? 'bg-emerald-800 text-white shadow-md' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                            >
                              {location}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sort By Filter */}
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-zinc-700 flex items-center gap-2">
                          <Filter size={16} className="text-emerald-700" />
                          Sort By
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setFilters({ ...filters, sortBy: 'newest' })}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filters.sortBy === 'newest' ? 'bg-emerald-800 text-white shadow-md' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                          >
                            Newest First
                          </button>
                          <button
                            onClick={() => setFilters({ ...filters, sortBy: 'price-low' })}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filters.sortBy === 'price-low' ? 'bg-emerald-800 text-white shadow-md' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                          >
                            Price: Low to High
                          </button>
                          <button
                            onClick={() => setFilters({ ...filters, sortBy: 'price-high' })}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filters.sortBy === 'price-high' ? 'bg-emerald-800 text-white shadow-md' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                          >
                            Price: High to Low
                          </button>
                          <button
                            onClick={() => setFilters({ ...filters, sortBy: 'title' })}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filters.sortBy === 'title' ? 'bg-emerald-800 text-white shadow-md' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                          >
                            Title: A to Z
                          </button>
                        </div>
                      </div>

                      {/* Active Filters Summary */}
                      <div className="space-y-3 pt-6 border-t border-zinc-200">
                        <label className="block text-sm font-bold text-zinc-700">
                          Active Filters
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {activeTab !== 'All' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                              {activeTab}
                              <button
                                onClick={() => setActiveTab('All')}
                                className="hover:text-emerald-900"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          )}
                          {filters.location && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                              {filters.location}
                              <button
                                onClick={() => setFilters({ ...filters, location: '' })}
                                className="hover:text-emerald-900"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          )}
                          {(filters.priceMin > priceRange.min || filters.priceMax < priceRange.max) && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                              ${filters.priceMin.toLocaleString()} - ${filters.priceMax === priceRange.max ? 'Max' : filters.priceMax.toLocaleString()}
                              <button
                                onClick={() => setFilters({ ...filters, priceMin: priceRange.min, priceMax: priceRange.max })}
                                className="hover:text-emerald-900"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          )}
                          {filters.searchQuery && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                              &quot;{filters.searchQuery}&quot;
                              <button
                                onClick={() => setFilters({ ...filters, searchQuery: '' })}
                                className="hover:text-emerald-900"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          )}
                          {activeTab === 'All' && !filters.location && filters.priceMin === priceRange.min && filters.priceMax === priceRange.max && !filters.searchQuery && (
                            <span className="text-xs text-zinc-400 italic">No filters applied</span>
                          )}
                          {!filters.location && filters.priceMin === priceRange.min && filters.priceMax === priceRange.max && !filters.searchQuery && (
                            <span className="text-xs text-zinc-400 italic">No filters applied</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
    </div >
  );
}
