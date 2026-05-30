import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dealId = searchParams.get('deal_id');
  if (!dealId) return NextResponse.json({ assessments: [] });

  const { data, error } = await supabaseServer
    .from('assessments')
    .select('*')
    .eq('deal_id', dealId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ assessments: data });
}
