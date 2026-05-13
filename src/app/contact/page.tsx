import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import ContactSection from '@/app/home-page/components/ContactSection';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <div className="pt-20 lg:pt-24 bg-navy-700 py-16 lg:py-20">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-teal-400 bg-teal-900/30 border border-teal-700/30 rounded-full px-4 py-1.5 mb-4">
              Get in Touch
            </span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              We&apos;re Here When You Need Us
            </h1>
            <p className="text-navy-200 max-w-2xl mx-auto leading-relaxed">
              Have a question or need to schedule an appointment? Our friendly team is ready to help
              you with anything you need.
            </p>
          </div>
        </div>
        <ContactSection />
      </main>
      <PublicFooter />
    </div>
  );
}
