"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
      ${status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
        status === 'Pending' ? 'bg-amber-100 text-amber-800' :
        status === 'Sold' ? 'bg-zinc-200 text-zinc-600' :
        'bg-zinc-100 text-zinc-800'}`}>
      {status}
    </span>
  );
}

export default function AdminListingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching listings:', error);
      } else {
        setListings(data || []);
      }
      setLoading(false);
    };

    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || listing.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this listing and its images?')) {
      // Find the listing to get its images
      const listingToDelete = listings.find(l => l.id === id);
      
      // Delete images from storage first
      if (listingToDelete && listingToDelete.images && listingToDelete.images.length > 0) {
        const filePaths = listingToDelete.images.map((url: string) => {
          // Extract the 'listings/filename.ext' from the full public URL
          const parts = url.split('/assets/');
          return parts.length > 1 ? parts[1] : null;
        }).filter(Boolean);

        if (filePaths.length > 0) {
          await supabase.storage.from('assets').remove(filePaths);
        }
      }

      // Delete the database record
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) {
        alert('Error deleting listing: ' + error.message);
      } else {
        setListings(listings.filter(l => l.id !== id));
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/listings/new?edit=${id}`);
  };

  return (
    <div className="p-4 md:p-10 w-full mx-auto pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">Manage Listings</h1>
          <p className="text-zinc-500 font-medium mt-1 text-sm">View, edit, and manage all your assets on the platform.</p>
        </div>
        <Link href="/admin/listings/new" className="flex items-center justify-center gap-2 bg-emerald-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-800 transition-colors shadow-sm whitespace-nowrap text-sm">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="flex items-center justify-between gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-zinc-50 transition-colors w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              >
                <div className="flex items-center gap-2">
                  <Filter size={14} />
                  <span>{filterType === 'All' ? 'All Types' : filterType}</span>
                </div>
                {filterDropdownOpen ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
              </button>
              {filterDropdownOpen && (
                <div className="absolute top-full right-0 sm:left-0 mt-2 w-full sm:w-40 bg-white border border-zinc-200 shadow-lg rounded-xl overflow-hidden z-10">
                  {['All', 'Property', 'Vehicle', 'Land'].map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setFilterDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${
                        filterType === type ? 'bg-emerald-50 text-emerald-900 border-l-2 border-emerald-600' : 'text-zinc-700 hover:bg-zinc-50 border-l-2 border-transparent'
                      }`}
                    >
                      {type === 'All' ? 'All Types' : type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
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
              {filteredListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-zinc-200 overflow-hidden relative shrink-0">
                        {listing.images && listing.images.length > 0 ? (
                          <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 text-xs">No img</div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 text-sm">{listing.title}</div>
                        <div className="text-xs text-zinc-500">{listing.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><StatusBadge status={listing.status} /></td>
                  <td className="p-4 font-bold text-zinc-900 text-sm">{listing.price}</td>
                  <td className="p-4 text-sm text-zinc-600">{listing.type}</td>
                  <td className="p-4 text-sm font-semibold text-zinc-700">{listing.views || 0}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(listing.id)}
                        className="p-2 text-zinc-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(listing.id)}
                        className="p-2 text-zinc-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-zinc-100">
          {filteredListings.length === 0 && (
            <div className="p-8 text-center text-zinc-500 text-sm">No listings found.</div>
          )}
          {filteredListings.map((listing) => (
            <div key={listing.id} className="p-4 flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-zinc-200 overflow-hidden relative shrink-0">
                {listing.images && listing.images.length > 0 ? (
                  <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 text-xs">No img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-zinc-900 text-sm truncate">{listing.title}</div>
                  <div className="flex gap-1 shrink-0">
                    <button 
                      onClick={() => handleEdit(listing.id)}
                      className="p-1.5 text-zinc-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Edit size={15} />
                    </button>
                    <button 
                      onClick={() => handleDelete(listing.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">{listing.location}</div>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <StatusBadge status={listing.status} />
                  <span className="text-xs font-bold text-zinc-700">{listing.price}</span>
                  <span className="text-xs text-zinc-400">{listing.views || 0} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-zinc-200 flex items-center justify-between text-sm text-zinc-500 bg-zinc-50/50 flex-wrap gap-2">
          <span className="text-xs">Showing {filteredListings.length > 0 ? 1 : 0} to {filteredListings.length} of {filteredListings.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-zinc-200 bg-white hover:bg-zinc-50 cursor-pointer disabled:opacity-50 text-xs" disabled>Prev</button>
            <button className="px-3 py-1 rounded bg-emerald-900 text-white font-medium text-xs">1</button>
            <button className="px-3 py-1 rounded border border-zinc-200 bg-white hover:bg-zinc-50 cursor-pointer disabled:opacity-50 text-xs" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
