import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { generateDDQuestions } from '@/lib/anthropic';

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

    const { data: existingRisks } = await supabaseServer
      .from('risks')
      .select('risk_type, description')
      .eq('deal_id', dealId);

    const questions = await generateDDQuestions(
      deal.ai_screening,
      existingRisks || [],
      deal.company?.name || ''
    );

    const toInsert = questions.map(q => ({ ...q, company_id: deal.company_id, deal_id: dealId }));
    const { data: inserted, error: insertError } = await supabaseServer
      .from('dd_questions')
      .insert(toInsert)
      .select();

    if (insertError) throw insertError;
    return NextResponse.json({ questions: inserted });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
