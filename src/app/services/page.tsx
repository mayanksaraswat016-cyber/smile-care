import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import ServicesSection from '@/app/home-page/components/ServicesSection';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <div className="pt-20 lg:pt-24 bg-navy-700 py-16 lg:py-20">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-teal-400 bg-teal-900/30 border border-teal-700/30 rounded-full px-4 py-1.5 mb-4">
              Our Services
            </span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Comprehensive Dental Services
            </h1>
            <p className="text-navy-200 max-w-2xl mx-auto leading-relaxed">
              From your first checkup to complete smile transformations — we offer 12+ specialized
              services under one roof, all backed by the latest dental technology.
            </p>
          </div>
        </div>
        <ServicesSection />
      </main>
      <PublicFooter />
    </div>
  );
}
