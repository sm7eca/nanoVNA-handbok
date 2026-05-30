import type { PhilosophyFitProposal, PhilosophyQuestion } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

function TrafficLight({ level }: { level: 'green' | 'yellow' | 'red' }) {
  const config = {
    green: { bg: 'bg-green-500', label: 'Grön' },
    yellow: { bg: 'bg-yellow-400', label: 'Gul' },
    red: { bg: 'bg-red-500', label: 'Röd' },
  };
  const c = config[level];
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-3 w-3 rounded-full ${c.bg}`} />
      <span className="text-xs font-medium text-slate-600">{c.label}</span>
    </div>
  );
}

function QuestionRow({ question }: { question: PhilosophyQuestion }) {
  return (
    <div className="border-b border-slate-100 last:border-0 py-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <p className="font-medium text-slate-900 text-sm">{question.label}</p>
        <TrafficLight level={question.traffic_light} />
      </div>
      <p className="text-sm text-slate-600 mb-3">{question.ai_answer}</p>
      {question.follow_up_questions?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-400 mb-1">Fördjupningsfrågor</p>
          <ul className="space-y-1">
            {question.follow_up_questions.map((q, i) => (
              <li key={i} className="text-xs text-slate-500">• {q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PhilosophyFit({ proposal }: { proposal: PhilosophyFitProposal }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <span className="text-sm font-medium text-slate-600">Övergripande bedömning:</span>
        <TrafficLight level={proposal.overall_fit} />
        <span className="text-sm text-slate-700 flex-1">{proposal.summary}</span>
      </div>

      <Card>
        <CardContent className="px-6 py-2">
          <QuestionRow question={proposal.forstar_vi_affaren} />
          <QuestionRow question={proposal.tror_vi_pa_teamet} />
          <QuestionRow question={proposal.kan_vi_gora_skillnad} />
        </CardContent>
      </Card>
    </div>
  );
}
