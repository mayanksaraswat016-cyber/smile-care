'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const hours = [
  { day: 'Monday – Friday', time: '8:00 AM – 7:00 PM', open: true },
  { day: 'Saturday', time: '9:00 AM – 5:00 PM', open: true },
  { day: 'Sunday', time: '10:00 AM – 2:00 PM', open: true },
  { day: 'Emergency Line', time: '24/7', open: true },
];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    try {
      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
        toast.success("Message sent! We'll respond within 2 business hours.");
      } else {
        toast.error(result.error || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-4 py-1.5 mb-3">
            Get in Touch
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-navy-700 mb-4">
            We&apos;re Here When You Need Us
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 xl:gap-14">
          {/* Left info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info cards */}
            <div className="space-y-4">
              {[
                {
                  icon: MapPin,
                  label: 'Address',
                  value: '247 Maplewood Drive, Suite 3B\nSan Francisco, CA 94102',
                  href: 'https://maps.google.com',
                },
                {
                  icon: Phone,
                   label: 'Main Line',
                  value: '+91 9365214587',
                  href: 'tel:+919365214587',
                },
                {
                  icon: Phone,
                   label: 'Emergency',
                  value: '+91 9365214587',
                  href: 'tel:+919365214587',
                },
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'hello@smilecare.clinic',
                  href: 'mailto:hello@smilecare.clinic',
                },
              ].map((item) => (
                <div
                  key={`contact-${item.label}`}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-navy-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                      {item.label}
                    </p>
                    <a
                      href={item.href}
                      className="text-sm text-navy-700 font-medium hover:text-teal-600 transition-colors whitespace-pre-line"
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="bg-navy-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-teal-400" />
                <span className="font-display font-semibold text-sm">Clinic Hours</span>
              </div>
              <div className="space-y-2.5">
                {hours.map((h) => (
                  <div key={`hour-${h.day}`} className="flex items-center justify-between">
                    <span className="text-sm text-navy-200">{h.day}</span>
                    <span
                      className={`text-sm font-semibold ${h.day === 'Emergency Line' ? 'text-teal-400' : 'text-white'}`}
                    >
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden h-64 bg-slate-200 relative shadow-inner border border-slate-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.123456789!2d-122.419415!3d37.774929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0x7c5e3ee444e21a4d!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Clinic Location"
              ></iframe>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 bg-teal-50 rounded-2xl border border-teal-100">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-teal-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-navy-700 mb-2">Message Sent!</h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  Thanks for reaching out. Our team will respond within 2 business hours. For urgent
                  matters, please call our main line.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all`}
                      placeholder="Aaliya Rahman"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' },
                      })}
                      type="email"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all`}
                      placeholder="aaliya@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                      placeholder="+91 0000000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('subject', { required: 'Please select a subject' })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm ${errors.subject ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all`}
                    >
                      <option value="">Select subject</option>
                      <option value="appointment">Appointment Inquiry</option>
                      <option value="insurance">Insurance Questions</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="records">Medical Records</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('message', {
                      required: 'Message is required',
                      minLength: { value: 20, message: 'Please write at least 20 characters' },
                    })}
                    rows={5}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm resize-none ${errors.message ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all`}
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>

                <p className="text-xs text-slate-400">
                  This form is protected by reCAPTCHA v3. Your message is encrypted and HIPAA
                  compliant.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-navy-600 hover:bg-navy-700 disabled:opacity-70 text-white font-semibold rounded-xl active:scale-95 transition-all duration-150"
                >
                  {isSubmitting ? (
                    <>
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
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
