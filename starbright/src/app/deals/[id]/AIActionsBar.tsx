'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, Brain, AlertTriangle, BookOpen, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIActionsBarProps {
  dealId: string;
  hasScreening: boolean;
  hasPhilosophyFit: boolean;
  hasRisks: boolean;
  hasDDQuestions: boolean;
}

type ActionKey = 'screen' | 'philosophy' | 'risks' | 'dd';

export function AIActionsBar({
  dealId,
  hasScreening,
  hasPhilosophyFit,
  hasRisks,
  hasDDQuestions,
}: AIActionsBarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<ActionKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAction = async (key: ActionKey, endpoint: string) => {
    setLoading(key);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Något gick fel');
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(null);
    }
  };

  const actions = [
    {
      key: 'screen' as ActionKey,
      label: hasScreening ? 'Kör screening igen' : 'Kör AI-screening',
      icon: Sparkles,
      done: hasScreening,
      endpoint: '/api/ai/screen',
      disabled: false,
    },
    {
      key: 'philosophy' as ActionKey,
      label: hasPhilosophyFit ? 'Uppdatera filosofi-fit' : 'Bedöm filosofi-fit',
      icon: Brain,
      done: hasPhilosophyFit,
      endpoint: '/api/ai/philosophy-fit',
      disabled: !hasScreening,
    },
    {
      key: 'risks' as ActionKey,
      label: hasRisks ? 'Uppdatera risker' : 'Identifiera risker',
      icon: AlertTriangle,
      done: hasRisks,
      endpoint: '/api/ai/risks',
      disabled: !hasScreening,
    },
    {
      key: 'dd' as ActionKey,
      label: hasDDQuestions ? 'Uppdatera DD-frågor' : 'Generera DD-frågor',
      icon: BookOpen,
      done: hasDDQuestions,
      endpoint: '/api/ai/dd-questions',
      disabled: !hasScreening,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">AI-analyser</h2>
      </div>

      {loading === 'screen' && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800">Analyserar pitch deck...</p>
            <p className="text-xs text-blue-600">Detta tar 30–60 sekunder</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {actions.map(({ key, label, icon: Icon, done, endpoint, disabled }) => (
          <Button
            key={key}
            variant={done ? 'outline' : 'default'}
            size="sm"
            disabled={loading !== null || disabled}
            onClick={() => runAction(key, endpoint)}
            className={done ? 'border-green-300 text-green-700 hover:bg-green-50' : ''}
          >
            {loading === key ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : done ? (
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Icon className="h-3.5 w-3.5" />
            )}
            {label}
          </Button>
        ))}
      </div>

      {!hasScreening && (
        <p className="text-xs text-slate-400">
          Kör AI-screening först för att låsa upp filosofi-fit, risker och DD-frågor.
        </p>
      )}
    </div>
  );
}
