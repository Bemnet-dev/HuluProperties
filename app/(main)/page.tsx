"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Zap, CheckCircle2, TrendingUp, MapPin, Home as HomeIcon, Car, Landmark, Bookmark, Sparkles } from 'lucide-react';
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

  const categories = [
    {
      icon: HomeIcon,
      title: "Premium Properties",
      description: "Luxury homes, penthouses, and estates",
      count: "150+ Listings"
    },
    {
      icon: Car,
      title: "Exotic Vehicles",
      description: "Rare and luxury automobiles",
      count: "80+ Listings"
    },
    {
      icon: Landmark,
      title: "Prime Land",
      description: "Investment-grade land parcels",
      count: "120+ Listings"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Redesigned */}
      <section className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Luxury Hero"
            fill
            className="object-cover object-center"
            referrerPolicy="no-referrer"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 via-zinc-900/70 to-emerald-900/80"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 w-full px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 mb-8 bg-emerald-500/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-emerald-400/30"
              >
                <Sparkles className="text-emerald-300" size={16} />
                <span className="text-emerald-200 font-bold tracking-wide uppercase text-xs">Premium Marketplace</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-[1.1]"
              >
                Discover Your Next
                <span className="block text-emerald-400">Premium Asset</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-zinc-300 mb-10 leading-relaxed max-w-xl"
              >
                Explore exclusive properties, luxury vehicles, and prime land investments. Your gateway to extraordinary acquisitions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/listings"
                  className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-900/30 hover:shadow-2xl hover:shadow-emerald-900/40 flex items-center justify-center gap-3 text-lg"
                >
                  Explore Collection
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg"
                >
                  Contact Us
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/20"
              >
                <div>
                  <div className="text-3xl font-black text-white mb-1">350+</div>
                  <div className="text-sm text-zinc-400 font-medium">Active Listings</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white mb-1">$2.5B+</div>
                  <div className="text-sm text-zinc-400 font-medium">Total Value</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white mb-1">98%</div>
                  <div className="text-sm text-zinc-400 font-medium">Satisfaction</div>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Category Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex flex-col gap-4"
            >
              {categories.map((category, index) => (
                <Link
                  key={category.title}
                  href="/listings"
                >
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                        <category.icon className="text-emerald-300" size={28} strokeWidth={2} />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white mb-1">{category.title}</h3>
                        <p className="text-zinc-300 text-sm mb-2">{category.description}</p>
                        <span className="text-emerald-400 text-xs font-bold">{category.count}</span>
                      </div>
                      <ArrowRight className="text-white/50" size={20} />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 px-6 md:px-12 max-w-screen-2xl mx-auto w-full bg-zinc-50">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4 bg-emerald-100 px-4 py-2 rounded-full"
          >
            <Star className="text-emerald-700" size={16} fill="currentColor" />
            <span className="text-emerald-900 font-bold text-sm uppercase tracking-wide">Featured</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4"
          >
            Exclusive Opportunities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-zinc-600 text-lg max-w-2xl mx-auto"
          >
            Hand-picked premium assets offering exceptional value and unparalleled quality
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-zinc-200 transform hover:-translate-y-2">
                <Link href={`/listings/${item.id}`} className="absolute inset-0 z-0"></Link>
                <div className="relative h-[20rem] w-full overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-zinc-900 uppercase tracking-wide shadow-lg">
                    {item.type}
                  </div>
                  <button
                    onClick={(e) => toggleFavorite(e, item.id.toString())}
                    className="absolute top-4 right-4 z-20 p-2.5 bg-white/95 backdrop-blur-md rounded-full transition-all duration-300 hover:bg-emerald-50 hover:scale-110 shadow-lg"
                  >
                    <Bookmark size={18} className={favorites.includes(item.id.toString()) ? "text-emerald-700 fill-emerald-700" : "text-zinc-700"} />
                  </button>
                  {item.images && item.images.length > 0 ? (
                    <Image src={item.images[0]} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow relative z-10 pointer-events-none">
                  <div className="flex items-center gap-2 text-emerald-700 text-xs mb-3 font-bold uppercase tracking-wide">
                    <MapPin size={14} />
                    {item.location}
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mb-2 leading-tight group-hover:text-emerald-700 transition-colors">{item.title}</h3>
                  <p className="text-zinc-600 text-sm mb-6 flex-grow line-clamp-2">{item.specs && item.specs.length > 0 ? item.specs[0].value : 'Contact for details'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
                    <div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wide font-bold mb-1">Price</div>
                      <div className="text-2xl font-black text-zinc-900">{item.price}</div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all duration-300">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/listings" className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg">
            View All Listings
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section >

      {/* Why Choose Us */}
      < section className="py-24 px-6 md:px-12 bg-white" >
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image src={exclusivityImage} alt="Exclusivity" fill className="object-cover" referrerPolicy="no-referrer" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 mb-6 bg-emerald-100 px-4 py-2 rounded-full">
                <Shield className="text-emerald-700" size={16} />
                <span className="text-emerald-900 font-bold text-sm uppercase tracking-wide">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6 tracking-tight">
                Your Trusted Partner in Premium Assets
              </h2>
              <p className="text-zinc-600 text-lg mb-8 leading-relaxed">
                We provide unparalleled access to exclusive properties, vehicles, and land through our global network of verified partners.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-zinc-50 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-emerald-700" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-lg mb-1">Verified Listings</h4>
                    <p className="text-zinc-600">Every asset undergoes rigorous verification and quality checks</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-zinc-50 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    <Shield className="text-emerald-700" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-lg mb-1">Secure Transactions</h4>
                    <p className="text-zinc-600">Bank-level security and escrow services for your peace of mind</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-zinc-50 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp className="text-emerald-700" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-lg mb-1">Expert Guidance</h4>
                    <p className="text-zinc-600">Dedicated specialists to guide you through every step</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section >

      {/* CTA Section */}
      < section className="py-24 px-6 md:px-12 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 relative overflow-hidden" >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-emerald-100 text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
              Join thousands of satisfied clients who trust us with their premium asset transactions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/listings"
                className="bg-white text-emerald-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-3"
              >
                Browse Listings
                <ArrowRight size={22} />
              </Link>
              <Link
                href="/contact"
                className="bg-emerald-700 text-white border-2 border-emerald-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section >
    </div >
  );
}
