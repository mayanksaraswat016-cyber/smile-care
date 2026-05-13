'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getSupabaseClient } from '@/lib/supabase';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface SiteSettings {
  id?: string;
  site_name: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  hero_title: string;
  hero_subtitle: string;
  hero_background_image?: string;
  hero_cta_text: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  meta_title: string;
  meta_description: string;
  show_hero_section: boolean;
  show_services_section: boolean;
  show_team_section: boolean;
  show_testimonials_section: boolean;
}

const SiteSettingsContext = createContext<{
  settings: SiteSettings | null;
  loading: boolean;
}>({
  settings: null,
  loading: true,
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const { data: settings, isLoading } = useSWR('/api/site-settings', fetcher);

  useEffect(() => {
    if (settings) {
      // Apply theme colors to CSS variables
      document.documentElement.style.setProperty('--primary-color', settings.primary_color);
      document.documentElement.style.setProperty('--secondary-color', settings.secondary_color);
      document.documentElement.style.setProperty('--accent-color', settings.accent_color);
      document.documentElement.style.setProperty('--background-color', settings.background_color);
      document.documentElement.style.setProperty('--text-color', settings.text_color);

      // Update document title
      document.title = settings.meta_title || settings.site_name;

      // Update favicon if provided
      if (settings.favicon_url) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
          link.href = settings.favicon_url;
        } else {
          const newLink = document.createElement('link');
          newLink.rel = 'icon';
          newLink.href = settings.favicon_url;
          document.head.appendChild(newLink);
        }
      }

      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', settings.meta_description);
    }
  }, [settings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading: isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return context;
}
