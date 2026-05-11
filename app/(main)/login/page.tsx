'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Building2, Shield, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-emerald-50/30 to-zinc-100 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200/50">

        {/* Left Side - Branding & Visual */}
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
              Welcome Back to Your Premium Marketplace
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed font-medium">
              Access your exclusive collection of premium properties, luxury vehicles, and prime land investments.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <Shield className="text-emerald-200" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Secure Access</h3>
                <p className="text-emerald-200 text-sm">Bank-level encryption protects your data</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <Sparkles className="text-emerald-200" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Exclusive Listings</h3>
                <p className="text-emerald-200 text-sm">Access to premium assets worldwide</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
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
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-3 tracking-tight">Sign In</h1>
            <p className="text-zinc-500 font-medium text-base">Enter your credentials to access your account</p>
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

          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-2 border-zinc-300 text-emerald-700 focus:ring-2 focus:ring-emerald-200 cursor-pointer" />
                <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-bold py-4 rounded-2xl hover:from-emerald-900 hover:to-emerald-950 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-200">
            <p className="text-center text-sm text-zinc-600 font-medium">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-emerald-700 font-bold hover:text-emerald-900 transition-colors hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
