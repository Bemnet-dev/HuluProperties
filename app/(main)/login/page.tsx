'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 pt-32">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-zinc-100"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-zinc-900 mb-2 uppercase tracking-tight">Admin Login</h1>
            <p className="text-zinc-500 font-medium">Enter your credentials to manage assets</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 italic">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none transition-all font-medium"
                  placeholder="admin@huluproperties.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-emerald-900 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Sign In <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-10 text-center space-y-4">
            <p className="text-sm text-zinc-500 font-medium">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-emerald-900 font-black hover:underline">
                Sign Up
              </Link>
            </p>
            <Link href="/" className="block text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-widest">
              ← Back to Marketplace
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
