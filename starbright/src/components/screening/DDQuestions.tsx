'use client';
import { useState } from 'react';
import type { DDQuestion } from '@/types';
import { Badge } from '@/components/ui/badge';

const priorityConfig = {
  high: { label: 'Hög prioritet', variant: 'red' as const },
  medium: { label: 'Medium', variant: 'yellow' as const },
  low: { label: 'Låg', variant: 'secondary' as const },
};

function groupByModule(questions: DDQuestion[]) {
  return questions.reduce<Record<string, DDQuestion[]>>((acc, q) => {
    const mod = q.module || 'Övrigt';
    (acc[mod] = acc[mod] || []).push(q);
    return acc;
  }, {});
}

export function DDQuestions({ questions }: { questions: DDQuestion[] }) {
  const [checked, setChecked] = useState<Set<string>>(
    new Set(questions.filter(q => q.status === 'answered').map(q => q.id))
  );

  if (!questions.length) return <p className="text-sm text-slate-400">Inga DD-frågor genererade ännu.</p>;

  const grouped = groupByModule(questions);
  const answeredCount = checked.size;

  const toggleCheck = async (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    await fetch(`/api/dd-questions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: checked.has(id) ? 'open' : 'answered' }),
    }).catch(() => {});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>{answeredCount} av {questions.length} besvarade</span>
        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {Object.entries(grouped).map(([module, qs]) => (
        <div key={module}>
          <h4 className="font-medium text-slate-700 mb-2 text-sm">{module}</h4>
          <div className="space-y-2">
            {qs.map(q => {
              const isAnswered = checked.has(q.id);
              const prio = priorityConfig[q.priority as keyof typeof priorityConfig] || priorityConfig.medium;
              return (
                <label
                  key={q.id}
                  className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isAnswered ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-white hover:border-blue-200'}`}
                >
                  <input
                    type="checkbox"
                    checked={isAnswered}
                    onChange={() => toggleCheck(q.id)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={prio.variant} className="text-xs">{prio.label}</Badge>
                    </div>
                    <p className={`text-sm ${isAnswered ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {q.question}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
