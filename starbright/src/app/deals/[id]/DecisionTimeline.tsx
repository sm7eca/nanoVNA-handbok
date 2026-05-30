import { formatDateTime } from '@/lib/utils';
import { DECISION_LABELS } from '@/types';
import type { Decision, DecisionValue } from '@/types';

interface DecisionTimelineProps {
  decisions: Decision[];
}

const decisionColors: Record<DecisionValue, string> = {
  proceed: 'bg-blue-500',
  proceed_to_dd: 'bg-blue-600',
  invest: 'bg-green-600',
  not_invest: 'bg-red-500',
  invest_with_conditions: 'bg-green-500',
  park: 'bg-yellow-500',
  decline: 'bg-red-600',
  follow_on: 'bg-green-500',
  no_follow_on: 'bg-slate-400',
  prepare_exit: 'bg-orange-500',
  first_meeting: 'bg-blue-400',
};

export function DecisionTimeline({ decisions }: DecisionTimelineProps) {
  return (
    <div className="relative space-y-4 pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
      {decisions.map(decision => {
        const dotColor = decisionColors[decision.decision] ?? 'bg-slate-400';
        return (
          <div key={decision.id} className="relative">
            <div className={`absolute -left-5 top-1.5 h-3 w-3 rounded-full ${dotColor} ring-2 ring-white`} />
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <span className="font-semibold text-sm text-slate-900">
                    {DECISION_LABELS[decision.decision] ?? decision.decision}
                  </span>
                  {decision.decision_type && (
                    <span className="ml-2 text-xs text-slate-400">{decision.decision_type}</span>
                  )}
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                  {formatDateTime(decision.decision_date || decision.created_at)}
                </span>
              </div>
              {decision.decision_maker && (
                <p className="text-xs text-slate-500 mb-2">Beslutsfattare: {decision.decision_maker}</p>
              )}
              {decision.rationale && (
                <p className="text-sm text-slate-700">{decision.rationale}</p>
              )}
              {decision.conditions && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    <span className="font-medium">Villkor:</span> {decision.conditions}
                  </p>
                </div>
              )}
              {decision.next_action && (
                <div className="mt-1">
                  <p className="text-xs text-slate-500">
                    <span className="font-medium">Nästa åtgärd:</span> {decision.next_action}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
