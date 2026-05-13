-- Dental Clinic Management System - Complete Database Schema for Supabase
-- Run this in Supabase SQL Editor to create all required tables

-- ============================================================================
-- DOCTOR SLOTS TABLE (Live Slot Management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS doctor_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES dentists(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time VARCHAR(5) NOT NULL, -- HH:MM format
  end_time VARCHAR(5) NOT NULL, -- HH:MM format
  availability BOOLEAN DEFAULT true,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  buffer_time INTEGER DEFAULT 5, -- minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_slots_doctor_date ON doctor_slots(doctor_id, date);
CREATE INDEX IF NOT EXISTS idx_doctor_slots_date ON doctor_slots(date);

-- ============================================================================
-- PATIENT EHR TABLE (Electronic Health Records)
-- ============================================================================
CREATE TABLE IF NOT EXISTS patient_ehr (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id VARCHAR(255) NOT NULL UNIQUE,
  patient_name VARCHAR(255) NOT NULL,
  medical_history JSONB DEFAULT '{
    "allergies": [],
    "conditions": [],
    "medications": [],
    "blood_group": "",
    "notes": ""
  }'::jsonb,
  visits JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patient_ehr_patient_id ON patient_ehr(patient_id);

-- ============================================================================
-- INVOICES TABLE (Billing & Invoicing)
-- ============================================================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  patient_id VARCHAR(255) NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC(12,2) DEFAULT 0,
  total_gst NUMERIC(12,2) DEFAULT 0,
  discount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
  issued_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(issued_date);

-- ============================================================================
-- PRESCRIPTIONS TABLE (Digital Prescriptions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  patient_id VARCHAR(255) NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  doctor_id UUID REFERENCES dentists(id) ON DELETE SET NULL,
  doctor_name VARCHAR(255) NOT NULL,
  medicines JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  signature_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON prescriptions(doctor_id);

-- ============================================================================
-- MEDICINES TABLE (Preset Medicines)
-- ============================================================================
CREATE TABLE IF NOT EXISTS medicines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Painkiller', 'Antibiotic', 'Anti-inflammatory')),
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  precautions TEXT,
  is_preset BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_medicines_type ON medicines(type);

-- ============================================================================
-- INVENTORY TABLE (Inventory Management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  threshold INTEGER DEFAULT 5,
  expiry_date DATE,
  cost_per_unit NUMERIC(10,2) DEFAULT 0,
  supplier_id UUID,
  supplier_name VARCHAR(255),
  last_restocked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category VARCHAR(100) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inventory_item ON inventory(item);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);

-- ============================================================================
-- INVENTORY USAGE LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  item_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity_used INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_logs_appointment ON inventory_usage_logs(appointment_id);

-- ============================================================================
-- STAFF USERS TABLE (RBAC)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'reception' CHECK (role IN ('admin', 'doctor', 'reception')),
  profile_photo TEXT,
  phone VARCHAR(20),
  doctor_id UUID REFERENCES dentists(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_email ON staff_users(email);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff_users(role);

-- ============================================================================
-- EMAIL LOGS TABLE (Email Automation)
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  patient_id VARCHAR(255),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_date ON email_logs(sent_at);

-- ============================================================================
-- EMAIL TEMPLATES TABLE (Optional - for dynamic templates)
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  trigger_event VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- UPDATE EXISTING DENTISTS TABLE FOR SLOT MANAGEMENT
-- ============================================================================
ALTER TABLE dentists 
ADD COLUMN IF NOT EXISTS work_start_time VARCHAR(5),
ADD COLUMN IF NOT EXISTS work_end_time VARCHAR(5),
ADD COLUMN IF NOT EXISTS slot_duration INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS buffer_time INTEGER DEFAULT 5;

-- ============================================================================
-- INSERT PRESET MEDICINES
-- ============================================================================
INSERT INTO medicines (name, type, dosage, frequency, duration, precautions) VALUES
('Ibuprofen', 'Painkiller', '400mg', 'Twice a day', '5 days', 'Take with food'),
('Amoxicillin', 'Antibiotic', '500mg', 'Three times a day', '7 days', 'Complete full course'),
('Paracetamol', 'Painkiller', '500mg', 'Three times a day', '3 days', 'Do not exceed 4g per day'),
('Metronidazole', 'Antibiotic', '400mg', 'Three times a day', '7 days', 'Avoid alcohol'),
('Diclofenac', 'Anti-inflammatory', '50mg', 'Twice a day', '5 days', 'Take with food'),
('Azithromycin', 'Antibiotic', '500mg', 'Once daily', '3 days', 'Take 1 hour before meals'),
('Clindamycin', 'Antibiotic', '300mg', 'Three times a day', '7 days', 'Take with full glass of water'),
('Naproxen', 'Anti-inflammatory', '250mg', 'Twice a day', '5 days', 'Take with food')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE doctor_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_ehr ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for safe re-running)
DROP POLICY IF EXISTS "Allow authenticated read" ON doctor_slots;
DROP POLICY IF EXISTS "Allow authenticated read" ON patient_ehr;
DROP POLICY IF EXISTS "Allow authenticated read" ON invoices;
DROP POLICY IF EXISTS "Allow authenticated read" ON prescriptions;
DROP POLICY IF EXISTS "Allow authenticated read" ON inventory;
DROP POLICY IF EXISTS "Allow authenticated read" ON inventory_usage_logs;
DROP POLICY IF EXISTS "Allow authenticated read" ON staff_users;
DROP POLICY IF EXISTS "Allow authenticated read" ON email_logs;

DROP POLICY IF EXISTS "Service role full access" ON doctor_slots;
DROP POLICY IF EXISTS "Service role full access" ON patient_ehr;
DROP POLICY IF EXISTS "Service role full access" ON invoices;
DROP POLICY IF EXISTS "Service role full access" ON prescriptions;
DROP POLICY IF EXISTS "Service role full access" ON inventory;
DROP POLICY IF EXISTS "Service role full access" ON inventory_usage_logs;
DROP POLICY IF EXISTS "Service role full access" ON staff_users;
DROP POLICY IF EXISTS "Service role full access" ON email_logs;

-- Allow public full access for all operations (Insert/Update/Delete/Select)
CREATE POLICY "Allow public full access" ON doctor_slots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access" ON patient_ehr FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access" ON prescriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access" ON inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access" ON inventory_usage_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access" ON staff_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access" ON email_logs FOR ALL USING (true) WITH CHECK (true);

-- Allow service role (server-side) full access
CREATE POLICY "Service role full access" ON doctor_slots FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON patient_ehr FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON invoices FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON prescriptions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON inventory FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON inventory_usage_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON staff_users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON email_logs FOR ALL USING (auth.role() = 'service_role');
