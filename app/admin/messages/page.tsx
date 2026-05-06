"use client";
import React from 'react';
import { Search, Mail, Reply, Trash2, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const MOCK_MESSAGES = [
  { id: 1, sender: 'Michael Wright', email: 'm.wright@estate.co', subject: 'Inquiry: 2026 Porsche 911 GT3 RS', date: 'Oct 24, 2026', unread: true, excerpt: 'I am highly interested in the 911 GT3 RS you have listed. Is it still available for a private viewing this week?' },
  { id: 2, sender: 'Eleanor Vance', email: 'eleanor.v@capital.com', subject: 'Details on Coastal Cliff', date: 'Oct 23, 2026', unread: true, excerpt: 'Could you please send over the permit documents for the Big Sur land? We are considering an offer.' },
  { id: 3, sender: 'James Holden', email: 'jholden@roc.net', subject: 'The Glass Pavilion Escrow', date: 'Oct 20, 2026', unread: false, excerpt: 'The funds have been transferred to the escrow account holding company, please confirm receipt.' },
];

export default function MessagesPage() {
  return (
    <div className="p-6 md:p-10 w-full mx-auto pb-24 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Messages</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage inquiries from potential buyers and partners.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row flex-1 overflow-hidden min-h-[600px]">
        {/* Sidebar List */}
        <div className="w-full md:w-1/3 border-r border-zinc-200 flex flex-col bg-zinc-50/30">
          <div className="p-4 border-b border-zinc-200">
             <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 text-sm font-medium bg-white"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            {MOCK_MESSAGES.map((msg) => (
              <div key={msg.id} className={`p-4 cursor-pointer transition-colors ${msg.unread ? 'bg-white border-l-4 border-emerald-600' : 'hover:bg-zinc-50 bg-transparent'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm ${msg.unread ? 'font-bold text-zinc-900' : 'font-semibold text-zinc-700'}`}>{msg.sender}</span>
                  <span className="text-xs text-zinc-400 font-medium">{msg.date}</span>
                </div>
                <div className={`text-sm mb-1 truncate ${msg.unread ? 'font-bold text-zinc-900' : 'text-zinc-600'}`}>{msg.subject}</div>
                <div className="text-xs text-zinc-500 truncate">{msg.excerpt}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Content */}
        <div className="hidden md:flex w-full md:w-2/3 flex-col bg-white">
          <div className="p-6 border-b border-zinc-200 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-1">Inquiry: 2023 Porsche 911 GT3 RS</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-zinc-900">Michael Wright</span>
                <span className="text-zinc-400">&lt;m.wright@estate.co&gt;</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors tooltip relative group">
                <Reply size={18} />
              </button>
              <button className="p-2 text-zinc-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                <CheckCircle size={18} />
              </button>
              <button className="p-2 text-zinc-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="text-zinc-700 text-sm leading-relaxed whitespace-pre-wrap">
              <p>Hello Alex,</p>
              <p className="mt-4">I am highly interested in the 911 GT3 RS you have listed. Is it still available for a private viewing this week?</p>
              <p className="mt-4">My client is looking to complete an acquisition quickly if the vehicle meets our standards.</p>
              <p className="mt-4">Best regards,<br/>Michael Wright<br/>Managing Partner, Estate Co.</p>
            </div>
          </div>
          <div className="p-6 border-t border-zinc-200 bg-zinc-50/50">
             <div className="relative">
                <textarea 
                  rows={4} 
                  placeholder="Type your reply here..." 
                  className="w-full p-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 text-sm font-medium resize-none"
                />
                <button className="absolute bottom-4 right-4 bg-emerald-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-800 transition-colors shadow-sm">
                  Send Reply
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
