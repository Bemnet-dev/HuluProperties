"use client";
import React from 'react';
import { Save, User, Bell, Shield, Wallet } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-10 w-full max-w-5xl mx-auto pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Settings</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage your account preferences and configurations.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-emerald-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-800 transition-colors shadow-sm">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">


        {/* Settings Content */}
        <div className="flex-1 space-y-8">
          
          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 border-b border-zinc-100 pb-4">Personal Information</h2>
            


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700">First Name</label>
                <input type="text" defaultValue="Alex" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-zinc-50/50 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700">Last Name</label>
                <input type="text" defaultValue="Carter" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-zinc-50/50 font-medium text-sm" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-zinc-700">Email Address</label>
                <input type="email" defaultValue="alex.carter@huluproperties.com" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-zinc-50/50 font-medium text-sm" />
              </div>

            </div>
          </div>
          


        </div>
      </div>
    </div>
  );
}
