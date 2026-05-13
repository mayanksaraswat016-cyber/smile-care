'use client';
import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

const testimonials = [
  {
    id: 'review-1',
    name: 'Sarah Johnson',
    role: 'Patient since 2022',
    avatar: '/patient_avatar_1.png',
    avatarAlt: 'Sarah Johnson smiling confidently',
    rating: 5,
    service: 'Root Canal',
    text: 'The most painless root canal I have ever experienced. The staff at SmileCare is incredibly professional and the facility is state-of-the-art. Highly recommended for anyone with dental anxiety!',
    date: 'March 2026',
  },
  {
    id: 'review-2',
    name: 'Michael Chen',
    role: 'Patient since 2023',
    avatar: '/patient_avatar_2.png',
    avatarAlt: 'Michael Chen smiling warmly',
    rating: 5,
    service: 'Dental Implants',
    text: 'Dr. Sharma is a genius. I got two implants done and the results are life-changing. The digital planning they use ensured everything went perfectly. Worth every rupee!',
    date: 'January 2026',
  },
  {
    id: 'review-3',
    name: 'Emily Davis',
    role: 'Patient since 2024',
    avatar: '/patient_avatar_3.png',
    avatarAlt: 'Emily Davis with a bright smile',
    rating: 5,
    service: 'Teeth Whitening',
    text: 'Amazing experience! The whitening treatment took less than an hour and the results were immediate. I feel so much more confident now. The team is so friendly!',
    date: 'April 2026',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials?.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials?.length - 1 ? 0 : c + 1));

  const visible = [
    testimonials?.[current],
    testimonials?.[(current + 1) % testimonials?.length],
    testimonials?.[(current + 2) % testimonials?.length],
  ];

  return (
    <section className="py-20 lg:py-28 bg-navy-700 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-teal-400 bg-teal-400/10 border border-teal-400/20 rounded-full px-4 py-1.5 mb-3">
              Patient Stories
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
              Real Results, Real People
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-xl bg-teal-500 hover:bg-teal-400 flex items-center justify-center text-white transition-all active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible?.map((t, i) => (
            <div
              key={`${t?.id}-${i}`}
              className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 ${
                i === 0 ? 'opacity-100' : i === 1 ? 'opacity-90' : 'opacity-75 hidden lg:block'
              }`}
            >
              <Quote size={24} className="text-teal-400 mb-4 opacity-60" />

              <p className="text-navy-100 text-sm leading-relaxed mb-5">{t?.text}</p>

              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5]?.map((s) => (
                  <Star
                    key={`${t?.id}-star-${s}`}
                    size={13}
                    className={s <= t?.rating ? 'text-amber-400 fill-amber-400' : 'text-navy-500'}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AppImage
                    src={t?.avatar}
                    alt={t?.avatarAlt}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border-2 border-teal-400/30"
                  />

                  <div>
                    <p className="text-white text-sm font-semibold">{t?.name}</p>
                    <p className="text-navy-400 text-xs">{t?.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-teal-400 bg-teal-400/10 px-2 py-1 rounded-full">
                    {t?.service}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials?.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${
                i === current ? 'w-6 h-2 bg-teal-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
