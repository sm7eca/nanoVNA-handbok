export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { supabaseServer } from '@/lib/supabase-server';
import { DealStatusBadge } from '@/components/deals/DealStatusBadge';
import { AIActionsBar } from './AIActionsBar';
import { ScreeningResult } from '@/components/screening/ScreeningResult';
import { PhilosophyFit } from '@/components/screening/PhilosophyFit';
import { RiskList } from '@/components/screening/RiskList';
import { DDQuestions } from '@/components/screening/DDQuestions';
import { DecisionTimeline } from './DecisionTimeline';
import { DecisionForm } from '@/components/deals/DecisionForm';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Deal, Assessment, Risk, DDQuestion, Decision, PhilosophyFitProposal } from '@/types';

interface PageProps {
  params: { id: string };
}

async function getDealData(id: string) {
  const [dealRes, assessmentsRes, risksRes, ddRes, decisionsRes] = await Promise.all([
    supabaseServer.from('deals').select('*, company:companies(*)').eq('id', id).single(),
    supabaseServer.from('assessments').select('*').eq('deal_id', id),
    supabaseServer.from('risks').select('*').eq('deal_id', id).order('risk_level'),
    supabaseServer.from('dd_questions').select('*').eq('deal_id', id).order('module').order('priority'),
    supabaseServer.from('decisions').select('*').eq('deal_id', id).order('created_at', { ascending: false }),
  ]);

  return {
    deal: dealRes.data as Deal | null,
    assessments: (assessmentsRes.data || []) as Assessment[],
    risks: (risksRes.data || []) as Risk[],
    ddQuestions: (ddRes.data || []) as DDQuestion[],
    decisions: (decisionsRes.data || []) as Decision[],
  };
}

export default async function DealDetailPage({ params }: PageProps) {
  const { deal, assessments, risks, ddQuestions, decisions } = await getDealData(params.id);

  if (!deal) notFound();

  const company = deal.company;
  const philosophyAssessment = assessments.find(a => a.assessment_type === 'philosophy_fit');
  const philosophyProposal = philosophyAssessment?.ai_proposal as PhilosophyFitProposal | undefined;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back link */}
      <Link
        href="/deals"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Tillbaka till case
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{company?.name}</h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <DealStatusBadge status={deal.status} />
            {company?.sector && (
              <span className="text-sm text-slate-500">{company.sector}</span>
            )}
            {deal.responsible_im && (
              <span className="text-sm text-slate-500">IM: {deal.responsible_im}</span>
            )}
            {deal.deal_source && (
              <span className="text-sm text-slate-500">Källa: {deal.deal_source}</span>
            )}
          </div>
        </div>
        <div className="text-right text-xs text-slate-400 shrink-0">
          <p>Skapad {formatDate(deal.created_at)}</p>
          <p>Uppdaterad {formatDate(deal.updated_at)}</p>
        </div>
      </div>

      {/* Deal meta */}
      {(deal.capital_need || deal.proposed_investment || deal.valuation_pre) && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {deal.capital_need && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Kapitalbehov</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{formatCurrency(deal.capital_need)}</p>
                </div>
              )}
              {deal.proposed_investment && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Föreslagen inv.</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{formatCurrency(deal.proposed_investment)}</p>
                </div>
              )}
              {deal.valuation_pre && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Pre-money</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{formatCurrency(deal.valuation_pre)}</p>
                </div>
              )}
              {deal.ownership_percentage && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Ägarandel</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{deal.ownership_percentage}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {(deal as unknown as { notes?: string }).notes && (
        <Card>
          <CardHeader>
            <CardTitle>Anteckningar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{(deal as unknown as { notes?: string }).notes}</p>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* AI Actions */}
      <AIActionsBar
        dealId={deal.id}
        hasScreening={!!deal.ai_screening}
        hasPhilosophyFit={!!philosophyProposal}
        hasRisks={risks.length > 0}
        hasDDQuestions={ddQuestions.length > 0}
      />

      {/* Screening Result */}
      {deal.ai_screening && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">AI Screening</h2>
          <ScreeningResult screening={deal.ai_screening} />
        </section>
      )}

      {/* Philosophy Fit */}
      {philosophyProposal && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Starbright Filosofi-fit</h2>
          <PhilosophyFit proposal={philosophyProposal} />
        </section>
      )}

      {/* Risks */}
      {risks.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Risker</h2>
          <RiskList risks={risks} />
        </section>
      )}

      {/* DD Questions */}
      {ddQuestions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">DD-frågor</h2>
          <DDQuestions questions={ddQuestions} />
        </section>
      )}

      <Separator />

      {/* Decision Log */}
      {decisions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Beslutslögg</h2>
          <DecisionTimeline decisions={decisions} />
        </section>
      )}

      {/* Decision Form */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Logga beslut</h2>
        <DecisionForm
          dealId={deal.id}
          companyId={deal.company_id}
          onSaved={() => {}}
        />
      </section>
    </div>
  );
}
