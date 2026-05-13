import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Services
    const { error: sErr } = await supabase.from('services').insert([
      {
        name: 'Root Canal Treatment',
        category: 'Emergency',
        price: '₹5000',
        duration: '60 min',
        popular: true,
        urgent: true,
        color: 'bg-red-50 text-red-700',
        description: 'Expert root canal treatment for severe tooth decay or infection.',
      },
      {
        name: 'Teeth Whitening',
        category: 'Cosmetic',
        price: '₹3000',
        duration: '45 min',
        popular: true,
        urgent: false,
        color: 'bg-blue-50 text-blue-600',
        description: 'Professional teeth whitening for a brighter, more confident smile.',
      },
      {
        name: 'Dental Checkup',
        category: 'Preventive',
        price: '₹500',
        duration: '30 min',
        popular: true,
        urgent: false,
        color: 'bg-blue-50 text-blue-600',
        description: 'Routine dental examination and cleaning.',
      },
    ]);
    if (sErr) console.error('Services Error:', sErr);

    // 2. Dentists
    const { error: dErr } = await supabase.from('dentists').insert([
      {
        full_name: 'Aisha Sharma',
        email: 'aisha@smilecare.com',
        phone: '9876543210',
        specialization: 'Orthodontist',
        qualification: 'BDS, MDS',
        experience_years: 8,
        bio: 'Specialist in braces and clear aligners.',
        emergency: false,
        services_list: ['Braces', 'Invisalign'],
        certifications: ['Invisalign Certified'],
        rating: 4.9,
      },
      {
        full_name: 'Rohan Gupta',
        email: 'rohan@smilecare.com',
        phone: '9876543211',
        specialization: 'Endodontist',
        qualification: 'BDS, MDS',
        experience_years: 12,
        bio: 'Expert in pain-free root canals.',
        emergency: true,
        services_list: ['Root Canal', 'Extractions'],
        certifications: ['Board Certified'],
        rating: 4.7,
      },
    ]);
    if (dErr) console.error('Dentists Error:', dErr);

    // 3. Staff
    const { error: stErr } = await supabase.from('staff').insert([
      {
        full_name: 'Priya Patel',
        email: 'priya@smilecare.com',
        role: 'receptionist',
        status: 'active',
        phone: '9876543212',
        department: 'Front Desk',
        join_date: new Date().toISOString().split('T')[0],
      },
      {
        full_name: 'Vikram Singh',
        email: 'vikram@smilecare.com',
        role: 'nurse',
        status: 'active',
        phone: '9876543213',
        department: 'Clinical',
        join_date: new Date().toISOString().split('T')[0],
      },
    ]);
    if (stErr) console.error('Staff Error:', stErr);

    // 4. Inventory
    const { error: iErr } = await supabase.from('inventory').insert([
      {
        item: 'Latex Gloves',
        category: 'Consumables',
        unit: 'Boxes',
        stock_quantity: 50,
        reorder_level: 10,
        status: 'In Stock',
        last_restocked: new Date().toISOString(),
      },
      {
        item: 'Dental Syringes',
        category: 'Instruments',
        unit: 'Pieces',
        stock_quantity: 5,
        reorder_level: 20,
        status: 'Low Stock',
        last_restocked: new Date().toISOString(),
      },
    ]);
    if (iErr) console.error('Inventory Error:', iErr);

    // 5. Queries
    const { error: qErr } = await supabase.from('queries').insert([
      {
        name: 'Karan Mehra',
        email: 'karan@example.com',
        phone: '9876543214',
        subject: 'Toothache Consultation',
        message: 'I have severe pain in my lower jaw. Can I get an urgent appointment?',
        status: 'unread',
      },
      {
        name: 'Neha Verma',
        email: 'neha@example.com',
        phone: '9876543215',
        subject: 'Teeth Whitening Cost',
        message: 'What are the charges for laser teeth whitening?',
        status: 'read',
      },
    ]);
    if (qErr) console.error('Queries Error:', qErr);

    return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
