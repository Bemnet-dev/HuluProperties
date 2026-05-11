'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, Building2, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
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
            <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-emerald-50/30 to-zinc-100 flex items-center justify-center p-4 md:p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-12 shadow-2xl border border-zinc-200/50 max-w-md text-center"
                >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-700" size={40} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black text-zinc-900 mb-4">Check Your Email</h2>
                    <p className="text-zinc-600 font-medium mb-8 leading-relaxed">
                        We&apos;ve sent a password reset link to <span className="font-bold text-zinc-900">{email}</span>.
                        Please check your inbox and follow the instructions to reset your password.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-bold px-8 py-4 rounded-2xl hover:from-emerald-900 hover:to-emerald-950 transition-all shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Login</span>
                    </Link>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-emerald-50/30 to-zinc-100 flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200/50">

                {/* Left Side - Branding & Info */}
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
                            Reset Your Password
                        </h2>
                        <p className="text-emerald-100 text-lg leading-relaxed font-medium">
                            No worries! Enter your email address and we&apos;ll send you instructions to reset your password.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                                <KeyRound className="text-emerald-200" size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">Secure Process</h3>
                                <p className="text-emerald-200 text-sm">Password reset link expires in 1 hour</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                                <Mail className="text-emerald-200" size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">Check Your Inbox</h3>
                                <p className="text-emerald-200 text-sm">Link will be sent to your registered email</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Reset Form */}
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
                        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-3 tracking-tight">Forgot Password?</h1>
                        <p className="text-zinc-500 font-medium text-base">Enter your email and we&apos;ll send you a reset link</p>
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

                    <form onSubmit={handleResetPassword} className="space-y-5">
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
                            <p className="text-xs text-zinc-500 ml-1 mt-2">
                                Enter the email address associated with your account
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-bold py-4 rounded-2xl hover:from-emerald-900 hover:to-emerald-950 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Sending Link...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send Reset Link</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-zinc-200">
                        <p className="text-center text-sm text-zinc-600 font-medium">
                            Remember your password?{' '}
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
