'use client';
import React from 'react';
import AppImage from '@/components/ui/AppImage';
import { ArrowRight } from 'lucide-react';

const transformations = [
  {
    title: 'Full Smile Alignment',
    treatment: 'Orthodontics (Braces)',
    image: '/smile_transformation_before_after.png',
  },
  {
    title: 'Teeth Whitening',
    treatment: 'Professional Whitening',
    image: '/smile_whitening_before_after.png',
  },
  {
    title: 'Dental Restoration',
    treatment: 'Implants & Crowns',
    image: '/braces_before_after.png',
  },
];

export default function SmileTransformation() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="text-center mb-16">
          <h2 className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-3">
            Real Results
          </h2>
          <h3 className="text-4xl md:text-5xl font-display font-800 text-navy-900 mb-6">
            Smile Transformation Gallery
          </h3>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Witness the life-changing results our patients achieve through personalized treatment plans and advanced dental technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transformations.map((item, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <AppImage
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-8">
                <p className="text-teal-600 font-bold text-sm mb-2">{item.treatment}</p>
                <h4 className="text-2xl font-bold text-navy-900 mb-4">{item.title}</h4>
                <div className="flex items-center gap-2 text-navy-600 font-semibold group/link cursor-pointer">
                  <span>View Case Study</span>
                  <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
