'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getSupabaseClient } from '@/lib/supabase';
import {
  Calendar,
  Clock,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, startOfWeek } from 'date-fns';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminSlots() {
  const { data: dentists, isLoading: dentistsLoading } = useSWR('/api/dentists', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  const { data: slots } = useSWR(
    selectedDoctor ? `/api/slots?doctor_id=${selectedDoctor}&date=${selectedDate}` : null,
    fetcher
  );

  // Auto-refresh slots in real-time
  useSupabaseRealtime(
    'doctor_slots',
    selectedDoctor ? `/api/slots?doctor_id=${selectedDoctor}&date=${selectedDate}` : null
  );

  if (dentistsLoading) {
    return <PageSkeleton />;
  }

  const weekStart = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleGenerateSlots = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          doctor_id: selectedDoctor,
          date: selectedDate,
          slot_duration: parseInt(data.slot_duration as string),
          buffer_time: parseInt(data.buffer_time as string),
        }),
      });

      if (res.ok) {
        const slotsData = await res.json();
        toast.success(`${slotsData.length} slots generated`);
        setIsGenerateOpen(false);
        mutate(`/api/slots?doctor_id=${selectedDoctor}&date=${selectedDate}`);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
    } catch (err: any) {
      toast.error('Failed to generate slots: ' + err.message);
    }
  };

  const clearSlots = async () => {
    if (!confirm('Are you sure you want to delete all slots for this day?')) return;
    try {
      const res = await fetch(`/api/slots?doctor_id=${selectedDoctor}&date=${selectedDate}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('All slots deleted');
        mutate(`/api/slots?doctor_id=${selectedDoctor}&date=${selectedDate}`);
      } else {
        toast.error('Failed to delete slots');
      }
    } catch (err: any) {
      toast.error('Error deleting slots');
    }
  };

  const toggleSlotAvailability = async (slotId: string, current: boolean) => {
    const res = await fetch(`/api/slots?id=${slotId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availability: !current }),
    });

    if (res.ok) {
      toast.success(current ? 'Slot blocked' : 'Slot opened');
      mutate(`/api/slots?doctor_id=${selectedDoctor}&date=${selectedDate}`);
    } else {
      toast.error('Failed to update slot');
    }
  };

  const selectedDentist = Array.isArray(dentists)
    ? dentists.find((d: any) => d.id === selectedDoctor)
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-700 mb-1">Slot Management</h1>
          <p className="text-slate-500 text-sm">Generate and manage doctor time slots.</p>
        </div>
        <button
          onClick={() => {
            if (!selectedDoctor) {
              toast.error('Select a doctor first');
              return;
            }
            setIsGenerateOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-teal-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add New Slots
        </button>
        {Array.isArray(slots) && slots.length > 0 && (
          <button
            onClick={clearSlots}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-2xl transition-all active:scale-95 border border-red-100"
          >
            <Trash2 size={20} />
            Delete All
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-card border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
            Select Doctor
          </label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
          >
            <option value="">Choose a dentist...</option>
            {Array.isArray(dentists) &&
              dentists.map((d: any) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.full_name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
          />
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedDate(format(addDays(new Date(selectedDate), -7), 'yyyy-MM-dd'))}
          className="p-2 bg-white rounded-xl border border-slate-100 hover:border-teal-300 transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2 overflow-x-auto">
          {weekDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isActive = dateStr === selectedDate;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex flex-col items-center px-4 py-3 rounded-2xl transition-all min-w-[70px] ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                    : 'bg-white border border-slate-100 hover:border-teal-200'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{format(day, 'EEE')}</span>
                <span className="text-lg font-bold">{format(day, 'd')}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setSelectedDate(format(addDays(new Date(selectedDate), 7), 'yyyy-MM-dd'))}
          className="p-2 bg-white rounded-xl border border-slate-100 hover:border-teal-300 transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Slots Grid */}
      {selectedDoctor ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.isArray(slots) && slots.length > 0 ? (
            slots.map((slot: any) => (
              <button
                key={slot.id}
                onClick={() => toggleSlotAvailability(slot.id, slot.availability)}
                className={`p-4 rounded-2xl border-2 transition-all text-center ${
                  slot.availability
                    ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
                    : 'bg-red-50 border-red-200 hover:border-red-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock
                    size={14}
                    className={slot.availability ? 'text-emerald-600' : 'text-red-500'}
                  />
                  <span
                    className={`text-sm font-bold ${slot.availability ? 'text-emerald-700' : 'text-red-700'}`}
                  >
                    {slot.start_time}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${slot.availability ? 'text-emerald-500' : 'text-red-500'}`}
                >
                  {slot.availability ? 'Available' : 'Booked'}
                </span>
              </button>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-semibold">No slots for this date</p>
              <p className="text-sm">Click &quot;Generate Slots&quot; to create time slots</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-semibold">Select a doctor to view slots</p>
        </div>
      )}

      {/* Generate Slots Modal */}
      {isGenerateOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-navy-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative">
            <button
              onClick={() => setIsGenerateOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
            <form onSubmit={handleGenerateSlots} className="p-8 lg:p-10 space-y-6">
              <h2 className="font-display text-2xl font-bold text-navy-700">Generate Slots</h2>
              <p className="text-slate-500 text-sm">
                For Dr. {selectedDentist?.full_name} on {selectedDate}
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                      Start Time
                    </label>
                    <input
                      name="work_start_time"
                      type="time"
                      defaultValue="09:00"
                      required
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                      End Time
                    </label>
                    <input
                      name="work_end_time"
                      type="time"
                      defaultValue="18:00"
                      required
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                      Slot Duration (min)
                    </label>
                    <input
                      name="slot_duration"
                      type="number"
                      defaultValue={30}
                      min={10}
                      max={120}
                      required
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                      Buffer Time (min)
                    </label>
                    <input
                      name="buffer_time"
                      type="number"
                      defaultValue={5}
                      min={0}
                      max={30}
                      required
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGenerateOpen(false)}
                  className="px-6 py-3 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 bg-teal-500 text-white font-bold rounded-2xl shadow-xl shadow-teal-500/20 flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
