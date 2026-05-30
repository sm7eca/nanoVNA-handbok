import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dealId = searchParams.get('deal_id');
  const companyId = searchParams.get('company_id');

  let query = supabaseServer.from('risks').select('*');
  if (dealId) query = query.eq('deal_id', dealId);
  else if (companyId) query = query.eq('company_id', companyId);
  else return NextResponse.json({ risks: [] });

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ risks: data });
}
