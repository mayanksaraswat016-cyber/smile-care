import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/resend';

// This endpoint can be triggered by a CRON job (e.g. Vercel Cron) once a day
export async function GET(request: Request) {
  try {
    const supabase = getSupabaseClient();

    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Find all confirmed appointments for tomorrow
    const { data: appointments, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', tomorrowStr)
      .eq('status', 'confirmed');

    if (fetchError) throw fetchError;

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ message: 'No appointments tomorrow, no reminders sent.' });
    }

    // Check existing reminders to avoid sending duplicates
    const { data: existingLogs } = await supabase
      .from('email_logs')
      .select('appointment_id')
      .eq('type', '24h_reminder');

    const remindedApptIds = new Set(existingLogs?.map((log) => log.appointment_id) || []);

    const logsToInsert = [];

    for (const app of appointments) {
      // Only send if we haven't already sent a reminder for this appointment
      if (!remindedApptIds.has(app.id) && app.email) {
        const subject = `Reminder: Your Appointment Tomorrow at ${app.appointment_time}`;

        const emailResult = await sendEmail({
          to: app.email,
          subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
              <h2 style="color: #ea580c;">Appointment Reminder ⏰</h2>
              <p>Dear ${app.patient_name || 'Patient'},</p>
              <p>This is a friendly reminder for your upcoming dental appointment tomorrow.</p>
              <div style="background: #fff7ed; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date:</strong> ${app.appointment_date}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${app.appointment_time}</p>
              </div>
              <p>Please arrive 10 minutes early. If you need to cancel or reschedule, please contact us immediately.</p>
              <br/>
              <p style="color: #64748b; font-size: 14px;">Regards,<br/>SmileCare Team</p>
            </div>
          `,
        });

        logsToInsert.push({
          type: '24h_reminder',
          recipient: app.email,
          subject,
          status: emailResult.success ? 'sent' : 'failed',
          appointment_id: app.id,
          sent_at: new Date().toISOString(),
        });
      }
    }

    if (logsToInsert.length > 0) {
      const { error: insertError } = await supabase.from('email_logs').insert(logsToInsert);
      if (insertError) throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${logsToInsert.length} reminders for ${tomorrowStr}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
