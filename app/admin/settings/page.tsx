"use client";
import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
        }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-emerald-900" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 w-full max-w-5xl mx-auto pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Settings</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage your account preferences and configurations.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-emerald-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={18} /> Save Changes
            </>
          )}
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
          }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col gap-8">
        <form onSubmit={handleSave} className="flex-1 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 border-b border-zinc-100 pb-4">Personal Information</h2>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-zinc-50/50 font-medium text-sm"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-100 font-medium text-sm text-zinc-500 cursor-not-allowed"
                />
                <p className="text-xs text-zinc-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700">Account Created</label>
                <input
                  type="text"
                  value={new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-100 font-medium text-sm text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
