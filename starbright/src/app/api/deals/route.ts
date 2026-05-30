import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  const { data, error } = await supabaseServer
    .from('deals')
    .select('*, company:companies(*)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deals: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { company_name, sector, website, deal_source, responsible_im, notes, pitch_deck_url, pitch_deck_text } = body;

  // Create company
  const { data: company, error: companyError } = await supabaseServer
    .from('companies')
    .insert({ name: company_name, sector, website, responsible_im, status: 'lead' })
    .select()
    .single();

  if (companyError) return NextResponse.json({ error: companyError.message }, { status: 500 });

  // Create deal
  const { data: deal, error: dealError } = await supabaseServer
    .from('deals')
    .insert({
      company_id: company.id,
      deal_source,
      responsible_im,
      notes,
      pitch_deck_url,
      pitch_deck_text,
      status: 'new',
    })
    .select()
    .single();

  if (dealError) return NextResponse.json({ error: dealError.message }, { status: 500 });
  return NextResponse.json({ deal, company }, { status: 201 });
}
