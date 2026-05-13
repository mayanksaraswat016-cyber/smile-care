import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const id = searchParams.get('id');

    if (id) {
      const { data, error } = await supabase.from('invoices').select('*').eq('id', id).single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    let query = supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

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

    const items = body.items || [];
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
    const total_gst = items.reduce((sum: number, item: any) => sum + (item.gst_amount || 0), 0);
    const discount = body.discount || 0;
    const total = subtotal + total_gst - discount;

    const { count } = await supabase.from('invoices').select('id', { count: 'exact', head: true });
    const invoiceNumber = `INV-${String((count || 0) + 1).padStart(4, '0')}`;

    const invoice = {
      ...body,
      invoice_number: invoiceNumber,
      subtotal,
      total_gst,
      discount,
      total,
      status: body.status || 'pending',
      issued_date: new Date().toISOString().split('T')[0],
      due_date: body.due_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    };

    const { data, error } = await supabase.from('invoices').insert([invoice]).select();
    if (error) throw error;
    return NextResponse.json(data[0]);
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

    const { data, error } = await supabase.from('invoices').update(body).eq('id', id).select();
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

    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
