'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getSupabaseClient } from '@/lib/supabase';
import {
  MessageSquare, Search, Trash2,
  Mail, Phone, Clock, CheckCircle2,
  Inbox, Reply, Plus, X
} from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminQueries() {
  const { data: queries, isLoading } = useSWR('/api/queries', fetcher);
  
  // Real-time Sync
  useSupabaseRealtime('queries', '/api/queries');

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = Array.isArray(queries) ? queries.filter((q: any) => 
    (q?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (q?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (q?.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ) : [];

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch('/api/queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success('Query added successfully');
      setIsModalOpen(false);
      mutate('/api/queries');
    } else {
      const errorData = await res.json();
      toast.error('Error: ' + errorData.error);
    }
  };


  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/queries?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      mutate('/api/queries');
    } else {
      toast.error('Failed to update status');
    }
  };

  const deleteQuery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this query?')) return;
    const res = await fetch(`/api/queries?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Query deleted');
      mutate('/api/queries');
    } else {
      toast.error('Failed to delete query');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-700 mb-1">Queries</h1>
          <p className="text-slate-500 text-sm">Review and respond to patient inquiries.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-navy-600 hover:bg-navy-700 text-white font-bold rounded-2xl shadow-xl shadow-navy-100 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Query
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl shadow-card border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
          />
        </div>
      </div>


      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered?.map((query: any) => (
          <div 
            key={query.id} 
            className={`bg-white rounded-[2.5rem] p-8 shadow-card border transition-all ${
              query.status === 'unread' ? 'border-teal-100 bg-teal-50/10' : 'border-slate-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  query.status === 'unread' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Inbox size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-navy-700">{query.name}</h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{query.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {query.status === 'unread' ? (
                  <button 
                    onClick={() => updateStatus(query.id, 'read')}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Mark as Read
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                    <CheckCircle2 size={14} /> Read
                  </span>
                )}
                <button 
                  onClick={() => deleteQuery(query.id)}
                  className="p-2.5 bg-slate-100 hover:bg-red-50 text-red-500 rounded-xl transition-all active:scale-90 shadow-sm"
                  title="Delete Inquiry"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-5 mb-6 border border-slate-100/50 italic text-slate-600 text-sm leading-relaxed">
              "{query.message}"
            </div>

            <div className="flex flex-wrap gap-y-4 gap-x-8 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-300" />
                <a href={`mailto:${query.email}`} className="text-xs font-semibold text-slate-500 hover:text-teal-600">{query.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-300" />
                <a href={`tel:${query.phone}`} className="text-xs font-semibold text-slate-500 hover:text-teal-600">{query.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-300" />
                <span className="text-xs font-semibold text-slate-400">{new Date(query.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <a 
                href={`mailto:${query.email}?subject=Re: ${query.subject}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-navy-600 hover:bg-navy-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-navy-100"
              >
                <Reply size={16} />
                Reply via Email
              </a>
            </div>
          </div>
        ))}
        {isLoading && <div className="col-span-full py-20 text-center text-slate-400">Loading queries...</div>}
        {!isLoading && !filtered?.length && <div className="col-span-full py-20 text-center text-slate-400">No queries found.</div>}
      </div>
      {/* Query Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-navy-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-xl transition-all">
              <X size={24} />
            </button>
            <form onSubmit={handleSave} className="p-8 lg:p-10 space-y-6">
              <h2 className="font-display text-2xl font-bold text-navy-700">Add New Query</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Name</label>
                    <input name="name" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Phone</label>
                    <input name="phone" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm" placeholder="+91..." />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Email</label>
                  <input name="email" type="email" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Subject</label>
                  <input name="subject" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm" placeholder="General Inquiry" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Message</label>
                  <textarea name="message" rows={4} required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm resize-none" placeholder="Enter message..." />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-600 font-bold">Cancel</button>
                <button type="submit" className="px-10 py-3 bg-navy-600 text-white font-bold rounded-2xl shadow-xl shadow-navy-100">Save Query</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

