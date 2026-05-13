import React from 'react';
import { ShieldCheck, Microscope, CreditCard, HeartHandshake } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

const reasons = [
  {
    id: 'reason-tech',
    icon: Microscope,
    title: 'Latest Technology',
    description:
      'Digital X-rays, 3D CBCT scans, same-day CEREC crowns, and laser dentistry — we invest in tools that make your care safer and faster.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    id: 'reason-gentle',
    icon: HeartHandshake,
    title: 'Gentle, Anxiety-Free Care',
    description:
      'Dental anxiety is real. Our team uses comfort protocols, sedation options, and a calming environment designed to put nervous patients at ease.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    id: 'reason-insurance',
    icon: CreditCard,
    title: 'Transparent Pricing',
    description:
      'We accept 40+ insurance plans and offer in-house payment plans. No surprise bills — you receive a full cost estimate before any treatment begins.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    id: 'reason-certified',
    icon: ShieldCheck,
    title: 'Board-Certified Dentists',
    description:
      'Every dentist on our team is ADA board-certified, continuously trained on the latest techniques, and committed to evidence-based care.',
    color: 'bg-navy-50 text-navy-600',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">
          {/* Left image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden">
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_1aca03d6d-1772973811245.png"
                alt="Modern dental clinic interior with advanced equipment and a welcoming patient chair"
                width={700}
                height={600}
                className="w-full object-cover h-[420px] lg:h-[500px]"
              />

              {/* Overlay stats */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-card">
                  <p className="text-2xl font-bold text-navy-700 tabular-nums">4.9★</p>
                  <p className="text-xs text-slate-500">Google Reviews</p>
                </div>
                <div className="bg-navy-600/95 backdrop-blur-sm rounded-xl p-3 shadow-card">
                  <p className="text-2xl font-bold text-white tabular-nums">0</p>
                  <p className="text-xs text-navy-300">Surprise bills</p>
                </div>
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-teal-50 rounded-3xl -z-10" />
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-navy-50 rounded-2xl -z-10" />
          </div>

          {/* Right content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-4 py-1.5 mb-3">
              Why SmileCare
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-navy-700 mb-4">
              Dentistry You&apos;ll Actually Look Forward To
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              We built SmileCare around the care experience patients told us they wished existed —
              combining clinical excellence with genuine compassion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {reasons?.map((reason) => (
                <div
                  key={reason?.id}
                  className="flex gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-card transition-all duration-200"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${reason?.color} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <reason.icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-navy-700 mb-1">
                      {reason?.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{reason?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
