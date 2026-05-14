import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables!');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
}

// Check if using placeholder values
if (supabaseUrl.includes('placeholder') || supabaseAnonKey === 'placeholder') {
    console.warn('⚠️ Using placeholder Supabase credentials. Please update .env.local with your actual credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
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
