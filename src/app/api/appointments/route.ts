import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    
    // Normalize time to 24h format for database matching
    let time24 = body.appointment_time;
    if (time24 && (time24.includes('AM') || time24.includes('PM'))) {
      const [time, modifier] = time24.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
      time24 = `${hours.padStart(2, '0')}:${minutes}`;
    }

    // 1. Check if the slot is still available
    if (body.dentist_id && body.appointment_date && time24) {
      const { data: slotData } = await supabase
        .from('doctor_slots')
        .select('availability')
        .eq('doctor_id', body.dentist_id)
        .eq('date', body.appointment_date)
        .eq('start_time', time24)
        .single();
        
      if (slotData && !slotData.availability) {
         return NextResponse.json({ error: "This slot has already been booked by another user." }, { status: 400 });
      }
    }

    // 2. Insert the appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert([body])
      .select();

    if (error) throw error;
    
    const appointment = data[0];

    // 3. Mark the slot as booked
    if (body.dentist_id && body.appointment_date && time24) {
      await supabase
        .from('doctor_slots')
        .update({ availability: false, appointment_id: appointment.id })
        .eq('doctor_id', body.dentist_id)
        .eq('date', body.appointment_date)
        .eq('start_time', time24);
    }

    // 4. Log the automated confirmation email
    if (body.email) {
      const subject = `Appointment Confirmed: ${body.appointment_date} at ${body.appointment_time}`;
      
      // Send real email via Resend
      const emailResult = await sendEmail({
        to: body.email,
        subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #0f766e;">Appointment Confirmed! 🎉</h2>
            <p>Dear ${body.patient_name || 'Patient'},</p>
            <p>Your appointment has been successfully scheduled.</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Date:</strong> ${body.appointment_date}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${body.appointment_time}</p>
            </div>
            <p>We look forward to seeing you at SmileCare Clinic.</p>
            <br/>
            <p style="color: #64748b; font-size: 14px;">Regards,<br/>SmileCare Team</p>
          </div>
        `
      });

      await supabase.from('email_logs').insert([{
        type: 'appointment_confirmation',
        recipient: body.email,
        subject,
        status: emailResult.success ? 'sent' : 'failed',
        appointment_id: appointment.id
      }]);
    }

    return NextResponse.json(appointment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('appointments')
      .select('*, services(name, price)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
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

    const { data, error } = await supabase.from('appointments').update(body).eq('id', id).select();
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

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
