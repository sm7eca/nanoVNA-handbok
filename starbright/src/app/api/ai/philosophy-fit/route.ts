import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { assessPhilosophyFit } from '@/lib/anthropic';

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

    const proposal = await assessPhilosophyFit(deal.ai_screening, deal.company?.name || '');

    await supabaseServer.from('assessments').upsert({
      company_id: deal.company_id,
      deal_id: dealId,
      assessment_type: 'philosophy_fit',
      ai_proposal: proposal,
      status: 'ai_generated',
      source: 'ai',
    }, { onConflict: 'deal_id,assessment_type' });

    return NextResponse.json({ proposal });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
