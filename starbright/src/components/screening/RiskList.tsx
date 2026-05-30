import type { Risk, RiskLevel } from '@/types';
import { Badge } from '@/components/ui/badge';

const riskLevelConfig: Record<RiskLevel, { label: string; variant: 'red' | 'yellow' | 'green'; dot: string }> = {
  red: { label: 'Hög', variant: 'red', dot: 'bg-red-500' },
  yellow: { label: 'Medium', variant: 'yellow', dot: 'bg-yellow-400' },
  green: { label: 'Låg', variant: 'green', dot: 'bg-green-500' },
};

export function RiskList({ risks }: { risks: Risk[] }) {
  if (!risks.length) return <p className="text-sm text-slate-400">Inga risker identifierade ännu.</p>;

  const sorted = [...risks].sort((a, b) => {
    const order = { red: 0, yellow: 1, green: 2 };
    return (order[a.risk_level as RiskLevel] ?? 1) - (order[b.risk_level as RiskLevel] ?? 1);
  });

  return (
    <div className="space-y-3">
      {sorted.map(risk => {
        const cfg = riskLevelConfig[risk.risk_level as RiskLevel] || riskLevelConfig.yellow;
        return (
          <div key={risk.id} className="flex gap-3 p-4 rounded-lg border border-slate-200 bg-white">
            <div className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                {risk.risk_type && (
                  <span className="text-xs text-slate-500">{risk.risk_type}</span>
                )}
                {!risk.im_reviewed && (
                  <span className="text-xs text-slate-400 italic">AI-förslag</span>
                )}
              </div>
              <p className="text-sm text-slate-800 mb-1">{risk.description}</p>
              {risk.mitigation && (
                <p className="text-xs text-slate-500">
                  <span className="font-medium">Hantering:</span> {risk.mitigation}
                </p>
              )}
              <div className="flex gap-3 mt-1.5 text-xs text-slate-400">
                {risk.probability && <span>Sannolikhet: {risk.probability === 'high' ? 'Hög' : risk.probability === 'medium' ? 'Medium' : 'Låg'}</span>}
                {risk.impact && <span>Konsekvens: {risk.impact === 'high' ? 'Hög' : risk.impact === 'medium' ? 'Medium' : 'Låg'}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
