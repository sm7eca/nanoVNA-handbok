import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { screenDeal } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  try {
    const { dealId } = await request.json();
    if (!dealId) return NextResponse.json({ error: 'dealId required' }, { status: 400 });

    const { data: deal, error: dealError } = await supabaseServer
      .from('deals')
      .select('*, company:companies(*)')
      .eq('id', dealId)
      .single();

    if (dealError || !deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 });

    const pitchText = deal.pitch_deck_text || '';
    const notes = deal.notes || '';
    const companyName = deal.company?.name || 'Okänt bolag';

    const screening = await screenDeal(pitchText, companyName, notes);

    await supabaseServer.from('deals').update({
      ai_screening: screening,
      recommendation: screening.recommendation,
      status: deal.status === 'new' ? 'screening' : deal.status,
      updated_at: new Date().toISOString(),
    }).eq('id', dealId);

    // Save as assessment
    await supabaseServer.from('assessments').upsert({
      company_id: deal.company_id,
      deal_id: dealId,
      assessment_type: 'financial',
      ai_proposal: screening,
      status: 'ai_generated',
      source: 'pitch_deck',
    }, { onConflict: 'deal_id,assessment_type' });

    return NextResponse.json({ screening });
  } catch (error) {
    console.error('Screening error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
