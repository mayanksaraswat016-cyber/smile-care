'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getSupabaseClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/ui/skeleton';
import {
  Calendar, Search, Filter,
  MoreVertical, CheckCircle2, XCircle,
  Trash2, Mail, Phone, Clock, Plus, X
} from 'lucide-react';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminAppointments() {
  const { data: response, isLoading } = useSWR('/api/appointments?limit=100', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 30000,
  });
  const appointments = response?.data || [];
  const { data: dentists } = useSWR('/api/dentists', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const { data: services } = useSWR('/api/services', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Real-time Sync
  useSupabaseRealtime('appointments', '/api/appointments?limit=100');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <TableSkeleton rows={10} />;
  }

  const filtered = Array.isArray(appointments) ? appointments.filter((app: any) => {
    const matchesSearch = (app?.patient_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                         (app?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success('Appointment added successfully');
      setIsModalOpen(false);
      mutate('/api/appointments');
    } else {
      const errorData = await res.json();
      toast.error('Error: ' + errorData.error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/appointments?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      toast.success(`Appointment ${status}`);
      mutate('/api/appointments');
    } else {
      toast.error('Failed to update status');
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    const res = await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Appointment deleted');
      mutate('/api/appointments');
    } else {
      toast.error('Failed to delete appointment');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-700 mb-1">Appointments</h1>
          <p className="text-slate-500 text-sm">Manage patient bookings and schedules.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-navy-600 hover:bg-navy-700 text-white font-bold rounded-2xl shadow-xl shadow-navy-100 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl shadow-card border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400 ml-2" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-transparent rounded-2xl px-4 py-2.5 text-sm font-semibold text-navy-700 focus:bg-white focus:border-teal-500 outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-card border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Patient Details</th>
                <th className="px-8 py-5">Treatment & Doctor</th>
                <th className="px-8 py-5">Date & Time</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered?.map((app: any) => (
                <tr key={app.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-navy-700 mb-1">{app.patient_name}</p>
                    <div className="flex flex-col gap-1">
                      <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-600 transition-colors">
                        <Mail size={12} /> {app.email}
                      </a>
                      <a href={`tel:${app.phone}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-600 transition-colors">
                        <Phone size={12} /> {app.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-semibold text-navy-600 mb-1">{app.services?.name || 'General Checkup'}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      Dr. {app.dentists?.full_name || 'TBD'}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1">
                      <Calendar size={14} className="text-teal-500" />
                      {app.appointment_date}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                      <Clock size={14} />
                      {app.appointment_time}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 
                      app.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                      app.status === 'completed' ? 'bg-blue-50 text-blue-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {app.status === 'pending' && (
                        <button 
                          onClick={() => updateStatus(app.id, 'confirmed')}
                          className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                          title="Confirm"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      )}
                      {app.status !== 'cancelled' && app.status !== 'completed' && (
                        <button 
                          onClick={() => updateStatus(app.id, 'cancelled')}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                          title="Cancel"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteAppointment(app.id)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all active:scale-90"
                        title="Delete Appointment"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400">Loading appointments...</td>
                </tr>
              )}
              {!isLoading && !filtered?.length && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400">No appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-navy-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-xl transition-all">
              <X size={24} />
            </button>
            <form onSubmit={handleSave} className="p-8 lg:p-10 space-y-6">
              <h2 className="font-display text-2xl font-bold text-navy-700">Add New Appointment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Patient Name</label>
                  <input name="patient_name" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Email</label>
                  <input name="email" type="email" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Phone</label>
                  <input name="phone" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm" placeholder="+91..." />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Date</label>
                  <input name="appointment_date" type="date" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Time</label>
                  <input name="appointment_time" type="time" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Service</label>
                  <select name="service_id" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm appearance-none">
                    <option value="">Select Service</option>
                    {Array.isArray(services) && services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Dentist</label>
                  <select name="dentist_id" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm appearance-none">
                    <option value="">Select Dentist</option>
                    {Array.isArray(dentists) && dentists.map((d: any) => <option key={d.id} value={d.id}>{d.full_name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-600 font-bold">Cancel</button>
                <button type="submit" className="px-10 py-3 bg-navy-600 text-white font-bold rounded-2xl shadow-xl shadow-navy-100">Save Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
