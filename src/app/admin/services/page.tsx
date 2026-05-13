'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getSupabaseClient } from '@/lib/supabase';
import {
  Stethoscope, Plus, Search, Trash2,
  Edit2, Clock, DollarSign, Star,
  X, CheckCircle2, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminServices() {
  const { data: services, isLoading } = useSWR('/api/services', fetcher);
  
  // Real-time Sync
  useSupabaseRealtime('services', '/api/services');

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const filtered = services?.filter((s: any) => 
    (s?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (s?.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Service deleted');
      mutate('/api/services');
    } else {
      toast.error('Error deleting service');
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const formattedData = {
      ...data,
      popular: data.popular === 'on',
      urgent: data.urgent === 'on',
      color: data.category === 'Emergency' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-600',
    };

    const url = editingService ? `/api/services?id=${editingService.id}` : '/api/services';
    const method = editingService ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData),
    });

    if (res.ok) {
      toast.success('Service saved successfully');
      setIsModalOpen(false);
      setEditingService(null);
      mutate('/api/services');
    } else {
      const errorData = await res.json();
      toast.error('Error saving service: ' + errorData.error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-700 mb-1">Services</h1>
          <p className="text-slate-500 text-sm">Manage treatments, pricing, and descriptions.</p>
        </div>
        <button 
          onClick={() => { setEditingService(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-navy-600 hover:bg-navy-700 text-white font-bold rounded-2xl shadow-xl shadow-navy-100 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add New Service
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-card border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered?.map((service: any) => (
          <div key={service.id} className="bg-white rounded-[2.5rem] p-8 shadow-card border border-slate-100 flex flex-col hover:border-teal-200 transition-all group">
            <div className="mb-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  service.category === 'Emergency' ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-600'
                }`}>
                  <Stethoscope size={24} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setEditingService(service); setIsModalOpen(true); }}
                    className="p-2 bg-slate-50 hover:bg-teal-50 text-teal-600 rounded-xl transition-all active:scale-90"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all active:scale-90"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-display text-xl font-bold text-navy-700">{service.name}</h3>
                {service.popular && (
                  <span className="flex items-center gap-1 bg-amber-50 text-amber-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-amber-100">
                    <Star size={8} className="fill-amber-600" /> Popular
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{service.category}</p>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                {service.description}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-50 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-navy-600 bg-slate-50 px-3 py-1.5 rounded-xl">
                <Clock size={14} className="text-slate-400" />
                {service.duration}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                <DollarSign size={14} />
                {service.price}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-navy-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
            
            <form onSubmit={handleSave} className="p-8 lg:p-10 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-navy-700 mb-2">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <p className="text-slate-500 text-sm">Configure treatment details and visibility.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">Service Name</label>
                  <input name="name" defaultValue={editingService?.name} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm" placeholder="e.g. Root Canal Treatment" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">Category</label>
                  <select name="category" defaultValue={editingService?.category || 'Preventive'} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm appearance-none">
                    <option value="Preventive">Preventive</option>
                    <option value="Cosmetic">Cosmetic</option>
                    <option value="Surgical">Surgical</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Orthodontic">Orthodontic</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">Price Label</label>
                  <input name="price" defaultValue={editingService?.price} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm" placeholder="e.g. From $150" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">Duration</label>
                  <input name="duration" defaultValue={editingService?.duration} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm" placeholder="e.g. 45 - 60 min" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">Description</label>
                  <textarea name="description" defaultValue={editingService?.description} rows={4} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm resize-none" placeholder="Explain the treatment process..." />
                </div>
                <div className="flex items-center gap-6 md:col-span-2 px-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="popular" id="popular" defaultChecked={editingService?.popular} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                    <label htmlFor="popular" className="text-sm font-bold text-slate-700 cursor-pointer">Mark as Popular</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="urgent" id="urgent" defaultChecked={editingService?.urgent} className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500" />
                    <label htmlFor="urgent" className="text-sm font-bold text-slate-700 cursor-pointer">Mark as Urgent</label>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-3 bg-navy-600 hover:bg-navy-700 text-white font-bold rounded-2xl shadow-xl shadow-navy-900/10 transition-all active:scale-95"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
