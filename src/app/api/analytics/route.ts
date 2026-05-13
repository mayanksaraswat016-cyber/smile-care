import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Get appointments with billing data
    let appointmentQuery = supabase
      .from('appointments')
      .select('*, services(name, price)')
      .order('appointment_date', { ascending: false });
    if (startDate) appointmentQuery = appointmentQuery.gte('appointment_date', startDate);
    if (endDate) appointmentQuery = appointmentQuery.lte('appointment_date', endDate);
    const { data: appointments } = await appointmentQuery;

    // Get invoices
    let invoiceQuery = supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    if (startDate) invoiceQuery = invoiceQuery.gte('issued_date', startDate);
    if (endDate) invoiceQuery = invoiceQuery.lte('issued_date', endDate);
    const { data: invoices } = await invoiceQuery;

    // Get dentists for doctor performance
    const { data: dentists } = await supabase.from('dentists').select('id, full_name');

    // Calculate KPIs
    const totalRevenue = Array.isArray(invoices)
      ? invoices.reduce((sum: number, inv: any) => sum + (inv.status === 'paid' ? inv.total : 0), 0)
      : 0;
    const pendingPayments = Array.isArray(invoices)
      ? invoices
          .filter((inv: any) => inv.status === 'pending' || inv.status === 'overdue')
          .reduce((sum: number, inv: any) => sum + inv.total, 0)
      : 0;
    const totalAppointments = Array.isArray(appointments) ? appointments.length : 0;
    const completedAppointments = Array.isArray(appointments)
      ? appointments.filter((a: any) => a.status === 'completed').length
      : 0;
    const utilizationRate =
      totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;

    // Revenue by treatment
    const treatmentRevenue: Record<string, { revenue: number; count: number }> = {};
    if (Array.isArray(invoices)) {
      invoices.forEach((inv: any) => {
        if (inv.items && Array.isArray(inv.items)) {
          inv.items.forEach((item: any) => {
            if (!treatmentRevenue[item.treatment]) {
              treatmentRevenue[item.treatment] = { revenue: 0, count: 0 };
            }
            treatmentRevenue[item.treatment].revenue += item.total + item.gst_amount;
            treatmentRevenue[item.treatment].count += item.quantity;
          });
        }
      });
    }

    // Doctor performance
    const doctorPerformance: Record<string, { revenue: number; appointments: number }> = {};
    if (Array.isArray(dentists) && Array.isArray(appointments)) {
      dentists.forEach((d: any) => {
        doctorPerformance[d.id] = { revenue: 0, appointments: 0 };
      });
      appointments.forEach((a: any) => {
        if (a.dentist_id && doctorPerformance[a.dentist_id]) {
          doctorPerformance[a.dentist_id].appointments++;
        }
      });
    }

    // Payment status breakdown
    const paidCount = Array.isArray(invoices)
      ? invoices.filter((i: any) => i.status === 'paid').length
      : 0;
    const pendingCount = Array.isArray(invoices)
      ? invoices.filter((i: any) => i.status === 'pending').length
      : 0;
    const overdueCount = Array.isArray(invoices)
      ? invoices.filter((i: any) => i.status === 'overdue').length
      : 0;

    return NextResponse.json({
      kpis: {
        totalRevenue,
        pendingPayments,
        totalAppointments,
        completedAppointments,
        utilizationRate,
      },
      treatmentRevenue: Object.entries(treatmentRevenue).map(([treatment, data]) => ({
        treatment,
        ...data,
        percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
      })),
      doctorPerformance: Array.isArray(dentists)
        ? dentists.map((d: any) => ({
            doctor_id: d.id,
            doctor_name: d.full_name,
            appointments: doctorPerformance[d.id]?.appointments || 0,
            revenue: doctorPerformance[d.id]?.revenue || 0,
          }))
        : [],
      paymentStatus: { paid: paidCount, pending: pendingCount, overdue: overdueCount },
      recentInvoices: Array.isArray(invoices) ? invoices.slice(0, 10) : [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
