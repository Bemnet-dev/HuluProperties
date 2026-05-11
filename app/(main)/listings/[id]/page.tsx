"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Share, Heart, Check, ChevronRight, Phone, Mail, X, Link as LinkIcon, Facebook, Linkedin, MessageCircle, Copy, Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';

export default function ListingDetail() {
  const params = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      if (!params.id) return;
      const { data, error } = await supabase.from('listings').select('*').eq('id', params.id).single();
      if (!error && data) {
        setDetails({
          ...data,
          images: data.images || [],
          features: data.specs ? data.specs.map((s: any) => `${s.key}: ${s.value}`) : []
        });
      }
      setLoading(false);
    };
    fetchListing();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-zinc-500">Loading details...</div>;
  }

  if (!details) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-zinc-500">Listing not found.</div>;
  }


  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `Discover this exceptional asset: ${details.title}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialPlatforms = [
    { name: 'X', icon: X, color: 'hover:bg-zinc-900 hover:text-white', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}` },
    { name: 'LinkedIn', icon: Linkedin, color: 'hover:bg-blue-700 hover:text-white', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: 'Facebook', icon: Facebook, color: 'hover:bg-blue-600 hover:text-white', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'WhatsApp', icon: MessageCircle, color: 'hover:bg-emerald-600 hover:text-white', url: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}` },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-zinc-900">Share Asset</h3>
                  <button onClick={() => setIsShareModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                    <X size={24} className="text-zinc-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {socialPlatforms.map((platform) => (
                    <Link
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border border-zinc-100 bg-zinc-50 transition-all duration-300 group ${platform.color}`}
                    >
                      <platform.icon size={28} className="text-zinc-400 group-hover:text-inherit" />
                      <span className="text-sm font-bold text-zinc-600 group-hover:text-inherit">{platform.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Direct Link</label>
                  <div className="flex gap-2 bg-zinc-50 border border-zinc-200 p-2 rounded-2xl">
                    <div className="flex-1 px-3 py-2 text-sm text-zinc-500 font-medium truncate italic">
                      {shareUrl}
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="bg-zinc-900 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-900 transition-colors shrink-0"
                    >
                      {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-50 px-8 py-5 text-center">
                <p className="text-xs text-zinc-400 font-medium tracking-wide">SHARING SECURELY VIA HULU PROPERTIES CONCIERGE</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Breadcrumb & Actions */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/listings" className="text-zinc-500 hover:text-zinc-900 font-medium flex items-center gap-2 transition-colors">
          <ArrowLeft size={18} /> Back to Collection
        </Link>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="p-2.5 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm active:scale-90"
          >
            <Share size={20} />
          </button>
          <button className="p-2.5 rounded-full border border-zinc-200 text-zinc-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm active:scale-90">
            <Heart size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pb-24">
        {/* Main Header */}
        <div className="mb-8">
          <div className="inline-block bg-zinc-100 px-3 py-1 rounded-full text-xs font-bold text-zinc-700 uppercase tracking-widest mb-4">
            {details.type}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-4">{details.title}</h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center text-lg text-zinc-600 font-medium">
              <MapPin className="mr-2 text-zinc-400" size={20} /> {details.location}
            </div>
            <div className="text-4xl font-bold text-emerald-900 tracking-tight">{details.price}</div>
          </div>
        </div>

        {/* Gallery */}
        <div className="flex flex-col gap-4 mb-16">
          <div className="relative w-full h-[50vh] md:h-[65vh] rounded-3xl overflow-hidden shadow-sm bg-zinc-200 flex items-center justify-center">
            {details.images.length > 0 ? (
               <Image src={details.images[activeImage]} alt="Main gallery image" fill className="object-cover transition-opacity duration-500" referrerPolicy="no-referrer" priority />
            ) : (
               <div className="text-zinc-400 font-bold">No images available</div>
            )}
          </div>
          {details.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 md:gap-4 overflow-x-auto">
              {details.images.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative h-20 md:h-40 rounded-xl overflow-hidden shadow-sm transition-all ${activeImage === idx ? 'ring-4 ring-emerald-800 opacity-100' : 'opacity-70 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Details */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">About this {details.type}</h2>
            <p className="text-lg text-zinc-600 leading-relaxed mb-12">
              {details.description}
            </p>
            
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Key Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              {details.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded-full flex-shrink-0">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="text-zinc-700 font-medium text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar / Contact */}
          <div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 md:sticky top-28 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Interested in this asset?</h3>
              <p className="text-zinc-500 mb-8 font-medium">Contact the owner directly to discuss acquisition or schedule a private viewing.</p>
              
              <div className="flex flex-col gap-4">
                <Link 
                  href="tel:+251967549339"
                  className="w-full bg-emerald-900 text-white font-bold py-5 rounded-2xl hover:bg-emerald-800 transition-all duration-300 flex justify-center items-center gap-3 shadow-lg hover:shadow-emerald-900/20 active:scale-95"
                >
                  <Phone size={22} className="fill-white" /> Call the owner
                </Link>
                <Link 
                  href="https://t.me/el_beba1"
                  target="_blank"
                  className="w-full bg-[#0088cc] text-white font-bold py-5 rounded-2xl hover:bg-[#0077b5] transition-all duration-300 flex justify-center items-center gap-3 shadow-lg hover:shadow-blue-900/20 active:scale-95"
                >
                  <Send size={22} className="fill-white" /> Contact on Telegram
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
