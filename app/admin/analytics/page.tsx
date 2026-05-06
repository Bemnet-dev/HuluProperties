"use client";
import React from 'react';
import { ArrowUpRight, BarChart3, TrendingUp, Users, Eye, Download } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="p-6 md:p-10 w-full mx-auto pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Analytics & Insights</h1>
          <p className="text-zinc-500 font-medium mt-1">Deep dive into your portfolio&apos;s performance.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-5 py-2.5 rounded-xl font-bold hover:bg-zinc-50 transition-colors shadow-sm whitespace-nowrap">
          <Download size={18} /> Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="text-zinc-400" size={20} />
            <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Total Views</h3>
          </div>
          <div className="text-4xl font-black text-zinc-900 mb-2">124.5k</div>
          <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp size={16} /> +14.2% from last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-zinc-400" size={20} />
            <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Unique Visitors</h3>
          </div>
          <div className="text-4xl font-black text-zinc-900 mb-2">42.1k</div>
          <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp size={16} /> +8.1% from last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-zinc-400" size={20} />
            <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Avg. Time on Site</h3>
          </div>
          <div className="text-4xl font-black text-zinc-900 mb-2">4m 12s</div>
          <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp size={16} /> +2.4% from last month
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 min-h-[400px] flex flex-col items-center justify-center text-center">
           <BarChart3 size={48} className="text-zinc-300 mb-4" />
           <h3 className="text-lg font-bold text-zinc-900">Traffic Overview</h3>
           <p className="text-zinc-500 font-medium max-w-sm mt-2">Chart integration would be placed here. Add a library like Recharts to visualize this data.</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 min-h-[400px] flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
              <ArrowUpRight size={24} className="text-emerald-700" />
           </div>
           <h3 className="text-lg font-bold text-zinc-900">Top Performing Asset</h3>
           <p className="text-zinc-500 font-medium max-w-sm mt-2 mb-4">The Glass Pavilion has received the most engagement this week.</p>
           <button className="text-sm font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-wider">View Details</button>
        </div>
      </div>
    </div>
  );
}
