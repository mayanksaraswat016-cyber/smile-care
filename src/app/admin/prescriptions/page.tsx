'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getSupabaseClient } from '@/lib/supabase';
import { FileText, Plus, Pill, Search, Trash2, X, Download, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { CardSkeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminPrescriptions() {
  const { data: prescriptions, isLoading } = useSWR('/api/prescriptions', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data: medicines } = useSWR('/api/medicines', fetcher);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<any[]>([]);
  const [customMedicine, setCustomMedicine] = useState({
    name: '',
    type: 'Painkiller',
    dosage: '',
    frequency: '',
    duration: '',
    precautions: '',
  });

  if (isLoading) {
    return <CardSkeleton count={6} />;
  }

  const filtered = Array.isArray(prescriptions)
    ? prescriptions.filter((p: any) =>
        (p?.patient_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    : [];

  const handleCreatePrescription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const allMedicines = [...selectedMedicines];
    if (customMedicine.name) allMedicines.push(customMedicine);

    const appointment_id = formData.get('appointment_id') as string;
    const doctor_id = formData.get('doctor_id') as string;

    const isUUID = (uuid: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);

    const prescription = {
      appointment_id: isUUID(appointment_id) ? appointment_id : null,
      patient_id: formData.get('patient_id'),
      patient_name: formData.get('patient_name'),
      doctor_id: isUUID(doctor_id) ? doctor_id : null,
      doctor_name: formData.get('doctor_name'),
      medicines: allMedicines,
      notes: formData.get('notes'),
      signature_url: formData.get('signature_url'),
    };

    const res = await fetch('/api/prescriptions' + (isEditing ? `?id=${editingId}` : ''), {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prescription),
    });

    if (res.ok) {
      toast.success(isEditing ? 'Prescription updated' : 'Prescription created');
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingId(null);
      setSelectedMedicines([]);
      setCustomMedicine({
        name: '',
        type: 'Painkiller',
        dosage: '',
        frequency: '',
        duration: '',
        precautions: '',
      });
      mutate('/api/prescriptions');
    } else {
      const errorData = await res.json();
      toast.error(`Failed: ${errorData.error || 'Check if IDs are valid UUIDs'}`);
    }
  };

  const addPresetMedicine = (medicine: any) => {
    setSelectedMedicines([...selectedMedicines, medicine]);
  };

  const addCustomMedicine = () => {
    if (!customMedicine.name) {
      toast.error('Medicine name is required');
      return;
    }
    setSelectedMedicines([...selectedMedicines, customMedicine]);
    setCustomMedicine({
      name: '',
      type: 'Painkiller',
      dosage: '',
      frequency: '',
      duration: '',
      precautions: '',
    });
  };

  const handleEdit = (prescription: any) => {
    setIsEditing(true);
    setEditingId(prescription.id);
    setEditingData(prescription);
    setSelectedMedicines(prescription.medicines || []);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setIsEditing(false);
    setEditingId(null);
    setEditingData(null);
    setSelectedMedicines([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;
    const res = await fetch(`/api/prescriptions?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Prescription deleted');
      mutate('/api/prescriptions');
    } else {
      toast.error('Failed to delete prescription');
    }
  };

  const downloadPDF = (prescription: any) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('SmileCare Dental Clinic', 14, 20);
    doc.setFontSize(14);
    doc.text('Digital Prescription', 14, 30);
    doc.setFontSize(12);
    doc.text(`Patient: ${prescription.patient_name}`, 14, 42);
    doc.text(`Doctor: ${prescription.doctor_name}`, 14, 50);
    doc.text(`Date: ${new Date(prescription.created_at).toLocaleDateString()}`, 14, 58);

    let y = 75;
    doc.setFontSize(11);
    prescription.medicines.forEach((med: any, i: number) => {
      doc.text(`${i + 1}. ${med.name} (${med.type})`, 14, y);
      doc.text(`   Dosage: ${med.dosage} | ${med.frequency} | ${med.duration}`, 14, y + 6);
      if (med.precautions) doc.text(`   Precautions: ${med.precautions}`, 14, y + 12);
      y += 20;
    });

    if (prescription.notes) {
      doc.text(`Notes: ${prescription.notes}`, 14, y + 10);
    }

    doc.save(`Prescription_${prescription.patient_name}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-700 mb-1">
            Digital Prescriptions
          </h1>
          <p className="text-slate-500 text-sm">Create and manage patient prescriptions.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-teal-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          New Prescription
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-card border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prescription: any) => (
          <div
            key={prescription.id}
            className="bg-white rounded-[2rem] p-6 shadow-card border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-teal-600">
                <Pill size={20} />
                <span className="font-bold text-sm">Prescription</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(prescription)}
                  className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => downloadPDF(prescription)}
                  className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                  title="Download PDF"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => handleDelete(prescription.id)}
                  className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                  title="Delete Prescription"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="font-bold text-navy-700 mb-1">{prescription.patient_name}</p>
            <p className="text-xs text-slate-400 mb-3">Dr. {prescription.doctor_name}</p>
            <div className="text-xs text-slate-500 mb-3">
              <p>Medicines: {prescription.medicines?.length || 0}</p>
              <p>Date: {new Date(prescription.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {prescription.medicines?.slice(0, 3).map((med: any, i: number) => (
                <span key={i} className="text-[10px] bg-slate-100 px-2 py-1 rounded-full">
                  {med.name}
                </span>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-20 text-slate-400">
            <FileText size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No prescriptions found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-navy-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
            <form 
              key={editingId || 'new'}
              onSubmit={handleCreatePrescription} 
              className="p-8 lg:p-10 space-y-6"
            >
              <h2 className="font-display text-2xl font-bold text-navy-700">
                {isEditing ? 'Edit Prescription' : 'New Prescription'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Patient Name
                  </label>
                  <input
                    name="patient_name"
                    required
                    defaultValue={editingData?.patient_name}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Patient ID
                  </label>
                  <input
                    name="patient_id"
                    required
                    defaultValue={editingData?.patient_id}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Doctor Name
                  </label>
                  <input
                    name="doctor_name"
                    required
                    defaultValue={editingData?.doctor_name}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Doctor ID
                  </label>
                  <input
                    name="doctor_id"
                    defaultValue={editingData?.doctor_id}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Appointment ID
                  </label>
                  <input
                    name="appointment_id"
                    defaultValue={editingData?.appointment_id}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                  Preset Medicines
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {Array.isArray(medicines) &&
                    medicines.slice(0, 10).map((med: any) => (
                      <button
                        key={med.id}
                        type="button"
                        onClick={() => addPresetMedicine(med)}
                        className="px-3 py-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-600 rounded-xl text-xs font-semibold transition-all"
                      >
                        {med.name}
                      </button>
                    ))}
                </div>
                <div className="space-y-2">
                  {selectedMedicines.map((med, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl"
                    >
                      <span className="text-sm font-semibold text-emerald-700">
                        {med.name} - {med.dosage}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedMedicines(selectedMedicines.filter((_, idx) => idx !== i))
                        }
                        className="text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                  Add Custom Medicines
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <input
                    placeholder="Name"
                    value={customMedicine.name}
                    onChange={(e) => setCustomMedicine({ ...customMedicine, name: e.target.value })}
                    className="px-3 py-2 bg-slate-50 rounded-lg text-sm outline-none border border-slate-100 col-span-2 sm:col-span-1"
                  />
                  <select
                    value={customMedicine.type}
                    onChange={(e) => setCustomMedicine({ ...customMedicine, type: e.target.value })}
                    className="px-3 py-2 bg-slate-50 rounded-lg text-sm outline-none border border-slate-100"
                  >
                    <option value="Painkiller">Painkiller</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Anti-inflammatory">Anti-inflammatory</option>
                  </select>
                  <input
                    placeholder="Dosage"
                    value={customMedicine.dosage}
                    onChange={(e) =>
                      setCustomMedicine({ ...customMedicine, dosage: e.target.value })
                    }
                    className="px-3 py-2 bg-slate-50 rounded-lg text-sm outline-none border border-slate-100"
                  />
                  <input
                    placeholder="Frequency"
                    value={customMedicine.frequency}
                    onChange={(e) =>
                      setCustomMedicine({ ...customMedicine, frequency: e.target.value })
                    }
                    className="px-3 py-2 bg-slate-50 rounded-lg text-sm outline-none border border-slate-100"
                  />
                  <input
                    placeholder="Duration"
                    value={customMedicine.duration}
                    onChange={(e) =>
                      setCustomMedicine({ ...customMedicine, duration: e.target.value })
                    }
                    className="px-3 py-2 bg-slate-50 rounded-lg text-sm outline-none border border-slate-100"
                  />
                  <input
                    placeholder="Precautions"
                    value={customMedicine.precautions}
                    onChange={(e) =>
                      setCustomMedicine({ ...customMedicine, precautions: e.target.value })
                    }
                    className="px-3 py-2 bg-slate-50 rounded-lg text-sm outline-none border border-slate-100"
                  />
                  <button
                    type="button"
                    onClick={addCustomMedicine}
                    className="flex items-center justify-center gap-2 bg-teal-50 text-teal-600 font-bold py-2 rounded-lg hover:bg-teal-100 transition-all sm:col-span-3 mt-1"
                  >
                    <Plus size={16} /> Add Medicine to List
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingData?.notes}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 bg-teal-500 text-white font-bold rounded-2xl shadow-xl shadow-teal-500/20"
                >
                  {isEditing ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
