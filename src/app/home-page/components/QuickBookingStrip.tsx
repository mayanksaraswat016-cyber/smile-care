'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Service } from '@/types';

import useSWR from 'swr';

type QuickBookForm = {
  patient_name: string;
  phone: string;
  service_id: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function QuickBookingStrip() {
  const [submitted, setSubmitted] = useState(false);
  const { data: services } = useSWR<Service[]>('/api/services', fetcher);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuickBookForm>();

  const onSubmit = async (data: QuickBookForm) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          email: 'quick-request@example.com', // Placeholder for quick request
          appointment_date: new Date().toISOString().split('T')[0],
          appointment_time: 'ASAP',
          status: 'pending',
          message: 'Quick Callback Request',
        }),
      });

      if (!res.ok) throw new Error('Failed to send request');

      setSubmitted(true);
      toast.success("Request received! We'll call you within 30 minutes to confirm.");
    } catch (error) {
      toast.error('Failed to send request. Please try again.');
    }
  };

  return (
    <section className="py-16 bg-linear-to-r from-teal-600 to-teal-500">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        {submitted ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-4">
              <CheckCircle size={28} className="text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">Request Received!</h3>
            <p className="text-teal-100">
              Our team will call you within 30 minutes to confirm your appointment.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="shrink-0 text-center lg:text-left">
              <p className="text-teal-100 text-sm font-medium uppercase tracking-widest mb-1">
                Quick Request
              </p>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-white">
                Book in Under 60 Seconds
              </h2>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col sm:flex-row gap-3 flex-1 w-full"
            >
              <div className="flex-1">
                <input
                  {...register('patient_name', { required: 'Your name is required' })}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-white/15 border ${
                    errors.patient_name ? 'border-red-300' : 'border-white/20'
                  } text-white placeholder-teal-200 focus:outline-none focus:border-white focus:bg-white/20 transition-all`}
                />
                {errors.patient_name && (
                  <p className="text-red-200 text-xs mt-1">{errors.patient_name.message}</p>
                )}
              </div>

              <div className="flex-1">
                <input
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?[\d\s\-()]{10,}$/,
                      message: 'Enter a valid phone number',
                    },
                  })}
                  placeholder="Phone number"
                  type="tel"
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-white/15 border ${
                    errors.phone ? 'border-red-300' : 'border-white/20'
                  } text-white placeholder-teal-200 focus:outline-none focus:border-white focus:bg-white/20 transition-all`}
                />
                {errors.phone && (
                  <p className="text-red-200 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex-1">
                <select
                  {...register('service_id', { required: 'Please select a service' })}
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-white/15 border ${
                    errors.service_id ? 'border-red-300' : 'border-white/20'
                  } text-white focus:outline-none focus:border-white focus:bg-white/20 transition-all`}
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-teal-700">
                    Select a service
                  </option>
                  {Array.isArray(services) &&
                    services.map((s) => (
                      <option key={`qs-${s.id}`} value={s.id} className="bg-teal-700">
                        {s.name}
                      </option>
                    ))}
                </select>
                {errors.service_id && (
                  <p className="text-red-200 text-xs mt-1">{errors.service_id.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="shrink-0 flex items-center justify-center gap-2 px-8 py-3 bg-white text-teal-600 hover:bg-teal-50 disabled:opacity-70 font-bold rounded-xl active:scale-95 transition-all duration-300 shadow-xl shadow-teal-900/20 min-w-[160px] uppercase tracking-wider text-sm"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    Request Callback
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
