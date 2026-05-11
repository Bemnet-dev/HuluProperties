'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2, UserPlus, Eye, EyeOff, Building2, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-emerald-50/30 to-zinc-100 flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 shadow-2xl border border-zinc-200/50 max-w-md text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-emerald-700" size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 mb-4">Account Created!</h2>
          <p className="text-zinc-600 font-medium mb-6">
            Your account has been successfully created. Redirecting you to login...
          </p>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-emerald-700" size={20} />
            <span className="text-sm text-zinc-500 font-medium">Please wait...</span>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-emerald-50/30 to-zinc-100 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200/50">

        {/* Left Side - Branding & Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex flex-col justify-between bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 p-12 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Building2 className="text-white" size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-white uppercase tracking-tight">Hulu Properties</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Join the Elite Marketplace
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed font-medium">
              Create your account and get instant access to exclusive premium properties, luxury vehicles, and prime investment opportunities.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="text-emerald-200" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Save Your Favorites</h3>
                <p className="text-emerald-200 text-sm">Bookmark properties and track your interests</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp className="text-emerald-200" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Market Insights</h3>
                <p className="text-emerald-200 text-sm">Get notified about new premium listings</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <Users className="text-emerald-200" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Exclusive Community</h3>
                <p className="text-emerald-200 text-sm">Connect with verified buyers and sellers</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Signup Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center p-8 md:p-12 lg:p-16"
        >
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center">
              <Building2 className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-emerald-900 uppercase tracking-tight">Hulu Properties</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-3 tracking-tight">Create Account</h1>
            <p className="text-zinc-500 font-medium text-base">Join us and start exploring premium assets</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-700 p-4 rounded-2xl mb-6 text-sm font-semibold border border-red-200 flex items-start gap-3"
            >
              <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-red-700 text-xs font-bold">!</span>
              </div>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 ml-1">Full Name</label>
              <div className="relative group">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-700 transition-colors" size={20} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-700 outline-none transition-all font-medium text-zinc-900 placeholder:text-zinc-400"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-700 transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-700 outline-none transition-all font-medium text-zinc-900 placeholder:text-zinc-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-700 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-2xl py-4 pl-12 pr-12 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-700 outline-none transition-all font-medium text-zinc-900 placeholder:text-zinc-400"
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-zinc-500 ml-1 mt-1">Must be at least 6 characters</p>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 rounded border-2 border-zinc-300 text-emerald-700 focus:ring-2 focus:ring-emerald-200 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-sm text-zinc-600 font-medium">
                I agree to the{' '}
                <Link href="#" className="text-emerald-700 font-bold hover:text-emerald-900 hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="#" className="text-emerald-700 font-bold hover:text-emerald-900 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-bold py-4 rounded-2xl hover:from-emerald-900 hover:to-emerald-950 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-200">
            <p className="text-center text-sm text-zinc-600 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-700 font-bold hover:text-emerald-900 transition-colors hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
