"use client";
import React from 'react';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboard() {
  const { user } = useAuth();
  const userName = user?.email ? user.email.split('@')[0] : 'Admin';
  const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const recentActivity = [
    { id: 1, action: "New Inquiry", item: "The Glass Pavilion", user: "j.smith@capital.com", time: "2 hours ago", status: "pending" },
    { id: 2, action: "Offer Accepted", item: "2026 Porsche 911", user: "m.wright@estate.co", time: "5 hours ago", status: "success" },
    { id: 3, action: "Listing Updated", item: "Coastal Cliff Land", user: `${formattedName} (Admin)`, time: "1 day ago", status: "neutral" },
    { id: 4, action: "Escrow Started", item: "Napa Vineyard", user: "Legal Dept", time: "2 days ago", status: "info" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-500 mt-1font-medium">Welcome back, {formattedName}. Here is what is happening with your properties.</p>
        </div>
      </div>

      <div>
        {/* Recent Activity Table */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
            <h2 className="text-lg font-bold text-zinc-900">Recent Activity</h2>
            <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="overflow-x-auto flex-grow hidden sm:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="font-semibold text-zinc-500 p-4 text-sm uppercase tracking-wider">Event</th>
                  <th className="font-semibold text-zinc-500 p-4 text-sm uppercase tracking-wider">Asset</th>
                  <th className="font-semibold text-zinc-500 p-4 text-sm uppercase tracking-wider">Actor</th>
                  <th className="font-semibold text-zinc-500 p-4 text-sm uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentActivity.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors group">
                    <td className="p-4 text-sm font-semibold text-zinc-900">{row.action}</td>
                    <td className="p-4 text-sm text-zinc-600 font-medium">{row.item}</td>
                    <td className="p-4 text-sm text-zinc-500">{row.user}</td>
                    <td className="p-4 text-sm text-zinc-400">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile list view */}
          <div className="flex flex-col sm:hidden divide-y divide-zinc-100">
             {recentActivity.map((row) => (
               <div key={row.id} className="p-4 flex flex-col gap-2">
                 <div className="flex justify-between items-start">
                   <span className="font-semibold text-zinc-900">{row.action}</span>
                   <span className="text-xs text-zinc-400">{row.time}</span>
                 </div>
                 <div className="text-sm text-zinc-600">{row.item}</div>
                 <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-zinc-500">{row.user}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
