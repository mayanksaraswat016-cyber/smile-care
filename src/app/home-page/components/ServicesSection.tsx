'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  Sparkles,
  Layers,
  Zap,
  Scissors,
  Anchor,
  AlignCenter,
  Smile,
  Gem,
  Crown,
  Circle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { services as staticServices } from '@/data/services';
import { Service } from '@/types';

import useSWR from 'swr';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const categories = [
  'All',
  'Preventive',
  'Cosmetic',
  'Restorative',
  'Orthodontic',
  'Surgical',
  'Emergency',
];

const iconMap: Record<string, any> = {
  Stethoscope,
  Sparkles,
  Layers,
  Zap,
  Scissors,
  Anchor,
  AlignCenter,
  Smile,
  Gem,
  Crown,
  Circle,
  AlertCircle,
};

export default function ServicesSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: services, error, isLoading } = useSWR<Service[]>('/api/services', fetcher);

  // Real-time Sync
  useSupabaseRealtime('services', '/api/services');

  if (error) return <div className="text-center py-20 text-red-500">Failed to load services</div>;
  if (isLoading) return <div className="text-center py-20 text-slate-400">Loading services...</div>;

  const allServices = Array.isArray(services) ? services : [];

  const filteredServices =
    selectedCategory === 'All'
      ? allServices
      : allServices.filter((s) => s.category === selectedCategory);

  const servicesWithIcons = filteredServices.map((service, index) => ({
    ...service,
    icon: iconMap[Object.keys(iconMap)[index % Object.keys(iconMap).length]] || Stethoscope,
  }));

  return (
    <section id="services" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-4 py-1.5 mb-3">
            What We Offer
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-navy-700 mb-4">
            Comprehensive Dental Services
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
            From your first checkup to complete smile transformations — we offer 12+ specialized
            services under one roof, all backed by the latest dental technology.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories?.map((cat) => (
            <button
              key={`cat-filter-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-navy-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-navy-200 hover:text-navy-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {servicesWithIcons?.map((service: Service & { icon: any }) => (
            <div
              key={service?.id}
              className={`relative bg-white rounded-2xl p-5 shadow-card card-hover border ${
                service?.urgent ? 'border-red-200' : 'border-transparent'
              } group`}
            >
              {service?.popular && (
                <span className="absolute -top-2.5 left-4 text-xs font-semibold text-white bg-teal-500 rounded-full px-3 py-0.5">
                  Popular
                </span>
              )}
              {service?.urgent && (
                <span className="absolute -top-2.5 left-4 text-xs font-semibold text-white bg-red-500 rounded-full px-3 py-0.5">
                  24/7 Available
                </span>
              )}

              <div
                className={`w-11 h-11 rounded-xl ${service?.color} flex items-center justify-center mb-4`}
              >
                <service.icon size={20} />
              </div>

              <h3 className="font-display text-base font-semibold text-navy-700 mb-1.5">
                {service?.name}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                {service?.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Duration</p>
                  <p className="text-xs font-semibold text-slate-600">{service?.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-0.5">Starting at</p>
                  <p className="text-sm font-bold text-navy-600">{service?.price}</p>
                </div>
              </div>

              <Link
                href="/appointments-page"
                className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 group-hover:bg-teal-500 group-hover:text-white transition-all duration-200"
              >
                Book This Service
                <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
