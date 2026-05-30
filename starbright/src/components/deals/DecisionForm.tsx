'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { DECISION_LABELS, type DecisionValue } from '@/types';

interface Props {
  dealId: string;
  companyId: string;
  onSaved: () => void;
}

const decisionOptions: { value: DecisionValue; label: string }[] = [
  { value: 'first_meeting', label: 'Boka första möte' },
  { value: 'proceed', label: 'Gå vidare' },
  { value: 'proceed_to_dd', label: 'Gå vidare till DD' },
  { value: 'invest', label: 'Investera' },
  { value: 'invest_with_conditions', label: 'Investera med villkor' },
  { value: 'not_invest', label: 'Investera inte' },
  { value: 'park', label: 'Parkera' },
  { value: 'decline', label: 'Avböj' },
];

export function DecisionForm({ dealId, companyId, onSaved }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    decision_type: 'Screening-beslut',
    decision: 'proceed' as DecisionValue,
    decision_maker: '',
    rationale: '',
    conditions: '',
    next_action: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, deal_id: dealId, company_id: companyId }),
      });
      onSaved();
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Beslutstyp</Label>
          <Input
            value={form.decision_type}
            onChange={e => setForm(f => ({ ...f, decision_type: e.target.value }))}
            placeholder="t.ex. Screening-beslut"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Beslut *</Label>
          <select
            className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            value={form.decision}
            onChange={e => setForm(f => ({ ...f, decision: e.target.value as DecisionValue }))}
          >
            {decisionOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Beslutsfattare</Label>
        <Input
          placeholder="Namn"
          value={form.decision_maker}
          onChange={e => setForm(f => ({ ...f, decision_maker: e.target.value }))}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Motivering *</Label>
        <Textarea
          required
          rows={3}
          placeholder="Varför detta beslut?"
          value={form.rationale}
          onChange={e => setForm(f => ({ ...f, rationale: e.target.value }))}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Villkor</Label>
        <Input
          placeholder="Eventuella villkor för beslutet"
          value={form.conditions}
          onChange={e => setForm(f => ({ ...f, conditions: e.target.value }))}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Nästa åtgärd</Label>
        <Input
          placeholder="Konkret nästa steg"
          value={form.next_action}
          onChange={e => setForm(f => ({ ...f, next_action: e.target.value }))}
        />
      </div>
      <Button type="submit" disabled={loading || !form.rationale}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Spara beslut
      </Button>
    </form>
  );
}
