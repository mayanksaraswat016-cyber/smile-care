export interface Service {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: string;
  description: string;
  popular: boolean;
  color: string;
  urgent?: boolean;
}

export interface Dentist {
  id: string;
  full_name: string;
  profile_photo: string;
  qualification: string;
  specialization: string;
  experience: string;
  bio: string;
  services_list: string[];
  degree: string;
  university: string;
  certifications: string[];
  working_days: string;
  timings: string;
  emergency: boolean;
  rating: number;
  reviews: {
    patient: string;
    feedback: string;
    date: string;
  }[];
  before_after_images: string[];
  video_intro: string;
  phone: string;
  whatsapp: string;
  book_button_link: string;
  google_reviews_link: string;
  linkedin_practo_link: string;
  // Slot Management
  work_start_time?: string;
  work_end_time?: string;
  slot_duration?: number;
  buffer_time?: number;
}

// ============ LIVE SLOT MANAGEMENT ============
export interface DoctorSlot {
  id: string;
  doctor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  availability: boolean;
  appointment_id?: string;
  buffer_time: number;
  created_at: string;
}

// ============ ELECTRONIC HEALTH RECORDS ============
export interface PatientEHR {
  id: string;
  patient_id: string;
  patient_name: string;
  medical_history: {
    allergies: string[];
    conditions: string[];
    medications: string[];
    blood_group: string;
    notes: string;
  };
  visits: EHVisit[];
  created_at: string;
  updated_at: string;
}

export interface EHVisit {
  visit_id: string;
  date: string;
  dentist: string;
  treatment: string;
  notes: string;
  image_urls: string[];
}

// ============ BILLING & INVOICING ============
export interface Invoice {
  id: string;
  invoice_number: string;
  patient_id: string;
  patient_name: string;
  patient_email: string;
  appointment_id?: string;
  items: InvoiceItem[];
  subtotal: number;
  total_gst: number;
  discount: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  issued_date: string;
  due_date: string;
  paid_date?: string;
  created_at: string;
}

export interface InvoiceItem {
  treatment: string;
  quantity: number;
  unit_price: number;
  total: number;
  gst_rate: number;
  gst_amount: number;
}

// ============ DIGITAL PRESCRIPTION ============
export interface Prescription {
  id: string;
  appointment_id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  medicines: PrescriptionMedicine[];
  notes: string;
  signature_url?: string;
  created_at: string;
}

export interface PrescriptionMedicine {
  name: string;
  type: string;
  dosage: string;
  frequency: string;
  duration: string;
  precautions: string;
}

export interface Medicine {
  id: string;
  name: string;
  type: string;
  dosage: string;
  frequency: string;
  duration: string;
  precautions: string;
  is_preset: boolean;
}

// ============ MULTI-USER RBAC ============
export type UserRole = 'admin' | 'doctor' | 'reception';

export interface StaffUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  profile_photo?: string;
  phone?: string;
  doctor_id?: string;
  is_active: boolean;
  created_at: string;
}

// ============ INVENTORY MANAGEMENT ============
export interface InventoryItem {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  threshold: number;
  expiry_date?: string;
  cost_per_unit: number;
  supplier_id?: string;
  supplier_name?: string;
  last_restocked: string;
  category: string;
}

export interface InventoryUsageLog {
  id: string;
  appointment_id: string;
  item_id: string;
  item_name: string;
  quantity_used: number;
  timestamp: string;
}

// ============ EMAIL AUTOMATION ============
export interface EmailLog {
  id: string;
  type: string;
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  sent_at: string;
  patient_id?: string;
  appointment_id?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger_event: string;
  is_active: boolean;
}

// ============ REVENUE ANALYTICS ============
export interface RevenueData {
  date: string;
  revenue: number;
  appointments: number;
}

export interface TreatmentRevenue {
  treatment: string;
  revenue: number;
  count: number;
  percentage: number;
}

export interface DoctorPerformance {
  doctor_id: string;
  doctor_name: string;
  revenue: number;
  appointments: number;
}
