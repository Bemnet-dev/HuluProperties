"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [interestDropdownOpen, setInterestDropdownOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState('Premium Real Estate');

  const interests = [
    'Premium Real Estate',
    'Fine Vehicles',
    'Land Development',
    'Institutional Investment'
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const interest = formData.get('interest');
    const message = formData.get('message');

    const subject = encodeURIComponent(`New Inquiry from ${name} - ${interest}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInterest Area: ${interest}\n\nMessage:\n${message}`);
    
    window.location.href = `mailto:creedbhope@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-zinc-950 py-24 px-6 md:px-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-screen-2xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6"
          >
            Connect with <span className="text-emerald-400">Excellence.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium"
          >
            Whether you are expanding your portfolio or seeking an off-market masterpiece, our senior partners are ready to facilitate your vision.
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-black text-zinc-900 mb-8">Global Concierge.</h2>
            <p className="text-lg text-zinc-500 mb-12 leading-relaxed">
              Our presence spans major financial hubs and luxury enclaves. We provide localized expertise with a global standard of service.
            </p>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-emerald-800 border border-zinc-100 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">Direct Inquiry</h4>
                  <p className="text-xl font-bold text-zinc-900">creedbhope@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-emerald-800 border border-zinc-100 flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">Global Line</h4>
                  <p className="text-xl font-bold text-zinc-900">+1 (800) 555-HULU</p>
                </div>
              </div>

            </div>
          </div>

          {/* Form */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
            {isSubmitted ? (
               <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
               >
                 <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                 </div>
                 <h3 className="text-3xl font-black text-zinc-900 mb-4">Inquiry Received.</h3>
                 <p className="text-zinc-500 font-medium mb-8 max-w-sm">A senior partner will review your request and reach out via your preferred method within 24 hours.</p>
                 <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-emerald-800 font-bold flex items-center gap-2 hover:gap-3 transition-all"
                 >
                   Send another inquiry <ArrowRight size={18} />
                 </button>
               </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                    <input name="name" required type="text" placeholder="Johnathan Doe" className="w-full bg-white border border-zinc-200 px-5 py-4 rounded-2xl hover:border-zinc-300 hover:shadow-sm focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
                    <input name="email" required type="email" placeholder="j.doe@example.com" className="w-full bg-white border border-zinc-200 px-5 py-4 rounded-2xl hover:border-zinc-300 hover:shadow-sm focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all font-medium" />
                  </div>
                </div>
                <div className="space-y-2 relative z-50">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Interest Area</label>
                  <input type="hidden" name="interest" value={selectedInterest} />
                  <div className="relative group">
                    <button 
                      type="button"
                      onClick={() => setInterestDropdownOpen(!interestDropdownOpen)}
                      className="w-full bg-white border border-zinc-200 px-5 py-4 rounded-2xl hover:border-zinc-300 hover:shadow-sm focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all font-medium cursor-pointer flex justify-between items-center"
                    >
                      <span className="text-zinc-900">{selectedInterest}</span>
                      <ChevronDown className={`text-zinc-400 transition-transform ${interestDropdownOpen ? 'rotate-180 text-zinc-600' : 'group-hover:text-zinc-600'}`} size={20} />
                    </button>
                    
                    {interestDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {interests.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => {
                              setSelectedInterest(interest);
                              setInterestDropdownOpen(false);
                            }}
                            className={`w-full text-left px-5 py-4 transition-colors font-medium border-l-2 ${selectedInterest === interest ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-transparent text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300'}`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Message</label>
                  <textarea name="message" required rows={5} placeholder="Describe your interest or specific requirements..." className="w-full bg-white border border-zinc-200 px-5 py-4 rounded-2xl hover:border-zinc-300 hover:shadow-sm focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all font-medium resize-none"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-zinc-900 text-white font-bold py-5 rounded-xl hover:bg-emerald-800 transition-all shadow-xl shadow-zinc-900/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <><Send size={20} /> Submit Formal Inquiry</>
                  )}
                </button>
                <p className="text-center text-xs text-zinc-400 font-medium">Your data is handled with absolute confidentiality.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
