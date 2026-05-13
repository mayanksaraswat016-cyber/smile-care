import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import HeroSection from './components/HeroSection';
import TrustBadges from './components/TrustBadges';
import ServicesSection from './components/ServicesSection';
import StatsBar from './components/StatsBar';
import WhyChooseUs from './components/WhyChooseUs';
import SmileTransformation from './components/SmileTransformation';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import QuickBookingStrip from './components/QuickBookingStrip';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <HeroSection />
        <TrustBadges />
        <ServicesSection />
        <StatsBar />
        <WhyChooseUs />
        <SmileTransformation />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
        <QuickBookingStrip />
      </main>
      <PublicFooter />
    </div>
  );
}
