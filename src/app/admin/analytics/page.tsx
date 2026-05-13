'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { PageSkeleton, KpiSkeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = useSWR('/api/analytics', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-10 bg-slate-200 rounded-2xl w-64 animate-pulse"></div>
        <KpiSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const kpis = analytics?.kpis || {};
  const treatmentRevenue = analytics?.treatmentRevenue || [];
  const doctorPerformance = analytics?.doctorPerformance || [];
  const paymentStatus = analytics?.paymentStatus || { paid: 0, pending: 0, overdue: 0 };

  const paymentData = [
    { name: 'Paid', value: paymentStatus.paid, color: '#10b981' },
    { name: 'Pending', value: paymentStatus.pending, color: '#f59e0b' },
    { name: 'Overdue', value: paymentStatus.overdue, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-navy-700 mb-1">Revenue Analytics</h1>
        <p className="text-slate-500 text-sm">Track clinic performance and financial metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-card border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <DollarSign size={24} className="text-emerald-600" />
            </div>
            <ArrowUpRight size={18} className="text-emerald-500" />
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-navy-700">
            ₹{kpis.totalRevenue?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-card border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <ArrowUpRight size={18} className="text-blue-500" />
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Appointments</p>
          <p className="text-3xl font-bold text-navy-700">{kpis.totalAppointments || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-card border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <DollarSign size={24} className="text-amber-600" />
            </div>
            <ArrowDownRight size={18} className="text-amber-500" />
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Pending Payments</p>
          <p className="text-3xl font-bold text-amber-600">
            ₹{kpis.pendingPayments?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-card border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
              <Calendar size={24} className="text-purple-600" />
            </div>
            <TrendingUp size={18} className="text-purple-500" />
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Utilization Rate</p>
          <p className="text-3xl font-bold text-navy-700">{kpis.utilizationRate || 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Treatment Revenue Breakdown */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-slate-100">
          <h2 className="font-display text-xl font-bold text-navy-700 mb-6">
            Revenue by Treatment
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={treatmentRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="treatment" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-slate-100">
          <h2 className="font-display text-xl font-bold text-navy-700 mb-6">Payment Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Doctor Performance */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-slate-100 lg:col-span-2">
          <h2 className="font-display text-xl font-bold text-navy-700 mb-6">Doctor Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={doctorPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="doctor_name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="appointments"
                fill="#10b981"
                name="Appointments"
                radius={[8, 8, 0, 0]}
              />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₹)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
