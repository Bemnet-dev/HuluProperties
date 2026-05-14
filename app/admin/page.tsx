"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Home, DollarSign, Users, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalInquiries: 0,
  });
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const displayName = user?.user_metadata?.full_name ||
    (user?.email ? user.email.split('@')[0] : 'Admin');
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch listings stats
        const { data: allListings, error: listingsError } = await supabase
          .from('listings')
          .select('*');

        if (!listingsError && allListings) {
          const activeCount = allListings.filter(l => l.status === 'Active').length;
          setStats({
            totalListings: allListings.length,
            activeListings: activeCount,
            totalViews: 0, // You can add a views column to track this
            totalInquiries: 0, // You can add an inquiries table to track this
          });

          // Get recent listings
          const recent = allListings
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
          setRecentListings(recent);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-emerald-900" size={40} />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Listings',
      value: stats.totalListings,
      icon: Home,
      color: 'bg-blue-50 text-blue-600',
      trend: '+12%',
    },
    {
      title: 'Active Listings',
      value: stats.activeListings,
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600',
      trend: '+8%',
    },
    {
      title: 'Total Views',
      value: stats.totalViews || '—',
      icon: Eye,
      color: 'bg-purple-50 text-purple-600',
      trend: '+23%',
    },
    {
      title: 'Inquiries',
      value: stats.totalInquiries || '—',
      icon: Users,
      color: 'bg-orange-50 text-orange-600',
      trend: '+5%',
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-500 mt-1 font-medium">Welcome back, {formattedName}. Here's what's happening with your properties.</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="flex items-center justify-center gap-2 bg-emerald-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-800 transition-colors shadow-sm"
        >
          + New Listing
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-zinc-500 font-medium">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Listings */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
          <h2 className="text-lg font-bold text-zinc-900">Recent Listings</h2>
          <Link href="/admin/listings" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">
            View All →
          </Link>
        </div>

        {recentListings.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Home size={48} className="mx-auto mb-4 text-zinc-300" />
            <p className="font-medium">No listings yet</p>
            <Link href="/admin/listings/new" className="text-emerald-700 hover:underline text-sm mt-2 inline-block">
              Create your first listing
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="overflow-x-auto hidden sm:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    <th className="font-semibold text-zinc-500 p-4 text-sm uppercase tracking-wider">Title</th>
                    <th className="font-semibold text-zinc-500 p-4 text-sm uppercase tracking-wider">Type</th>
                    <th className="font-semibold text-zinc-500 p-4 text-sm uppercase tracking-wider">Location</th>
                    <th className="font-semibold text-zinc-500 p-4 text-sm uppercase tracking-wider">Price</th>
                    <th className="font-semibold text-zinc-500 p-4 text-sm uppercase tracking-wider">Status</th>
                    <th className="font-semibold text-zinc-500 p-4 text-sm uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="p-4 text-sm font-semibold text-zinc-900">{listing.title}</td>
                      <td className="p-4 text-sm text-zinc-600">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700">
                          {listing.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-zinc-600">{listing.location}</td>
                      <td className="p-4 text-sm font-semibold text-zinc-900">{listing.price}</td>
                      <td className="p-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${listing.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-zinc-100 text-zinc-700'
                          }`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-zinc-400">
                        {new Date(listing.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="flex flex-col sm:hidden divide-y divide-zinc-100">
              {recentListings.map((listing) => (
                <div key={listing.id} className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-zinc-900">{listing.title}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${listing.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-zinc-100 text-zinc-700'
                      }`}>
                      {listing.status}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-600">{listing.location}</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-semibold text-zinc-900">{listing.price}</span>
                    <span className="text-xs text-zinc-400">
                      {new Date(listing.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
