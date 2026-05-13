'use client';
import React from 'react';
import { Award, Shield, Clock, BrainCircuit } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    title: 'ISO Certified',
    description: 'International standards of safety and care',
  },
  {
    icon: Award,
    title: '10+ Years Experience',
    description: 'Expert dental care since 2014',
  },
  {
    icon: Clock,
    title: 'Pain-Free Procedures',
    description: 'Advanced sedation and gentle techniques',
  },
  {
    icon: BrainCircuit,
    title: 'Advanced AI Diagnosis',
    description: 'Precision imaging and treatment planning',
  },
];

export default function TrustBadges() {
  return (
    <section className="relative z-10 -mt-10 mb-10 px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl shadow-navy-900/5 border border-slate-100 p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 group hover:translate-y-[-2px] transition-transform duration-300"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                <badge.icon size={24} />
              </div>
              <div>
                <h3 className="text-navy-900 font-bold text-sm md:text-base mb-1">
                  {badge.title}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
