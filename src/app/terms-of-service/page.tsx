import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { Scale, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TermsOfServicePage() {
  const rules = [
    {
      icon: Clock,
      title: 'Appointments',
      content:
        'Appointments are scheduled based on availability. We recommend arriving 10 minutes early to complete any necessary paperwork.',
    },
    {
      icon: Scale,
      title: 'Payments & Insurance',
      content:
        'Payment is expected at the time of service. We accept major insurance plans and will assist with claim filing, but you are ultimately responsible for any unpaid balance.',
    },
    {
      icon: AlertTriangle,
      title: 'Cancellations',
      content:
        'While we have removed our strict fee policy, we appreciate a 24-hour notice for cancellations to help us manage our schedule and serve other patients.',
    },
    {
      icon: CheckCircle,
      title: 'Patient Conduct',
      content:
        'We strive to provide a safe and respectful environment for both patients and staff. We reserve the right to refuse service for inappropriate behavior.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      <main className="pt-16 pb-20">
        <div className="bg-navy-600 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-navy-100 text-lg">
              Last updated: April 26, 2026. By using our website and services, you agree to the
              following terms.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 -mt-10">
          <div className="bg-white rounded-3xl shadow-card p-8 lg:p-12">
            <div className="prose prose-slate max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {rules.map((rule, index) => (
                  <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mb-4">
                      <rule.icon size={24} className="text-navy-600" />
                    </div>
                    <h3 className="text-lg font-bold text-navy-700 mb-2">{rule.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{rule.content}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-8 text-slate-600">
                <section>
                  <h2 className="font-display text-2xl font-bold text-navy-700 mb-4">
                    1. Scope of Services
                  </h2>
                  <p>
                    SmileCare provides various dental services including examinations, cleanings,
                    surgical procedures, and cosmetic treatments. Our website is intended to provide
                    information about these services and allow for online appointment requests.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-navy-700 mb-4">
                    2. Accuracy of Information
                  </h2>
                  <p>
                    While we strive to keep our website updated, dental treatment options and
                    pricing may change. Final treatment plans and costs will be discussed in person
                    during your clinical consultation.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-navy-700 mb-4">
                    3. Limitation of Liability
                  </h2>
                  <p>
                    SmileCare is not liable for any indirect, incidental, or consequential damages
                    arising from your use of this website. Clinical liability is governed by state
                    regulations and professional standards of care.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-navy-700 mb-4">
                    4. Governing Law
                  </h2>
                  <p>
                    These terms are governed by the laws of the State of California. Any disputes
                    arising from these terms will be resolved in the courts of San Francisco County.
                  </p>
                </section>

                <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="font-bold text-navy-700 mb-2">Questions?</h3>
                  <p className="text-sm">
                    If you have any questions about these terms, please contact us at
                    support@smilecare.clinic.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
