'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-12 max-w-md text-center"
                >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-700" size={40} strokeWidth={2} />
                    </div>
                    <h2 className="text-3xl font-semibold text-zinc-900 mb-4">Check your email.</h2>
                    <p className="text-zinc-600 mb-8 leading-relaxed">
                        We've sent a password reset link to <span className="font-medium text-zinc-900">{email}</span>.
                        Check your inbox and follow the instructions.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 bg-emerald-700 text-white font-medium px-6 py-3 rounded-full hover:bg-emerald-800 transition-all"
                    >
                        Back to login
                    </Link>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-50 rounded-3xl p-8 md:p-10"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center">
                            <Building2 className="text-white" size={20} strokeWidth={2} />
                        </div>
                        <span className="text-xl font-bold text-zinc-900">Hulu Properties</span>
                    </div>

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">Forgot password?</h1>
                        <p className="text-zinc-600">Enter your email to receive a reset link.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 text-red-700 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-200"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-700 transition-colors" size={20} strokeWidth={2} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border-2 border-zinc-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all text-zinc-900 placeholder:text-zinc-400"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <p className="text-xs text-zinc-500 ml-1">
                                We'll send a reset link to this email
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-700 text-white font-medium py-3.5 rounded-xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} strokeWidth={2} />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send reset link</span>
                                    <ArrowRight size={20} strokeWidth={2} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-zinc-200 text-center">
                        <p className="text-zinc-600">
                            Remember your password?{' '}
                            <Link href="/login" className="text-emerald-700 font-medium hover:text-emerald-800 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
