'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR, { mutate } from 'swr';
import {
  Calendar, Clock, User, Phone, Mail,
  Stethoscope, UserRound, ArrowLeft, CheckCircle2,
  CalendarDays, ChevronRight, Info, Sparkles,
  ShieldCheck, Zap, ArrowRight, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { Service, Dentist } from '@/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

type AppointmentForm = {
  patient_name: string;
  email: string;
  phone: string;
  service_id: string;
  dentist_id: string;
  appointment_date: string;
  appointment_time: string;
  message: string;
};

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
];

export default function AppointmentsPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const { data: services } = useSWR<Service[]>('/api/services', fetcher);
  const { data: dentists } = useSWR<Dentist[]>('/api/dentists', fetcher);

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors, isSubmitting } } = useForm<AppointmentForm>({
    defaultValues: {
      appointment_date: new Date().toISOString().split('T')[0]
    }
  });

  const selectedServiceId = watch('service_id');
  const selectedDentistId = watch('dentist_id');
  const selectedDate = watch('appointment_date');
  const selectedTime = watch('appointment_time');

  // Fetch real slots for the selected dentist and date
  const { data: fetchedSlots } = useSWR(
    selectedDentistId && selectedDate 
      ? `/api/slots?doctor_id=${selectedDentistId}&date=${selectedDate}` 
      : null,
    fetcher
  );

  const selectedService = Array.isArray(services) ? services.find(s => s.id === selectedServiceId) : null;
  const selectedDentist = Array.isArray(dentists) ? dentists.find(d => d.id === selectedDentistId) : null;

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['patient_name', 'email', 'phone'];
    if (step === 2) fieldsToValidate = ['service_id', 'dentist_id'];
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = async (data: AppointmentForm) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Failed to book appointment');

      setSubmitted(true);
      toast.success('Your smile is scheduled!');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <PublicHeader />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-10 lg:p-16 shadow-2xl text-center border border-teal-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-navy-600" />
            <div className="w-24 h-24 bg-teal-50 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 size={48} className="text-teal-600" />
            </div>
            <h1 className="font-display text-4xl font-bold text-navy-800 mb-4">You're All Set!</h1>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed">
              We've received your booking, <span className="font-bold text-navy-700">{watch('patient_name')}</span>. 
              Our team will review the details for your <span className="text-teal-600 font-semibold">{selectedService?.name}</span> and confirm via email.
            </p>
            
            <div className="bg-slate-50 rounded-3xl p-8 mb-10 text-left grid grid-cols-2 gap-6 border border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                <p className="font-bold text-navy-700">{selectedDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</p>
                <p className="font-bold text-navy-700">{selectedTime}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Provider</p>
                <p className="font-bold text-navy-700">Dr. {selectedDentist?.full_name}</p>
              </div>
            </div>

            <Link
              href="/home-page"
              className="inline-flex items-center gap-3 px-10 py-4 bg-navy-600 hover:bg-navy-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-navy-100 active:scale-95"
            >
              Back to Home
              <ArrowRight size={20} />
            </Link>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicHeader />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header & Progress */}
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-600 border border-teal-100 mb-6 animate-fade-in">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Seamless Booking</span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-navy-800 mb-6">Let's Schedule Your Visit</h1>
            
            {/* Progress Bar */}
            <div className="relative flex justify-between items-center max-w-md mx-auto mt-12">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-teal-500 -translate-y-1/2 z-0 transition-all duration-500" 
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
              
              {[1, 2, 3].map((num) => (
                <div key={num} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4 ${
                    step >= num ? 'bg-teal-500 border-teal-100 text-white' : 'bg-white border-slate-50 text-slate-300'
                  }`}>
                    {step > num ? <CheckCircle2 size={20} /> : num}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= num ? 'text-navy-700' : 'text-slate-300'}`}>
                    {num === 1 ? 'Details' : num === 2 ? 'Treatment' : 'Schedule'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Section */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Step 1: Personal Details */}
                {step === 1 && (
                  <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-card border border-slate-100 animate-slide-up">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-navy-800 mb-2">Your Information</h2>
                      <p className="text-slate-500 text-sm">Please provide your contact details for verification.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                          <input
                            {...register('patient_name', { required: 'Full name is required' })}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                            placeholder="e.g. Johnathan Smith"
                          />
                        </div>
                        {errors.patient_name && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.patient_name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                          <input
                            {...register('email', { 
                              required: 'Email is required',
                              pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email' }
                            })}
                            type="email"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                            placeholder="hello@example.com"
                          />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email.message}</p>}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                          <input
                            {...register('phone', { required: 'Phone number is required' })}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                            placeholder="+91 000-000-0000"
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.phone.message}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Service & Dentist */}
                {step === 2 && (
                  <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-card border border-slate-100 animate-slide-up">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-navy-800 mb-2">Choose Treatment</h2>
                      <p className="text-slate-500 text-sm">Select the service and your preferred dental professional.</p>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Desired Service</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Array.isArray(services) && services.map(s => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setValue('service_id', s.id)}
                              className={`p-5 rounded-2xl text-left border-2 transition-all group ${
                                selectedServiceId === s.id 
                                ? 'bg-teal-50 border-teal-500 ring-4 ring-teal-500/5' 
                                : 'bg-white border-slate-100 hover:border-teal-200 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-xl ${selectedServiceId === s.id ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-teal-600'}`}>
                                  <Stethoscope size={18} />
                                </div>
                                <span className="text-sm font-bold text-teal-600">{s.price}</span>
                              </div>
                              <h4 className={`font-bold transition-colors ${selectedServiceId === s.id ? 'text-navy-800' : 'text-slate-600'}`}>{s.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{s.duration}</p>
                            </button>
                          ))}
                        </div>
                        <input type="hidden" {...register('service_id', { required: 'Please select a service' })} />
                        {errors.service_id && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.service_id.message}</p>}
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Available Doctors</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Array.isArray(dentists) && dentists.map(d => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => setValue('dentist_id', d.id)}
                              className={`p-5 rounded-2xl text-left border-2 transition-all group flex items-center gap-4 ${
                                selectedDentistId === d.id 
                                ? 'bg-navy-50 border-navy-600 ring-4 ring-navy-600/5' 
                                : 'bg-white border-slate-100 hover:border-navy-200 hover:bg-slate-50'
                              }`}
                            >
                              <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden relative shrink-0">
                                {d.profile_photo && <img src={d.profile_photo} alt={d.full_name} className="w-full h-full object-cover object-top" />}
                                {selectedDentistId === d.id && (
                                  <div className="absolute inset-0 bg-navy-600/20 flex items-center justify-center">
                                    <CheckCircle2 className="text-white" size={24} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className={`font-bold transition-colors ${selectedDentistId === d.id ? 'text-navy-800' : 'text-slate-600'}`}>{d.full_name}</h4>
                                <p className="text-xs text-slate-400 font-medium">{d.specialization}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                        <input type="hidden" {...register('dentist_id', { required: 'Please select a dentist' })} />
                        {errors.dentist_id && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.dentist_id.message}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Schedule */}
                {step === 3 && (
                  <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-card border border-slate-100 animate-slide-up">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-navy-800 mb-2">Pick Your Slot</h2>
                      <p className="text-slate-500 text-sm">Select a convenient date and time for your visit.</p>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Preferred Date</label>
                        <input
                          {...register('appointment_date', { required: 'Please select a date' })}
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-bold text-navy-700"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-end ml-1">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Times</label>
                          <span className="text-[10px] font-bold text-teal-600 uppercase">Standard Duration Applied</span>
                        </div>
                        {fetchedSlots && fetchedSlots.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {fetchedSlots.map((slot: any) => {
                              const isAvailable = slot.availability;
                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  disabled={!isAvailable}
                                  onClick={() => setValue('appointment_time', slot.start_time)}
                                  className={`py-4 px-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                                    selectedTime === slot.start_time
                                    ? 'bg-navy-700 border-navy-700 text-white shadow-xl shadow-navy-100'
                                    : !isAvailable
                                    ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                                    : 'bg-white border-slate-50 text-slate-500 hover:border-teal-200 hover:bg-teal-50'
                                  }`}
                                >
                                  {slot.start_time}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {timeSlots.map(time => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setValue('appointment_time', time)}
                                className={`py-4 px-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                                  selectedTime === time
                                  ? 'bg-navy-700 border-navy-700 text-white shadow-xl shadow-navy-100'
                                  : 'bg-white border-slate-50 text-slate-500 hover:border-teal-200 hover:bg-teal-50'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        )}
                        <input type="hidden" {...register('appointment_time', { required: 'Please select a time' })} />
                        {errors.appointment_time && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.appointment_time.message}</p>}
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Any specific concerns?</label>
                        <textarea
                          {...register('message')}
                          rows={3}
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all text-sm resize-none"
                          placeholder="Tell us anything we should know..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-10">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-8 py-4 bg-white text-navy-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                      <ArrowLeft size={20} />
                      Previous
                    </button>
                  ) : <div />}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-10 py-4 bg-navy-600 hover:bg-navy-700 text-white font-bold rounded-2xl shadow-xl shadow-navy-100 transition-all flex items-center gap-2 active:scale-[0.98]"
                    >
                      Next Step
                      <ArrowRight size={20} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-12 py-4 bg-teal-500 hover:bg-teal-600 disabled:opacity-70 text-white font-bold rounded-2xl shadow-xl shadow-teal-500/20 transition-all flex items-center gap-2 active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
                      {isSubmitting ? 'Finalizing...' : 'Confirm Appointment'}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-6">
                <div className="bg-navy-800 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl transition-transform group-hover:scale-150" />
                  
                  <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Info size={20} className="text-teal-400" />
                    </div>
                    <h3 className="font-display text-xl font-bold">Booking Details</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <Zap size={18} className="text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1">Procedure</p>
                        <p className="font-bold text-sm leading-tight">{selectedService?.name || 'Not selected yet'}</p>
                        {selectedService && <p className="text-xs text-teal-400 font-bold mt-1.5">{selectedService.price}</p>}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <UserRound size={18} className="text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1">Provider</p>
                        <p className="font-bold text-sm leading-tight">{selectedDentist ? `Dr. ${selectedDentist.full_name}` : 'Not selected yet'}</p>
                        {selectedDentist && <p className="text-xs text-navy-400 mt-1">{selectedDentist.specialization}</p>}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <Calendar size={18} className="text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1">Time Slot</p>
                        <p className="font-bold text-sm leading-tight">{selectedDate || 'No date set'}</p>
                        <p className="text-sm font-bold text-teal-400 mt-1">{selectedTime || '---'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3 text-xs text-navy-300">
                      <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} className="text-teal-400" />
                      </div>
                      Secure & Encrypted Booking
                    </div>
                    <div className="flex items-center gap-3 text-xs text-navy-300">
                      <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} className="text-teal-400" />
                      </div>
                      Email Confirmation Ready
                    </div>
                  </div>
                </div>

                {/* Help Card */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                  <h4 className="font-bold text-navy-800 mb-2">Need Assistance?</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">Our concierge team is available to help you with scheduling or emergency requests.</p>
                  <a href="tel:+919365214587" className="flex items-center justify-center gap-3 w-full py-4 bg-slate-50 hover:bg-teal-50 text-navy-800 font-bold rounded-2xl transition-all border border-slate-100 hover:border-teal-100">
                    <Phone size={20} className="text-teal-600" />
                    +91 9365214587
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
