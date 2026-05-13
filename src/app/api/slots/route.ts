import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctor_id');
    const date = searchParams.get('date');

    let query = supabase.from('doctor_slots').select('*').order('start_time', { ascending: true });

    if (doctorId) query = query.eq('doctor_id', doctorId);
    if (date) query = query.eq('date', date);

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    const { doctor_id, date, work_start_time, work_end_time, slot_duration, buffer_time } = body;

    const slots = [];
    const [startH, startM] = work_start_time.split(':').map(Number);
    const [endH, endM] = work_end_time.split(':').map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const duration = slot_duration || 30;
    const buffer = buffer_time || 0;

    while (currentMinutes + duration <= endMinutes) {
      const startHr = Math.floor(currentMinutes / 60);
      const startMin = currentMinutes % 60;
      const endTotalMin = currentMinutes + duration;
      const endHr = Math.floor(endTotalMin / 60);
      const endMin = endTotalMin % 60;

      slots.push({
        doctor_id,
        date,
        start_time: `${String(startHr).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`,
        end_time: `${String(endHr).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`,
        availability: true,
        buffer_time: buffer,
      });

      currentMinutes += duration + buffer;
    }

    await supabase.from('doctor_slots').delete().eq('doctor_id', doctor_id).eq('date', date);

    const { data, error } = await supabase.from('doctor_slots').insert(slots).select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { data, error } = await supabase.from('doctor_slots').update(body).eq('id', id).select();
    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const doctorId = searchParams.get('doctor_id');
    const date = searchParams.get('date');

    if (id) {
      const { error } = await supabase.from('doctor_slots').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (doctorId && date) {
      const { error } = await supabase
        .from('doctor_slots')
        .delete()
        .eq('doctor_id', doctorId)
        .eq('date', date);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
