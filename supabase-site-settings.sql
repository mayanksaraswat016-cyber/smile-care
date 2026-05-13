-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name VARCHAR(255) NOT NULL DEFAULT 'SmileCare',
  logo_url TEXT,
  favicon_url TEXT,
  
  -- Theme Colors
  primary_color VARCHAR(7) DEFAULT '#1e3a8a',
  secondary_color VARCHAR(7) DEFAULT '#3b82f6',
  accent_color VARCHAR(7) DEFAULT '#10b981',
  background_color VARCHAR(7) DEFAULT '#ffffff',
  text_color VARCHAR(7) DEFAULT '#1f2937',
  
  -- Hero Section
  hero_title TEXT DEFAULT 'Your Smile, Our Priority',
  hero_subtitle TEXT DEFAULT 'Professional dental care with modern technology',
  hero_background_image TEXT,
  hero_cta_text VARCHAR(100) DEFAULT 'Book Appointment',
  
  -- Contact Info
  contact_email VARCHAR(255) DEFAULT 'info@smilecare.com',
  contact_phone VARCHAR(50) DEFAULT '+1 234 567 8900',
  contact_address TEXT DEFAULT '123 Dental Street, City, Country',
  
  -- Social Media Links
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  
  -- SEO
  meta_title VARCHAR(255) DEFAULT 'SmileCare - Professional Dental Clinic',
  meta_description TEXT DEFAULT 'Professional dental care services with modern technology and experienced dentists.',
  
  -- Other Settings
  show_hero_section BOOLEAN DEFAULT true,
  show_services_section BOOLEAN DEFAULT true,
  show_team_section BOOLEAN DEFAULT true,
  show_testimonials_section BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO site_settings (
  site_name,
  primary_color,
  secondary_color,
  accent_color,
  background_color,
  text_color,
  hero_title,
  hero_subtitle,
  hero_cta_text,
  contact_email,
  contact_phone,
  contact_address,
  meta_title,
  meta_description
)
VALUES (
  'SmileCare',
  '#1e3a8a',
  '#3b82f6',
  '#10b981',
  '#ffffff',
  '#1f2937',
  'Your Smile, Our Priority',
  'Professional dental care with modern technology',
  'Book Appointment',
  'info@smilecare.com',
  '+1 234 567 8900',
  '123 Dental Street, City, Country',
  'SmileCare - Professional Dental Clinic',
  'Professional dental care services with modern technology and experienced dentists.'
)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to everyone
CREATE POLICY "Allow public read access to site_settings"
  ON site_settings FOR SELECT
  USING (true);

-- Create policy to allow admin to update (you can modify this based on your auth system)
CREATE POLICY "Allow authenticated users to update site_settings"
  ON site_settings FOR UPDATE
  USING (true);

-- Create policy to allow admin to insert
CREATE POLICY "Allow authenticated users to insert site_settings"
  ON site_settings FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_site_settings_id ON site_settings(id);
