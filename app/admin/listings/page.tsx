"use client";
import React from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

const MOCK_LISTINGS = [
  { id: 1, title: 'The Glass Pavilion', location: 'Beverly Hills, CA', price: 'ETB 14,500,000', type: 'Property', status: 'Active', views: 1250, date: 'Oct 12, 2023' },
  { id: 2, title: '2026 Porsche 911 GT3 RS', location: 'Los Angeles, CA', price: 'ETB 295,000', type: 'Vehicle', status: 'Active', views: 890, date: 'Oct 14, 2026' },
  { id: 3, title: 'Coastal Cliff Estate Land', location: 'Big Sur, CA', price: 'ETB 8,200,000', type: 'Land', status: 'Pending', views: 420, date: 'Oct 15, 2026' },
  { id: 4, title: 'Penthouse at 432 Park', location: 'New York, NY', price: 'ETB 35,000,000', type: 'Property', status: 'Active', views: 2100, date: 'Oct 18, 2026' },
  { id: 5, title: 'Rolls-Royce Phantom', location: 'Miami, FL', price: 'ETB 460,000', type: 'Vehicle', status: 'Sold', views: 156, date: 'Oct 20, 2026' },
];

export default function AdminListingsPage() {
  return (
    <div className="p-6 md:p-10 w-full mx-auto pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Manage Listings</h1>
          <p className="text-zinc-500 font-medium mt-1">View, edit, and manage all your assets on the platform.</p>
        </div>
        <Link href="/admin/listings/new" className="flex items-center justify-center gap-2 bg-emerald-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-800 transition-colors shadow-sm whitespace-nowrap">
          <Plus size={18} /> New Listing
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row justify-between gap-4 bg-zinc-50/50">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search listings..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-zinc-50 transition-colors">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-zinc-200">
                <th className="font-semibold text-zinc-500 p-4 text-xs uppercase tracking-wider">Asset Details</th>
                <th className="font-semibold text-zinc-500 p-4 text-xs uppercase tracking-wider">Status</th>
                <th className="font-semibold text-zinc-500 p-4 text-xs uppercase tracking-wider">Price</th>
                <th className="font-semibold text-zinc-500 p-4 text-xs uppercase tracking-wider">Type</th>
                <th className="font-semibold text-zinc-500 p-4 text-xs uppercase tracking-wider">Views</th>
                <th className="font-semibold text-zinc-500 p-4 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {MOCK_LISTINGS.map((listing) => (
                <tr key={listing.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-zinc-200 overflow-hidden relative shrink-0">
                        <Image src={`https://picsum.photos/seed/list${listing.id}/100/100`} alt={listing.title} fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 text-sm">{listing.title}</div>
                        <div className="text-xs text-zinc-500">{listing.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                      ${listing.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                        listing.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                        listing.status === 'Sold' ? 'bg-zinc-200 text-zinc-600' : 
                        'bg-zinc-100 text-zinc-800'}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-zinc-900 text-sm">{listing.price}</td>
                  <td className="p-4 text-sm text-zinc-600">{listing.type}</td>
                  <td className="p-4 text-sm font-semibold text-zinc-700">{listing.views.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-zinc-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-zinc-200 flex items-center justify-between text-sm text-zinc-500 bg-zinc-50/50">
          <span>Showing 1 to {MOCK_LISTINGS.length} of {MOCK_LISTINGS.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-zinc-200 bg-white hover:bg-zinc-50 cursor-pointer disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 rounded bg-emerald-900 text-white font-medium">1</button>
            <button className="px-3 py-1 rounded border border-zinc-200 bg-white hover:bg-zinc-50 cursor-pointer disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
