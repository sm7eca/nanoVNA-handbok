import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dealId = searchParams.get('deal_id');
  if (!dealId) return NextResponse.json({ decisions: [] });

  const { data, error } = await supabaseServer
    .from('decisions')
    .select('*')
    .eq('deal_id', dealId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ decisions: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabaseServer
    .from('decisions')
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update deal status based on decision
  const statusMap: Record<string, string> = {
    first_meeting: 'first_meeting',
    proceed: 'screening',
    proceed_to_dd: 'dd',
    invest: 'closing',
    not_invest: 'declined',
    invest_with_conditions: 'term_sheet',
    park: 'parked',
    decline: 'declined',
  };
  const newStatus = statusMap[body.decision];
  if (newStatus && body.deal_id) {
    await supabaseServer.from('deals').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', body.deal_id);
  }

  return NextResponse.json({ decision: data }, { status: 201 });
}
