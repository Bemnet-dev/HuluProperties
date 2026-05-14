'use client';

import { useEffect, useState } from 'react';
import { supabase, testSupabaseConnection } from '@/lib/supabase';

export default function SupabaseStatus() {
    const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
    const [error, setError] = useState<string | null>(null);
    const [config, setConfig] = useState({ url: '', hasKey: false });

    useEffect(() => {
        const checkConnection = async () => {
            // Check config
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

            setConfig({
                url: url,
                hasKey: !!key && key !== 'placeholder'
            });

            if (!url || !key || url.includes('placeholder') || key === 'placeholder') {
                setStatus('error');
                setError('Supabase credentials not configured. Please update .env.local');
                return;
            }

            // Test connection
            const result = await testSupabaseConnection();

            if (result.success) {
                setStatus('connected');
            } else {
                setStatus('error');
                setError(result.error || 'Unknown error');
            }
        };

        checkConnection();
    }, []);

    if (process.env.NODE_ENV === 'production') {
        return null; // Don't show in production
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-white border-2 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${status === 'checking' ? 'bg-yellow-500 animate-pulse' :
                        status === 'connected' ? 'bg-green-500' :
                            'bg-red-500'
                    }`}></div>
                <h3 className="font-bold text-sm">Supabase Status</h3>
            </div>

            <div className="text-xs space-y-1 text-zinc-600">
                <div>
                    <span className="font-semibold">URL:</span>{' '}
                    {config.url ? (
                        <span className="text-green-600">✓ Set</span>
                    ) : (
                        <span className="text-red-600">✗ Missing</span>
                    )}
                </div>
                <div>
                    <span className="font-semibold">Key:</span>{' '}
                    {config.hasKey ? (
                        <span className="text-green-600">✓ Set</span>
                    ) : (
                        <span className="text-red-600">✗ Missing</span>
                    )}
                </div>
                <div>
                    <span className="font-semibold">Connection:</span>{' '}
                    {status === 'checking' && <span className="text-yellow-600">Checking...</span>}
                    {status === 'connected' && <span className="text-green-600">✓ Connected</span>}
                    {status === 'error' && <span className="text-red-600">✗ Failed</span>}
                </div>
            </div>

            {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    {error}
                </div>
            )}

            {status === 'error' && (
                <div className="mt-2 text-xs">
                    <a
                        href="/SUPABASE_SETUP.md"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                    >
                        → Setup Guide
                    </a>
                </div>
            )}
        </div>
    );
}
