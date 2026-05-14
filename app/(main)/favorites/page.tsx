'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, Bookmark, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [listings, setListings] = useState<any[]>([]);
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

        if (error) {
          console.error('Error fetching favorites:', error);
          setLoadingItems(false);
          return;
        }

        if (data) {
          const ids = data.map(f => f.listing_id.toString());
          setFavoriteIds(ids);

          // Fetch actual listings
          // Filter valid UUIDs to prevent PostgreSQL errors when querying the listings table
          const validIds = ids.filter(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id));

          if (validIds.length > 0) {
            const { data: listingsData, error: listingsError } = await supabase
              .from('listings')
              .select('*')
              .in('id', validIds);

            if (listingsError) {
              console.error('Error fetching listings:', listingsError.message || listingsError);
            } else {
              setListings(listingsData || []);
            }
          } else {
            setListings([]);
          }
        }
      } catch (e: any) {
        console.error("Error loading favorites:", e);
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
      setListings(listings.filter(l => l.id.toString() !== listingId));
    }
  };

  if (authLoading || loadingItems) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <Loader2 className="animate-spin text-zinc-400" size={40} strokeWidth={2} />
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen pb-24">
      {/* Hero Section - Apple Style */}
      <div className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <Link href="/listings" className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 font-medium mb-8 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" strokeWidth={2} /> Back
        </Link>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-4">Your favorites.</h1>
        <p className="text-xl text-zinc-600 max-w-2xl">The properties you've saved for later.</p>
      </div>

      {/* Content */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        {listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-50 rounded-3xl p-16 md:p-24 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-200 rounded-full mb-6">
              <Bookmark size={32} className="text-zinc-400" strokeWidth={2} />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-3">No favorites yet.</h2>
            <p className="text-lg text-zinc-600 mb-8 max-w-md mx-auto">Start exploring and save the properties you love.</p>
            <Link href="/listings" className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full font-medium hover:bg-zinc-800 transition-all">
              Browse listings
              <ArrowRight size={18} strokeWidth={2} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:border-zinc-300 transition-all h-full">
                  <Link href={`/listings/${item.id}`} className="absolute inset-0 z-0"></Link>

                  <div className="relative h-64 w-full overflow-hidden bg-zinc-100">
                    <button
                      onClick={(e) => removeFavorite(e, item.id.toString())}
                      className="absolute top-4 right-4 z-20 p-2.5 bg-white/95 backdrop-blur-sm rounded-full transition-all hover:scale-110 shadow-lg"
                    >
                      <Bookmark size={18} className="text-emerald-700 fill-emerald-700" strokeWidth={2} />
                    </button>

                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">No Image</div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow relative z-10 pointer-events-none">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
                      <MapPin size={14} strokeWidth={2} />
                      {item.location}
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2 leading-tight">{item.title}</h3>
                    <p className="text-zinc-600 text-sm mb-4 flex-grow line-clamp-2">{item.specs && item.specs.length > 0 ? item.specs[0].value : 'Contact for details'}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
                      <div className="text-2xl font-semibold text-zinc-900">{item.price}</div>
                      <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                        <ArrowRight size={18} strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
