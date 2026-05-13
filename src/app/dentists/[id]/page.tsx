'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  Clock,
  ArrowLeft,
  Stethoscope,
  Phone,
  ArrowRight,
  Star,
  CheckCircle2,
  MessageSquare,
  Award,
  School,
  Video,
  Share2,
  Calendar,
} from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { Dentist } from '@/types';
import useSWR from 'swr';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DentistProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: dentist,
    error,
    isLoading,
  } = useSWR<Dentist>(id ? `/api/dentists/${id}` : null, fetcher);

  if (error)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-500">
        Failed to load dentist profile
      </div>
    );
  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">
        Loading profile...
      </div>
    );

  if (!dentist) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Dentist not found</p>
          <Link href="/home-page#team" className="text-teal-600 hover:text-teal-700 font-medium">
            ← Back to Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />

      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative bg-navy-700 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-500/10 skew-x-12 transform translate-x-20" />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 relative">
            <Link
              href="/home-page#team"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Our Team</span>
            </Link>

            <div className="flex flex-col lg:row lg:flex-row gap-12 items-center lg:items-start">
              {/* Profile Photo */}
              <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0 border-4 border-white/10">
                <AppImage
                  src={dentist.profile_photo}
                  alt={dentist.full_name}
                  fill
                  sizes="320px"
                  className="object-cover object-top"
                />
                {dentist.emergency && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shadow-lg">
                    Emergency Available
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4">
                  <span className="bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {dentist.specialization}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    <Star size={12} className="fill-amber-300" />
                    {dentist.rating} / 5.0
                  </div>
                </div>

                <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-3">
                  {dentist.full_name}
                </h1>
                <p className="text-teal-400 text-xl lg:text-2xl font-medium mb-6">
                  {dentist.qualification}
                </p>

                <p className="text-navy-100 text-lg leading-relaxed max-w-2xl mb-8 opacity-90">
                  {dentist.bio}
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link
                    href="/appointments-page"
                    className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-2xl shadow-xl shadow-teal-500/20 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Calendar size={20} />
                    Book Appointment
                  </Link>
                  <a
                    href={dentist.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition-all flex items-center gap-2"
                  >
                    <MessageSquare size={20} />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs/Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Services List */}
              <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-card border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <Stethoscope size={24} />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-navy-700">
                    Services & Treatments
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {Array.isArray(dentist.services_list) &&
                    dentist.services_list.map((service, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-5 py-3 bg-slate-50 text-navy-600 rounded-2xl font-semibold border border-slate-100 hover:border-teal-200 hover:bg-teal-50 transition-all"
                      >
                        <CheckCircle2 size={16} className="text-teal-500" />
                        {service}
                      </div>
                    ))}
                </div>
              </section>

              {/* Education & Certs */}
              <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-card border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center text-navy-600">
                    <School size={24} />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-navy-700">
                    Education & Background
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <Award size={20} className="text-navy-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Degree
                        </p>
                        <p className="text-navy-700 font-bold">{dentist.degree}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <GraduationCap size={20} className="text-navy-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          University
                        </p>
                        <p className="text-navy-700 font-bold">{dentist.university}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Certifications
                    </p>
                    <div className="space-y-3">
                      {Array.isArray(dentist.certifications) &&
                        dentist.certifications.map((cert, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-navy-600 font-medium"
                          >
                            <CheckCircle2 size={14} className="text-teal-500" />
                            {cert}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Reviews */}
              <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-card border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <Star size={24} className="fill-amber-600" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-navy-700">
                      Patient Feedback
                    </h2>
                  </div>
                  <a
                    href={dentist.google_reviews_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-teal-600 hover:underline"
                  >
                    View on Google →
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.isArray(dentist.reviews) &&
                    dentist.reviews.map((review, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-navy-600 text-sm leading-relaxed mb-4 italic">
                          "{review.feedback}"
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-navy-700">{review.patient}</p>
                          <p className="text-xs text-slate-400">{review.date}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </section>

              {/* Media: Before/After */}
              {Array.isArray(dentist.before_after_images) &&
                dentist.before_after_images.length > 0 && (
                  <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-card border border-slate-100">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Share2 size={24} />
                      </div>
                      <h2 className="font-display text-2xl font-bold text-navy-700">
                        Smile Transformations
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {dentist.before_after_images.map((img, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group"
                        >
                          <AppImage
                            src={img}
                            alt={`Smile Transformation ${i + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}
            </div>

            {/* Right Column: Availability & Contact */}
            <div className="space-y-8">
              {/* Availability Card */}
              <div className="bg-navy-700 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

                <h3 className="font-display text-xl font-bold mb-8 flex items-center gap-3">
                  <Clock size={22} className="text-teal-400" />
                  Clinic Timings
                </h3>

                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-navy-200">Working Days</span>
                    <span className="font-bold">{dentist.working_days}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-navy-200">OPD Timing</span>
                    <span className="font-bold text-teal-400">{dentist.timings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-navy-200">Emergency</span>
                    <span
                      className={`font-bold ${dentist.emergency ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {dentist.emergency ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <Link
                  href="/appointments-page"
                  className="mt-10 w-full py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-2xl shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight size={20} />
                  Book Now
                </Link>
              </div>

              {/* Video Intro */}
              {dentist.video_intro && (
                <div className="bg-white rounded-[2.5rem] p-6 shadow-card border border-slate-100 overflow-hidden group">
                  <a
                    href={dentist.video_intro}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-video rounded-2xl overflow-hidden bg-slate-900"
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-navy-900/40 group-hover:bg-navy-900/20 transition-all z-10">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
                        <Video size={32} className="text-teal-600 fill-teal-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 z-20">
                      <p className="text-white text-xs font-bold uppercase tracking-wider">
                        Watch Intro Video
                      </p>
                    </div>
                  </a>
                </div>
              )}

              {/* Quick Contact */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-slate-100">
                <h3 className="font-display text-xl font-bold text-navy-700 mb-6">Quick Contact</h3>
                <div className="space-y-4">
                  <a
                    href={`tel:${dentist.phone}`}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
                  >
                    <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center text-navy-600">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Phone
                      </p>
                      <p className="text-sm font-bold text-navy-700">{dentist.phone}</p>
                    </div>
                  </a>
                  <a
                    href={dentist.linkedin_practo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
                  >
                    <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center text-navy-600">
                      <Share2 size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Professional Profile
                      </p>
                      <p className="text-sm font-bold text-navy-700">Practo / LinkedIn</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
