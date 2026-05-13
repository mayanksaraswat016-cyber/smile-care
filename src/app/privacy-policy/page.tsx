import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Shield,
      title: 'Data Protection',
      content:
        'We take the security of your dental records and personal information seriously. Our systems are HIPAA-compliant, and all data is encrypted both in transit and at rest.',
    },
    {
      icon: Lock,
      title: 'Information We Collect',
      content:
        'We collect personal details (name, email, phone), medical history, and insurance information to provide you with the best dental care possible. This information is used solely for treatment, billing, and appointment reminders.',
    },
    {
      icon: Eye,
      title: 'How We Use Your Data',
      content:
        'Your data is used to schedule appointments, process insurance claims, and maintain your dental health records. We do not sell your personal information to third parties.',
    },
    {
      icon: FileText,
      title: 'Your Rights',
      content:
        'You have the right to request copies of your dental records, update your personal information, and opt-out of non-essential communications at any time.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      <main className="pt-16 pb-20">
        <div className="bg-navy-700 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-navy-200 text-lg">
              Last updated: April 26, 2026. Your privacy and the security of your health data are
              our top priorities.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 -mt-10">
          <div className="bg-white rounded-3xl shadow-card p-8 lg:p-12">
            <div className="prose prose-slate max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {sections.map((section, index) => (
                  <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                      <section.icon size={24} className="text-teal-600" />
                    </div>
                    <h3 className="text-lg font-bold text-navy-700 mb-2">{section.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>

              <h2 className="font-display text-2xl font-bold text-navy-700 mb-4 text-center">
                Full Policy Details
              </h2>
              <div className="space-y-6 text-slate-600">
                <p>
                  SmileCare ("we," "our," or "us") is committed to protecting the privacy of our
                  patients. This Privacy Policy explains how we collect, use, and safeguard your
                  information when you visit our website or use our services.
                </p>
                <p>
                  We comply with all applicable health privacy laws, including the Health Insurance
                  Portability and Accountability Act (HIPAA). This means we maintain strict
                  administrative, technical, and physical safeguards to protect your Protected
                  Health Information (PHI).
                </p>
                <h3 className="font-bold text-navy-700">1. Information Collection</h3>
                <p>
                  When you book an appointment, we collect your name, contact details, date of
                  birth, and insurance information. We also collect medical history during your
                  visits to ensure safe and effective treatment.
                </p>
                <h3 className="font-bold text-navy-700">2. Sharing of Information</h3>
                <p>
                  We may share your information with insurance providers to process claims, or with
                  other healthcare providers involved in your treatment. We will not disclose your
                  PHI for marketing purposes without your explicit written authorization.
                </p>
                <h3 className="font-bold text-navy-700">3. Contact Us</h3>
                <p>
                  If you have any questions about our privacy practices, please contact our Privacy
                  Officer at privacy@smilecare.clinic or call +91 9365214587.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
