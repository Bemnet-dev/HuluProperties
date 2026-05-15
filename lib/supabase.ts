import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Validate environment variables
const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!isConfigured) {
    console.warn('⚠️ Supabase environment variables are missing! Using placeholders for build time.');
    console.warn('Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.');
}

// Check if using placeholder values
if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
    if (process.env.NODE_ENV === 'production' && isConfigured) {
        // This shouldn't happen if isConfigured is true, but just in case
    }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: typeof window !== 'undefined', // Only persist in browser
        autoRefreshToken: typeof window !== 'undefined',
        detectSessionInUrl: typeof window !== 'undefined',
    },
});

// Helper function to check Supabase connection
export async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase.from('listings').select('count').limit(1);

        if (error) {
            console.error('Supabase connection error:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Supabase connection successful');
        return { success: true, data };
    } catch (error: any) {
        console.error('Supabase connection failed:', error);
        return { success: false, error: error.message };
    }
}
