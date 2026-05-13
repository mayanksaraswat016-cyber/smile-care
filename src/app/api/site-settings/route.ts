import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    // Get the first settings record
    const { data: existingData } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)
      .single();

    if (!existingData) {
      return NextResponse.json({ error: 'No settings found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('site_settings')
      .update(body)
      .eq('id', existingData.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
