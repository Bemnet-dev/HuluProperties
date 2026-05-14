'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        // Admin check: check user_metadata or specific email
        if (session?.user) {
          const isAdminUser =
            session.user.user_metadata?.role === 'admin' ||
            session.user.email === 'creedbhope@gmail.com';
          setIsAdmin(isAdminUser);
        } else {
          setIsAdmin(false);
        }

        setLoading(false);
      } catch (error) {
        console.error('Unexpected error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const isAdminUser =
          session.user.user_metadata?.role === 'admin' ||
          session.user.email === 'creedbhope@gmail.com';
        setIsAdmin(isAdminUser);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);

      // Handle specific auth events
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setIsAdmin(false);
      }

      if (event === 'PASSWORD_RECOVERY') {
        // User clicked the reset password link
        console.log('Password recovery initiated');
      }

      if (event === 'USER_UPDATED') {
        console.log('User updated');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return {
    user,
    session,
    isAdmin,
    loading,
    signOut,
    signIn,
    signUp,
    resetPassword,
    updatePassword
  };
}
