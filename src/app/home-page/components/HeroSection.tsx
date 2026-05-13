'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Star, ArrowRight, Play, Shield, Clock, Award } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const heroHighlights = [
  'Same-day emergency appointments',
  'Insurance accepted — 40+ plans',
  'No-wait digital check-in',
];

const trustBadges = [
  { icon: Shield, label: 'HIPAA Compliant' },
  { icon: Award, label: 'ADA Certified' },
  { icon: Clock, label: '24/7 Emergency' },
];

export default function HeroSection() {
  const [reviewCount, setReviewCount] = useState('');
  const { settings } = useSiteSettings();

  useEffect(() => {
    setReviewCount('2,847');
  }, []);

  // Check if hero section should be shown
  if (settings?.show_hero_section === false) {
    return null;
  }

  return (
    <section
      className="relative min-h-screen bg-linear-to-br from-navy-700 via-navy-600 to-navy-800 overflow-hidden pt-16"
      style={{
        backgroundImage: settings?.hero_background_image
          ? `url(${settings.hero_background_image})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-400/5 rounded-full blur-2xl" />
        {/* Dot pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dot-pattern"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>
      <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center min-h-[calc(100vh-64px)] py-16 lg:py-24">
          {/* Left content */}
          <div className="animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-500/15 border border-teal-400/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-teal-300 text-sm font-medium">Now accepting new patients</span>
            </div>

            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-800 text-white leading-tight mb-5">
              {settings?.hero_title || 'Your Healthiest Smile'}{' '}
              <span className="text-teal-400">Starts Here</span>
            </h1>

            <p className="text-lg text-navy-200 leading-relaxed mb-8 max-w-lg">
              {settings?.hero_subtitle ||
                'SmileCare brings together expert dentists, cutting-edge technology, and a genuinely caring team — so every visit feels less like a dental appointment and more like a step toward better health.'}
            </p>

            {/* Highlights */}
            <ul className="space-y-2.5 mb-8">
              {heroHighlights?.map((h) => (
                <li key={`highlight-${h}`} className="flex items-center gap-2.5">
                  <CheckCircle size={18} className="text-teal-400 shrink-0" />
                  <span className="text-sm text-navy-100">{h}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/appointments-page"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-teal-600 to-teal-400 hover:from-teal-500 hover:to-teal-300 text-white font-bold rounded-xl active:scale-95 transition-all duration-300 shadow-xl shadow-teal-500/25 uppercase tracking-wide text-sm"
              >
                {settings?.hero_cta_text || 'Book your transformation'}
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/home-page#services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl active:scale-95 transition-all duration-150"
              >
                <Play size={16} />
                Explore Services
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[
                  'bg-teal-400',
                  'bg-navy-400',
                  'bg-amber-400',
                  'bg-pink-400',
                  'bg-emerald-400',
                ]?.map((c, i) => (
                  <div
                    key={`avatar-${i}`}
                    className={`w-9 h-9 rounded-full ${c} border-2 border-navy-700 flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {['M', 'S', 'R', 'A', 'K']?.[i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1, 2, 3, 4, 5]?.map((s) => (
                    <Star key={`star-${s}`} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-white text-sm font-semibold ml-1">4.9</span>
                </div>
                <p className="text-navy-300 text-xs">
                  Trusted by {reviewCount || '2,847'} patients
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {trustBadges?.map(({ icon: Icon, label }) => (
                <div
                  key={`badge-${label}`}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 hover:bg-white/15 transition-colors"
                >
                  <Icon size={16} className="text-teal-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Main hero image placeholder */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <AppImage
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_1eb497fb6-1772185178074.png"
                  alt="Friendly dentist in white coat smiling at patient in modern dental clinic"
                  width={700}
                  height={800}
                  priority
                  className="w-full object-cover h-[520px] xl:h-[580px]"
                />

                <div className="absolute inset-0 bg-linear-to-t from-navy-800/40 to-transparent" />
              </div>

              {/* Floating card — next available */}
              <div className="absolute -left-8 top-16 bg-white rounded-2xl shadow-card-hover p-4 w-52 animate-slide-up">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                    <Clock size={16} className="text-teal-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Next Available
                  </span>
                </div>
                <p className="text-sm font-bold text-navy-700">Today at 3:30 PM</p>
                <p className="text-xs text-slate-500">Dr. Priya Sharma · General</p>
                <Link
                  href="/appointments-page"
                  className="mt-2 w-full block text-center text-xs font-semibold text-white bg-navy-600 rounded-lg py-1.5 hover:bg-navy-700 transition-colors"
                >
                  Grab this slot →
                </Link>
              </div>

              {/* Floating card — rating */}
              <div className="absolute -right-6 bottom-20 bg-white rounded-2xl shadow-card-hover p-4 w-48">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5]?.map((s) => (
                    <Star
                      key={`float-star-${s}`}
                      size={12}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "Best dental experience I&apos;ve ever had. Zero anxiety!"
                </p>
                <p className="text-xs font-semibold text-navy-600 mt-1.5">— Aaliya R.</p>
              </div>

              {/* Floating card — today's appointments */}
              <div className="absolute right-4 top-8 bg-navy-600 rounded-2xl p-3 w-36 text-white">
                <p className="text-xs text-navy-300 mb-1">Patients today</p>
                <p className="text-2xl font-bold tabular-nums">24</p>
                <p className="text-xs text-teal-400 font-medium mt-0.5">↑ 3 vs yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80L1440 80L1440 40C1200 0 960 80 720 60C480 40 240 0 0 40L0 80Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
