"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Zap, CheckCircle2, ChevronRight, Play, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import exclusivityImage from "@/src/assets/images/regenerated_image_1777919477660.png";
import heroImage from "@/src/assets/images/regenerated_image_1777920930012.png";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();
  const router = useRouter();

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

  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    const loadFeatured = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'Active')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (!error && data) {
        setFeatured(data);
      }
    };
    
    loadFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[100dvh] lg:min-h-[95vh] flex items-center justify-center overflow-hidden py-32 md:py-48">
        <div className="absolute inset-0 z-0">
          <Image src={heroImage} alt="Luxury Hero" fill className="object-cover brightness-50 object-[center_35%]" referrerPolicy="no-referrer" priority />
        </div>
        
        <div className="relative z-10 w-full px-6 md:px-12 max-w-screen-2xl mx-auto flex flex-col justify-center items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="text-emerald-400 font-bold tracking-widest uppercase text-xs mb-6 inline-flex items-center gap-2 bg-zinc-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-2xl">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
               Hulu Properties
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-black text-white tracking-tighter mb-8 leading-[1.0] max-w-6xl drop-shadow-2xl mx-auto"
          >
            The Premier Marketplace to <br className="hidden lg:block"/>
            Rent or Sell <span className="font-serif italic font-medium text-emerald-300">Real Estate,</span> <br className="hidden md:block"/>
            Houses, Land & Exquisite Cars.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-lg md:text-2xl text-zinc-300 mb-10 max-w-3xl font-light leading-relaxed mx-auto text-center"
          >
            Discover and acquire the world&apos;s most exceptional properties. Whether you are looking to rent a luxury penthouse, sell expansive land, or invest in fine vehicles, we facilitate exclusive off-market opportunities.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
          >
            <Link href="/listings" className="bg-white text-zinc-900 px-8 py-4 text-center rounded-2xl font-bold hover:bg-zinc-100 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 text-lg group">
              Explore Collection <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
        
        {/* Scroll indicator overlay */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 animate-bounce"
        >
          <span className="text-xs font-semibold tracking-widest uppercase">Scroll</span>
          <ArrowRight className="rotate-90" size={16} />
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="py-32 px-6 md:px-12 max-w-screen-2xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">Featured Acquisitions</h2>
            <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed">Hand-selected opportunities offering exceptional value, uncompromising quality, and unparalleled exclusivity.</p>
          </div>
          <Link href="/listings" className="flex items-center gap-2 text-emerald-800 font-bold bg-emerald-50 px-6 py-3 rounded-full hover:bg-emerald-100 transition-colors shrink-0">
            View the Portfolio <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full border border-zinc-100 hover:border-zinc-200 transform hover:-translate-y-2">
                <Link href={`/listings/${item.id}`} className="absolute inset-0 z-0"></Link>
                <div className="relative h-[22rem] w-full overflow-hidden block">
                  <div className="absolute top-5 left-5 z-10 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-zinc-900 uppercase tracking-widest shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                    {item.type}
                  </div>
                  <button 
                    onClick={(e) => toggleFavorite(e, item.id.toString())}
                    className="absolute top-5 right-5 z-20 p-2.5 bg-white/95 backdrop-blur-md rounded-full opacity-100 transition-all duration-300 hover:bg-emerald-50 hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                  >
                    <Bookmark size={18} className={favorites.includes(item.id.toString()) ? "text-emerald-700 fill-emerald-100" : "text-zinc-700"} />
                  </button>
                  {item.images && item.images.length > 0 ? (
                    <Image src={item.images[0]} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-zinc-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-8 flex flex-col flex-grow bg-white relative z-10 pointer-events-none">
                  <div className="text-emerald-700 text-xs mb-3 font-bold uppercase tracking-widest flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative"><span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50"></span></span>
                     {item.location}
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight mb-2 leading-tight group-hover:text-emerald-800 transition-colors">{item.title}</h3>
                  <p className="text-zinc-500 font-medium mb-8 flex-grow text-sm leading-relaxed">{item.specs && item.specs.length > 0 ? item.specs[0].value : 'Contact for details'}</p>
                  <div className="flex items-end justify-between pt-6 border-t border-zinc-100 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Asking Price</span>
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
        </div>
      </section>

      {/* Categories / Trust */}
      <section className="border-t border-b border-zinc-100">
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-12 md:p-24 flex flex-col justify-center bg-zinc-50">
               <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-6">Why Hulu Properties.</h2>
               <p className="text-lg text-zinc-600 mb-8 leading-relaxed max-w-lg">Through an invite-only network of global partners, we source assets that never hit the public market.</p>
               <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <CheckCircle2 className="text-emerald-600 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-bold text-zinc-900 text-lg">Off-Market Access</h4>
                        <p className="text-zinc-500 font-medium">80% of our portfolio is exclusively available to verified members.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <CheckCircle2 className="text-emerald-600 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-bold text-zinc-900 text-lg">Rigorous Diligence</h4>
                        <p className="text-zinc-500 font-medium">Every asset undergoes a 150-point inspection by independent specialists.</p>
                    </div>
                 </div>
               </div>
            </div>
            <div className="relative h-[300px] md:h-auto md:min-h-[500px]">
                <Image src={exclusivityImage} alt="Exclusivity" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-zinc-950 py-32 px-6 md:px-12 w-full text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-screen-2xl mx-auto relative z-10">
          <div className="text-center mb-20 max-w-2xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">The Pillar Of Trust</h2>
             <p className="text-zinc-400 text-lg leading-relaxed">We do not just facilitate transactions. We empower legacy acquisition. Our services ensure structural integrity and legal assurance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div 
               whileHover={{ y: -10 }}
               className="flex flex-col items-center bg-zinc-900/50 p-10 rounded-3xl border border-white/5"
            >
              <div className="w-20 h-20 bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/20 shadow-inner">
                <Star size={36} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Curated Excellence</h3>
              <p className="text-zinc-400 font-medium leading-relaxed">Every asset on Hulu Properties undergoes rigorous inspection and vetting by our tier-one specialists.</p>
            </motion.div>
            <motion.div 
               whileHover={{ y: -10 }}
               className="flex flex-col items-center bg-zinc-900/50 p-10 rounded-3xl border border-white/5"
            >
              <div className="w-20 h-20 bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/20 shadow-inner">
                <Shield size={36} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure Transactions</h3>
              <p className="text-zinc-400 font-medium leading-relaxed">Proprietary escrow and white-glove transfer services ensure your privacy and capital are protected.</p>
            </motion.div>
            <motion.div 
               whileHover={{ y: -10 }}
               className="flex flex-col items-center bg-zinc-900/50 p-10 rounded-3xl border border-white/5"
            >
              <div className="w-20 h-20 bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/20 shadow-inner">
                <Zap size={36} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Rapid Acquisition</h3>
              <p className="text-zinc-400 font-medium leading-relaxed">Streamlined digital closing processes tailored for high-net-worth individuals and family offices.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-32 px-6 md:px-12 w-full max-w-screen-2xl mx-auto text-center">
         <div className="bg-emerald-950 text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-24 relative overflow-hidden shadow-2xl border border-emerald-800/30">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/texture/1920/1080')] mix-blend-overlay opacity-10 hidden md:block"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-emerald-900/50 to-transparent pointer-events-none"></div>
            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-tight">Ready to Rent or Sell Your Property?</h2>
                <p className="text-emerald-100/80 text-xl md:text-2xl font-light mb-12 max-w-2xl leading-relaxed">Connect with a senior partner today to begin your acquisitions journey or to list your house, land, or car with us.</p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/contact" className="bg-white text-emerald-950 px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:bg-emerald-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-emerald-950/20 active:scale-95 flex items-center justify-center gap-3">
                     Contact a Senior Partner <ArrowRight size={22} />
                  </Link>
                  <Link href="/listings" className="bg-emerald-900 text-white border border-emerald-700/50 px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:bg-emerald-800 transition-all duration-300 shadow-xl active:scale-95 flex items-center justify-center gap-3">
                     Browse Listings
                  </Link>
                </div>
            </div>
         </div>
      </section>
    </div>
  );
}

