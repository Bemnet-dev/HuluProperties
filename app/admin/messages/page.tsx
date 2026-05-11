"use client";
import React, { useState } from 'react';
import { Search, Mail, Reply, Trash2, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

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
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-zinc-400 font-medium text-sm p-8 text-center">
                No messages yet.
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} onClick={() => setSelectedMessage(msg)} className={`p-4 cursor-pointer transition-colors ${msg.unread ? 'bg-white border-l-4 border-emerald-600' : 'hover:bg-zinc-50 bg-transparent'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm ${msg.unread ? 'font-bold text-zinc-900' : 'font-semibold text-zinc-700'}`}>{msg.sender}</span>
                    <span className="text-xs text-zinc-400 font-medium">{msg.date}</span>
                  </div>
                  <div className={`text-sm mb-1 truncate ${msg.unread ? 'font-bold text-zinc-900' : 'text-zinc-600'}`}>{msg.subject}</div>
                  <div className="text-xs text-zinc-500 truncate">{msg.excerpt}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="hidden md:flex w-full md:w-2/3 flex-col bg-white">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-zinc-200 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 mb-1">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-zinc-900">{selectedMessage.sender}</span>
                    <span className="text-zinc-400">&lt;{selectedMessage.email}&gt;</span>
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
                  {selectedMessage.excerpt}
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
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
              <Mail size={48} className="mb-4 text-zinc-200" strokeWidth={1} />
              <p className="font-medium">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
