'use client';
import React, { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

const faqs = [
  {
    question: 'How often should I visit the dentist for a checkup?',
    answer:
      'We recommend visiting us every 6 months for a routine checkup and professional cleaning. However, if you have specific dental issues, we might suggest more frequent visits.',
  },
  {
    question: 'Do you accept dental insurance?',
    answer:
      'Yes, we accept most major dental insurance plans. Our front desk staff will be happy to help you verify your coverage and file claims on your behalf.',
  },
  {
    question: 'What should I do in a dental emergency?',
    answer:
      'If you experience a dental emergency such as a knocked-out tooth, severe toothache, or swelling, please call our 24/7 emergency line immediately. We prioritize emergency cases and will see you as soon as possible.',
  },
  {
    question: 'Do you offer financing options for larger treatments?',
    answer:
      'Absolutely. We understand that comprehensive dental work can be an investment. We offer flexible payment plans and partner with CareCredit to provide interest-free financing options.',
  },
  {
    question: 'Are your treatments safe for children?',
    answer:
      'Yes! We offer pediatric dentistry and strive to make our youngest patients feel comfortable and safe. We use child-friendly terminology and gentle techniques.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 text-teal-600 mb-6">
            <MessageCircleQuestion size={32} />
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-navy-700 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Got questions? We've got answers. Here are some of the most common questions our
            patients ask us.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-teal-500 bg-teal-50/30'
                    : 'border-slate-200 bg-white hover:border-teal-200'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span
                    className={`font-semibold text-lg ${isOpen ? 'text-teal-700' : 'text-navy-700'}`}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-teal-600' : 'text-slate-400'}`}
                    size={20}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 text-slate-600 leading-relaxed">{faq.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
