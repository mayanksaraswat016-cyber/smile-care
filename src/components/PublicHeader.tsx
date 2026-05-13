'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Menu, X, Phone } from 'lucide-react';

// Navigation configuration for each page
const pageNavigation: Record<string, Array<{ label: string; href: string }>> = {
  '/home-page': [
    { label: 'Home', href: '/home-page' },
    { label: 'Services', href: '/services' },
    { label: 'Appointments', href: '/appointments-page' },
    { label: 'Our Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
  ],
  '/services': [
    { label: 'Home', href: '/home-page' },
    { label: 'Services', href: '/services' },
    { label: 'Appointments', href: '/appointments-page' },
    { label: 'Our Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
  ],
  '/appointments-page': [
    { label: 'Home', href: '/home-page' },
    { label: 'Services', href: '/services' },
    { label: 'Appointments', href: '/appointments-page' },
    { label: 'Our Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
  ],
  '/team': [
    { label: 'Home', href: '/home-page' },
    { label: 'Services', href: '/services' },
    { label: 'Appointments', href: '/appointments-page' },
    { label: 'Our Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
  ],
  '/contact': [
    { label: 'Home', href: '/home-page' },
    { label: 'Services', href: '/services' },
    { label: 'Appointments', href: '/appointments-page' },
    { label: 'Our Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
  ],
  '/privacy-policy': [
    { label: 'Home', href: '/home-page' },
    { label: 'Services', href: '/services' },
    { label: 'Appointments', href: '/appointments-page' },
    { label: 'Our Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
  ],
  '/terms-of-service': [
    { label: 'Home', href: '/home-page' },
    { label: 'Services', href: '/services' },
    { label: 'Appointments', href: '/appointments-page' },
    { label: 'Our Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
  ],
};

// Default navigation for pages not specified
const defaultNav = [
  { label: 'Home', href: '/home-page' },
  { label: 'Services', href: '/services' },
  { label: 'Appointments', href: '/appointments-page' },
  { label: 'Our Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { settings } = useSiteSettings();

  // Get navigation items based on current page
  const navItems = pageNavigation[pathname] || defaultNav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-nav' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/home-page" prefetch={true} className="flex items-center gap-2.5">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.site_name}
                className="h-9 w-9 object-contain"
              />
            ) : (
              <AppLogo size={36} />
            )}
            <span className="font-display text-xl font-700 text-navy-600 tracking-tight">
              {settings?.site_name || 'SmileCare'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems?.map((item) => (
              <Link
                key={`nav-${item?.label}`}
                href={item?.href}
                prefetch={true}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-all duration-150"
              >
                {item?.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${settings?.contact_phone || '+919365214587'}`}
              className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              <Phone size={15} />
              <span>{settings?.contact_phone || '+91 9365214587'}</span>
            </a>
            <Link
              href="/appointments-page"
              prefetch={true}
              className="px-4 py-2 text-sm font-semibold text-white bg-navy-600 rounded-lg hover:bg-navy-700 active:scale-95 transition-all duration-150"
            >
              {settings?.hero_cta_text || 'Book Appointment'}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 animate-fade-in">
          <nav className="flex flex-col gap-1 mb-4">
            {navItems?.map((item) => (
              <Link
                key={`mobile-nav-${item?.label}`}
                href={item?.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-all"
              >
                {item?.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
            <Link
              href="/appointments-page"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-navy-600 rounded-lg hover:bg-navy-700 transition-all"
            >
              {settings?.hero_cta_text || 'Book Appointment'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
