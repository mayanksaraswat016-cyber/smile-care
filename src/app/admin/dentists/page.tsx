'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getSupabaseClient } from '@/lib/supabase';
import {
  UserRound,
  Plus,
  Search,
  Trash2,
  Edit2,
  Star,
  CheckCircle2,
  Award,
  Phone,
  Mail,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import AppImage from '@/components/ui/AppImage';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDentists() {
  const { data: dentists, isLoading } = useSWR('/api/dentists', fetcher);

  // Real-time Sync
  useSupabaseRealtime('dentists', '/api/dentists');

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDentist, setEditingDentist] = useState<any>(null);

  const filtered = Array.isArray(dentists)
    ? dentists.filter(
        (d: any) =>
          (d?.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (d?.specialization?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    : [];

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will permanently delete the dentist profile.')) return;
    const res = await fetch(`/api/dentists?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Profile deleted');
      mutate('/api/dentists');
    } else {
      toast.error('Error deleting profile');
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Format JSON fields
    const formattedData = {
      ...data,
      emergency: data.emergency === 'on',
      services_list: (data.services_list as string).split(',').map((s) => s.trim()),
      certifications: (data.certifications as string).split(',').map((s) => s.trim()),
      rating: parseFloat(data.rating as string) || 4.5,
    };

    const url = editingDentist ? `/api/dentists?id=${editingDentist.id}` : '/api/dentists';
    const method = editingDentist ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData),
    });

    if (res.ok) {
      toast.success('Profile saved successfully');
      setIsModalOpen(false);
      setEditingDentist(null);
      mutate('/api/dentists');
    } else {
      const errorData = await res.json();
      toast.error('Error saving profile: ' + errorData.error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-700 mb-1">Dentists</h1>
          <p className="text-slate-500 text-sm">Manage doctor profiles and availability.</p>
        </div>
        <button
          onClick={() => {
            setEditingDentist(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-teal-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add New Dentist
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-card border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search dentists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered?.map((dentist: any) => (
          <div
            key={dentist.id}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-card border border-slate-100 group flex flex-col"
          >
            <div className="relative h-48 bg-slate-100 border-b border-slate-50">
              <AppImage
                src={dentist.profile_photo || 'https://via.placeholder.com/400x300'}
                alt={dentist.full_name}
                fill
                className="object-cover object-top"
              />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
                  {dentist.specialization}
                </span>
                {dentist.emergency && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
                    Emergency
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-navy-700">
                    {dentist.full_name}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {dentist.qualification}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingDentist(dentist);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-xl transition-all active:scale-90"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(dentist.id)}
                    className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all active:scale-90"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Award size={14} className="text-navy-300" />
                  <span>{dentist.experience} Experience</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <CheckCircle2 size={14} className="text-teal-500" />
                  <span className="line-clamp-1">{dentist.services_list?.join(', ')}</span>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex gap-3">
                  <a
                    href={`tel:${dentist.phone}`}
                    className="text-slate-400 hover:text-navy-600 transition-colors"
                  >
                    <Phone size={16} />
                  </a>
                  <a
                    href={dentist.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    <Mail size={16} />
                  </a>
                </div>
                <Link
                  href={`/dentists/${dentist.id}`}
                  className="text-xs font-bold text-teal-600 hover:underline"
                >
                  Public Profile →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dentist Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-navy-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X size={24} />
            </button>

            <form onSubmit={handleSave} className="p-8 lg:p-12 space-y-10">
              <div>
                <h2 className="font-display text-2xl font-bold text-navy-700 mb-2">
                  {editingDentist ? 'Edit Dentist Profile' : 'Add New Dentist'}
                </h2>
                <p className="text-slate-500 text-sm">
                  Fill in all details to create a professional profile.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-4 bg-teal-500 rounded-full" />
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                        Full Name
                      </label>
                      <input
                        name="full_name"
                        defaultValue={editingDentist?.full_name}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                        placeholder="Dr. John Smith"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                        Profile Photo URL
                      </label>
                      <input
                        name="profile_photo"
                        defaultValue={editingDentist?.profile_photo}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                          Qualification
                        </label>
                        <input
                          name="qualification"
                          defaultValue={editingDentist?.qualification}
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                          placeholder="BDS, MDS"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                          Experience
                        </label>
                        <input
                          name="experience"
                          defaultValue={editingDentist?.experience}
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                          placeholder="10+ Years"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                        Specialization
                      </label>
                      <input
                        name="specialization"
                        defaultValue={editingDentist?.specialization}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                        placeholder="Orthodontist"
                      />
                    </div>
                  </div>
                </div>

                {/* About & Services */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-4 bg-teal-500 rounded-full" />
                    Profile Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                        Bio (About)
                      </label>
                      <textarea
                        name="bio"
                        defaultValue={editingDentist?.bio}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm resize-none"
                        placeholder="Short introduction..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                        Services List (Comma separated)
                      </label>
                      <input
                        name="services_list"
                        defaultValue={editingDentist?.services_list?.join(', ')}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                        placeholder="Braces, RCT, Whitening..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                        Certifications (Comma separated)
                      </label>
                      <input
                        name="certifications"
                        defaultValue={editingDentist?.certifications?.join(', ')}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                        placeholder="Certified Implantologist..."
                      />
                    </div>
                  </div>
                </div>

                {/* Availability & Contact */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-4 bg-teal-500 rounded-full" />
                    Availability & Contact
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                          Working Days
                        </label>
                        <input
                          name="working_days"
                          defaultValue={editingDentist?.working_days}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                          placeholder="Mon-Sat"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                          OPD Timings
                        </label>
                        <input
                          name="timings"
                          defaultValue={editingDentist?.timings}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                          placeholder="10 AM - 6 PM"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                          Phone
                        </label>
                        <input
                          name="phone"
                          defaultValue={editingDentist?.phone}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                          placeholder="+91..."
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                          WhatsApp URL
                        </label>
                        <input
                          name="whatsapp"
                          defaultValue={editingDentist?.whatsapp}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                          placeholder="https://wa.me/..."
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-2">
                      <input
                        type="checkbox"
                        name="emergency"
                        id="emergency"
                        defaultChecked={editingDentist?.emergency}
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <label
                        htmlFor="emergency"
                        className="text-sm font-bold text-slate-700 cursor-pointer"
                      >
                        Available for Emergencies
                      </label>
                    </div>
                  </div>
                </div>

                {/* Social & Meta */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-4 bg-teal-500 rounded-full" />
                    Social Proof & Media
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                        University
                      </label>
                      <input
                        name="university"
                        defaultValue={editingDentist?.university}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                        placeholder="AIIMS Delhi"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                        Practo / LinkedIn Profile
                      </label>
                      <input
                        name="linkedin_practo_link"
                        defaultValue={editingDentist?.linkedin_practo_link}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-1">
                        Initial Rating (1.0 - 5.0)
                      </label>
                      <input
                        name="rating"
                        type="number"
                        step="0.1"
                        max="5"
                        min="1"
                        defaultValue={editingDentist?.rating || 4.5}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-all text-sm"
                      />
                    </div>
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
                  {editingDentist ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
