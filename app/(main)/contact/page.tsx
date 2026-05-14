"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, ChevronDown } from 'lucide-react';

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
      {/* Hero Header - Apple Style */}
      <section className="pt-32 pb-20 px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 text-zinc-900"
          >
            Get in touch.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-zinc-600 max-w-3xl mx-auto leading-relaxed"
          >
            Whether you're expanding your portfolio or seeking an exclusive property, our team is ready to help.
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Info - Apple Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900 mb-6">Contact us.</h2>
            <p className="text-lg text-zinc-600 mb-12 leading-relaxed">
              We're here to answer your questions and help you find your next premium asset.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 flex-shrink-0">
                  <Mail size={20} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 mb-1">Email</h4>
                  <p className="text-lg font-medium text-zinc-900">creedbhope@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 flex-shrink-0">
                  <Phone size={20} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 mb-1">Phone</h4>
                  <p className="text-lg font-medium text-zinc-900">+1 (800) 555-HULU</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 flex-shrink-0">
                  <MapPin size={20} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 mb-1">Location</h4>
                  <p className="text-lg font-medium text-zinc-900">Global presence</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form - Apple Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-50 rounded-3xl p-8 md:p-10"
          >
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={32} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-semibold text-zinc-900 mb-3">Message sent.</h3>
                <p className="text-zinc-600 mb-8 max-w-sm">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-emerald-700 font-medium flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Send another message <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Name</label>
                  <input
                    name="name"
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-white border border-zinc-200 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all text-zinc-900 placeholder:text-zinc-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Email</label>
                  <input
                    name="email"
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-white border border-zinc-200 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all text-zinc-900 placeholder:text-zinc-400"
                  />
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-zinc-700">Interest</label>
                  <input type="hidden" name="interest" value={selectedInterest} />
                  <button
                    type="button"
                    onClick={() => setInterestDropdownOpen(!interestDropdownOpen)}
                    className="w-full bg-white border border-zinc-200 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all text-zinc-900 flex justify-between items-center"
                  >
                    <span>{selectedInterest}</span>
                    <ChevronDown className={`text-zinc-400 transition-transform ${interestDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                  </button>

                  {interestDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50">
                      {interests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => {
                            setSelectedInterest(interest);
                            setInterestDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 transition-colors ${selectedInterest === interest ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-zinc-700 hover:bg-zinc-50'}`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your requirements..."
                    className="w-full bg-white border border-zinc-200 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all text-zinc-900 placeholder:text-zinc-400 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-700 text-white font-medium py-3.5 rounded-xl hover:bg-emerald-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Sending..." : <><Send size={18} /> Send message</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
