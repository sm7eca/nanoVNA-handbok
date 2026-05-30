import { CheckCircle2, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AIScreeningResult } from '@/types';

const recommendationConfig = {
  Proceed: { label: 'Gå vidare', variant: 'green' as const, icon: CheckCircle2 },
  'Proceed to DD': { label: 'Gå vidare till DD', variant: 'green' as const, icon: CheckCircle2 },
  Park: { label: 'Parkera', variant: 'yellow' as const, icon: AlertCircle },
  Decline: { label: 'Avböj', variant: 'red' as const, icon: XCircle },
};

interface Props { screening: AIScreeningResult }

export function ScreeningResult({ screening }: Props) {
  const rec = recommendationConfig[screening.recommendation] || recommendationConfig.Park;
  const RecIcon = rec.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 bg-slate-50">
        <RecIcon className={`h-6 w-6 shrink-0 ${rec.variant === 'green' ? 'text-green-600' : rec.variant === 'red' ? 'text-red-600' : 'text-yellow-600'}`} />
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">AI-rekommendation</p>
          <p className="font-semibold text-slate-900">{rec.label}</p>
        </div>
        <Badge variant={rec.variant} className="ml-auto">{rec.label}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoBlock label="Bolagssammanfattning" value={screening.company_summary} />
        <InfoBlock label="Affärsmodell" value={screening.business_model} />
        <InfoBlock label="Kundproblem" value={screening.customer_problem} />
        <InfoBlock label="Produkt / Lösning" value={screening.solution} />
        <InfoBlock label="Marknad" value={screening.market} />
        <InfoBlock label="Team" value={screening.team} />
        <InfoBlock label="Kapitalbehov" value={screening.capital_need} />
        <InfoBlock label="Starbright-fit" value={screening.starbright_fit} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ListBlock label="Styrkor" items={screening.strengths} variant="green" />
        <ListBlock label="Risker" items={screening.risks} variant="red" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Frågor till första mötet</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {screening.first_meeting_questions.map((q, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <ChevronRight className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                {q}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
        <p className="text-xs font-medium text-blue-700 mb-1">Rekommenderat nästa steg</p>
        <p className="text-sm text-blue-900">{screening.recommended_next_step}</p>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-slate-800">{value || '–'}</p>
    </div>
  );
}

function ListBlock({ label, items, variant }: { label: string; items: string[]; variant: 'green' | 'red' }) {
  const color = variant === 'green' ? 'text-green-600' : 'text-red-500';
  const dot = variant === 'green' ? '●' : '●';
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">{label}</p>
      <ul className="space-y-1.5">
        {(items || []).map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-700">
            <span className={`${color} shrink-0`}>{dot}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
