import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { identifyRisks } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  try {
    const { dealId } = await request.json();
    const { data: deal, error } = await supabaseServer
      .from('deals')
      .select('*, company:companies(*)')
      .eq('id', dealId)
      .single();

    if (error || !deal?.ai_screening) {
      return NextResponse.json({ error: 'Kör screening först' }, { status: 400 });
    }

    const risks = await identifyRisks(deal.ai_screening, deal.company?.name || '');

    const toInsert = risks.map(r => ({ ...r, company_id: deal.company_id, deal_id: dealId }));
    const { data: inserted, error: insertError } = await supabaseServer
      .from('risks')
      .insert(toInsert)
      .select();

    if (insertError) throw insertError;
    return NextResponse.json({ risks: inserted });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
