'use client';
import React, { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import {
  Calendar,
  MessageSquare,
  UserRound,
  Stethoscope,
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Users,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { PageSkeleton, KpiSkeleton, TableSkeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  const { data: appointments, isLoading: appointmentsLoading } = useSWR(
    '/api/appointments',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 30000,
    }
  );

  const { data: queries, isLoading: queriesLoading } = useSWR('/api/queries', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 30000,
  });

  const { data: dentists, isLoading: dentistsLoading } = useSWR('/api/dentists', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 30000,
  });

  const { data: services, isLoading: servicesLoading } = useSWR('/api/services', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 30000,
  });

  // Real-time Sync for all tables
  useSupabaseRealtime('appointments', '/api/appointments');
  useSupabaseRealtime('queries', '/api/queries');
  useSupabaseRealtime('dentists', '/api/dentists');
  useSupabaseRealtime('services', '/api/services');

  const isLoading = appointmentsLoading || queriesLoading || dentistsLoading || servicesLoading;

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div>
          <div className="h-10 bg-slate-200 rounded-2xl w-64 animate-pulse"></div>
          <div className="h-5 bg-slate-200 rounded-xl w-96 mt-2 animate-pulse"></div>
        </div>
        <KpiSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TableSkeleton rows={5} />
          </div>
          <div className="h-96 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Appointments',
      value:
        appointments?.pagination?.total ||
        appointments?.data?.length ||
        (Array.isArray(appointments) ? appointments.length : 0),
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600',
      trend: '+12% this week',
    },
    {
      name: 'Pending Queries',
      value: Array.isArray(queries) ? queries.filter((q: any) => q.status === 'unread').length : 0,
      icon: MessageSquare,
      color: 'bg-amber-50 text-amber-600',
      trend: '2 new today',
    },
    {
      name: 'Active Dentists',
      value: Array.isArray(dentists) ? dentists.length : 0,
      icon: Users,
      color: 'bg-teal-50 text-teal-600',
      trend: 'Full team active',
    },
    {
      name: 'Services Offered',
      value: Array.isArray(services) ? services.length : 0,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      trend: 'Top performing',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-navy-700 mb-2">Welcome Back, Admin</h1>
        <p className="text-slate-500 text-sm">Here's what's happening with your clinic today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-[2rem] shadow-card border border-slate-100 group hover:border-teal-200 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}
              >
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1">{stat.name}</p>
            <p className="text-3xl font-bold text-navy-700">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-card border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h2 className="font-display text-xl font-bold text-navy-700">Recent Appointments</h2>
            </div>
            <Link
              href="/admin/appointments"
              className="text-sm font-bold text-teal-600 hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Patient</th>
                  <th className="px-8 py-4">Service</th>
                  <th className="px-8 py-4">Date & Time</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {Array.isArray(appointments?.data || appointments) &&
                  (appointments?.data || appointments).slice(0, 5).map((app: any) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-navy-700">{app.patient_name}</p>
                        <p className="text-xs text-slate-400">{app.email}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-semibold text-navy-600 bg-navy-50 px-2 py-1 rounded-lg">
                          {app.services?.name || 'Consultation'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-semibold text-slate-700">
                          {app.appointment_date}
                        </p>
                        <p className="text-xs text-slate-400">{app.appointment_time}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                            app.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                {(!Array.isArray(appointments?.data || appointments) ||
                  (appointments?.data || appointments).length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Queries */}
        <div className="bg-white rounded-[2.5rem] shadow-card border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <h2 className="font-display text-xl font-bold text-navy-700">New Queries</h2>
            </div>
          </div>
          <div className="flex-1 p-6 space-y-4">
            {Array.isArray(queries) &&
              queries
                .filter((q: any) => q.status === 'unread')
                .slice(0, 4)
                .map((query: any) => (
                  <Link
                    key={query.id}
                    href="/admin/queries"
                    className="block p-4 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-transparent hover:border-teal-100 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-bold text-navy-700">{query.name}</p>
                      <ArrowUpRight
                        size={14}
                        className="text-slate-300 group-hover:text-teal-500"
                      />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mb-2">{query.subject}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                      "{query.message}"
                    </p>
                  </Link>
                ))}
            {(!Array.isArray(queries) ||
              queries.filter((q: any) => q.status === 'unread').length === 0) && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <p className="text-sm text-slate-400">All caught up!</p>
              </div>
            )}
          </div>

          <div className="p-6 mt-auto">
            <Link
              href="/admin/queries"
              className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-navy-600 font-bold rounded-xl text-center text-sm transition-all block"
            >
              Manage Queries
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
