'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Loader2, Building2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if we have a valid session (user clicked the reset link)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('Invalid or expired reset link. Please request a new one.');
            }
        };
        checkSession();
    }, []);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
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
                    <h2 className="text-3xl font-semibold text-zinc-900 mb-4">Password updated.</h2>
                    <p className="text-zinc-600 mb-8">
                        Your password has been successfully reset. Redirecting you to login...
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-emerald-700" size={20} />
                        <span className="text-sm text-zinc-500">Please wait...</span>
                    </div>
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
                        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">Reset password.</h1>
                        <p className="text-zinc-600">Enter your new password below.</p>
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
                            <label className="text-sm font-medium text-zinc-700">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-700 transition-colors" size={20} strokeWidth={2} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border-2 border-zinc-200 rounded-xl py-3.5 pl-12 pr-12 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all text-zinc-900 placeholder:text-zinc-400"
                                    placeholder="Enter new password"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                                </button>
                            </div>
                            <p className="text-xs text-zinc-500 ml-1">Must be at least 6 characters</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-700 transition-colors" size={20} strokeWidth={2} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white border-2 border-zinc-200 rounded-xl py-3.5 pl-12 pr-12 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all text-zinc-900 placeholder:text-zinc-400"
                                    placeholder="Confirm new password"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-700 text-white font-medium py-3.5 rounded-xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} strokeWidth={2} />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <span>Update password</span>
                                    <ArrowRight size={20} strokeWidth={2} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-zinc-200 text-center">
                        <Link href="/login" className="text-zinc-600 hover:text-zinc-900 transition-colors font-medium">
                            Back to login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
