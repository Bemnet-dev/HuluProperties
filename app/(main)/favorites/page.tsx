'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, Save, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Syncing with the PRODUCTS data from listings/page.tsx
const PRODUCTS = [
  { id: '1', title: 'The Glass Pavilion', location: 'Beverly Hills, CA', price: 'ETB 14,500,000', type: 'Property', image: 'https://picsum.photos/seed/house1/800/600', specs: '6 Beds • 8 Baths' },
  { id: '2', title: '2026 Porsche 911 GT3 RS', location: 'Los Angeles, CA', price: 'ETB 295,000', type: 'Vehicle', image: 'https://picsum.photos/seed/car1/800/600', specs: '4.0L Flat-6 • 518 hp' },
  { id: '3', title: 'Coastal Cliff Estate Land', location: 'Big Sur, CA', price: 'ETB 8,200,000', type: 'Land', image: 'https://picsum.photos/seed/land1/800/600', specs: '45 Acres' },
  { id: '4', title: 'Penthouse at 432 Park', location: 'New York, NY', price: 'ETB 35,000,000', type: 'Property', image: 'https://picsum.photos/seed/pent/800/600', specs: '4 Beds • 5 Baths' },
  { id: '5', title: 'Rolls-Royce Phantom', location: 'Miami, FL', price: 'ETB 460,000', type: 'Vehicle', image: 'https://picsum.photos/seed/rolls/800/600', specs: '6.75L V12' },
  { id: '6', title: 'Vineyard Development Plot', location: 'Napa Valley, CA', price: 'ETB 12,500,000', type: 'Land', image: 'https://picsum.photos/seed/vine/800/600', specs: '120 Acres' },
];

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      setLoadingItems(true);
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('listing_id')
          .eq('user_id', user.id);
        
        if (!error && data) {
          setFavoriteIds(data.map(f => f.listing_id.toString()));
        }
      } catch (e) {
        console.warn("Error loading favorites:", e);
      } finally {
        setLoadingItems(false);
      }
    };

    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadFavorites();
    }
  }, [user, authLoading, router]);

  const removeFavorite = async (e: React.MouseEvent, listingId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('listing_id', listingId);
      
    if (!error) {
      setFavoriteIds(favoriteIds.filter(id => id !== listingId));
    }
  };

  const favoritedProducts = PRODUCTS.filter(p => favoriteIds.includes(p.id));

  if (authLoading || loadingItems) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 pt-20">
        <Loader2 className="animate-spin text-emerald-900" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-50 min-h-screen pb-24 pt-20">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-12">
        <Link href="/listings" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-900 font-bold mb-8 uppercase tracking-widest text-xs transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Listings
        </Link>
        
        <h1 className="text-4xl font-black text-zinc-900 tracking-tighter mb-4 uppercase">Your Saved Assets</h1>
        <p className="text-lg text-zinc-500 max-w-2xl mb-12 font-medium italic">A curated selection of the finest opportunities reserved for your review.</p>

        {favoritedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200 shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-100 rounded-full mb-6">
              <Save size={32} className="text-zinc-300" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-3">No saved assets yet</h2>
            <p className="text-zinc-500 font-medium mb-8">Start exploring the marketplace to find pieces worth following.</p>
            <Link href="/listings" className="bg-zinc-900 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg active:scale-95">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {favoritedProducts.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-zinc-100 hover:border-zinc-200 transform hover:-translate-y-2 h-full">
                    <Link href={`/listings/${item.id}`} className="absolute inset-0 z-0"></Link>
                    <div className="relative h-[22rem] w-full overflow-hidden block">
                       <div className="absolute top-5 left-5 z-10 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-zinc-900 uppercase tracking-widest shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                        {item.type}
                      </div>
                      <button 
                        onClick={(e) => removeFavorite(e, item.id)}
                        className="absolute top-5 right-5 z-20 p-2.5 bg-white/95 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-50 hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                        title="Remove from favorites"
                      >
                        <Save size={18} className="text-emerald-700 fill-emerald-100 group-hover:text-red-500 group-hover:fill-red-100 transition-colors" />
                      </button>
                      <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-zinc-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="p-8 flex flex-col justify-between flex-grow bg-white relative z-10 pointer-events-none">
                      <div>
                        <div className="text-emerald-700 text-xs mb-3 font-bold uppercase tracking-widest flex items-center gap-1.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative"><span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50"></span></span>
                           {item.location}
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900 tracking-tight mb-2 leading-tight group-hover:text-emerald-800 transition-colors">{item.title}</h3>
                        <p className="text-zinc-500 font-medium mb-8 text-sm leading-relaxed">{item.specs}</p>
                      </div>
                      <div className="mt-auto pt-6 border-t border-zinc-100 flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black mb-1">Asking Price</span>
                          <span className="text-2xl font-black tracking-tight text-zinc-900 group-hover:text-emerald-900 transition-colors">{item.price}</span>
                        </div>
                        <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center text-zinc-600 group-hover:bg-emerald-900 group-hover:text-white group-hover:border-emerald-900 transition-all duration-300 shadow-sm group-hover:shadow-md">
                          <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
